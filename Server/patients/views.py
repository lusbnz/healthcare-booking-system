# patients/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsPatient, IsAdmin
from .models import PatientProfile
from .serializers import PatientProfileSerializer
from rest_framework import generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from rest_framework.request import Request          
from users.models import User   
from django_filters.rest_framework import DjangoFilterBackend
from .filters import AppointmentFilter
from rest_framework import viewsets, permissions,serializers, status
from rest_framework.response import Response
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer

from users.permissions import IsPatient
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from doctors.models import DoctorProfile
from doctors.serializers import DoctorProfileSerializer
from records.models import MedicalRecord
from records.serializers import MedicalRecordSerializer
from notifications.models import Notification
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, permissions
from users.permissions import IsPatient
from django.contrib.auth import get_user_model
from users.serializers import DoctorForPatientSerializer


from typing import cast


from users.serializers import MeSerializer, PatientProfileSerializer

class PatientProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT /api/patients/me/profile/
    Chỉ patient được update chính họ.
    """
    serializer_class = MeSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        # cập nhật các trường user
        user_fields = ['phone_number', 'email', 'username']
        for field in user_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        # cập nhật profile
        profile, _ = PatientProfile.objects.get_or_create(user=user)
        profile_data = request.data.get('profile', {})
        serializer = PatientProfileSerializer(profile, data=profile_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MeSerializer(user).data)


class PatientDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    def get(self, request: Request, *args, **kwargs):
        user = request.user
        profile, _ = PatientProfile.objects.get_or_create(user=user)
        upcoming = Appointment.objects.filter(
            patient=profile,
            status='pending'
        ).count()
        unread = Notification.objects.filter(
            recipient=user,
            read=False
        ).count()
        return Response({
            'upcoming_appointments': upcoming,
            'unread_notifications': unread,
        })


# class PatientDoctorListView(generics.ListAPIView):
#     permission_classes = [permissions.IsAuthenticated, IsPatient]
#     serializer_class = DoctorProfileSerializer

#     def get_queryset(self):
#         qs = DoctorProfile.objects.all()
#         specialty = self.request.query_params.get('specialty')
#         city = self.request.query_params.get('city')
#         if specialty:
#             # specialty là CharField trên DoctorProfile
#             qs = qs.filter(specialty__icontains=specialty)
#         if city:
#             # giả sử city nằm trong address
#             qs = qs.filter(address__icontains=city)
#         return qs

class PatientDoctorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class   = DoctorForPatientSerializer

    def get_queryset(self):
        qs = User.objects.filter(user_type='doctor')
        specialty = self.request.query_params.get('specialty')
        city      = self.request.query_params.get('city')

        # Chỉ lọc những doctor đã có doctor_profile nếu cần filter theo specialty hoặc address
        if specialty:
            qs = qs.filter(doctor_profile__specialty__icontains=specialty)
        if city:
            qs = qs.filter(doctor_profile__address__icontains=city)

        return qs


# class PatientBookingCreateView(generics.CreateAPIView):
#     permission_classes = [permissions.IsAuthenticated, IsPatient]
#     serializer_class = AppointmentSerializer

#     def perform_create(self, serializer):
#         profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
#         serializer.save(patient=profile)

class PatientBookingCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class  = AppointmentSerializer

    def perform_create(self, serializer):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        appt = serializer.save(patient=profile)
        # Tạo notification cho bác sĩ:
        Notification.objects.create(
            recipient=appt.doctor.user,
            message=(
                f"Bác sĩ {appt.doctor.user.get_full_name()}, "
                f"bạn có cuộc hẹn mới từ bệnh nhân "
                f"{self.request.user.get_full_name()} vào {appt.timeslot:%Y-%m-%d %H:%M}."
            )
        )
        # Tạo notification cho chính bệnh nhân:
        Notification.objects.create(
            recipient=self.request.user,
            message=(
                f"Bạn đã đặt cuộc hẹn với bác sĩ "
                f"{appt.doctor.user.get_full_name()} vào {appt.timeslot:%Y-%m-%d %H:%M}. "
                f"Trạng thái: pending."
            )
        )


# class PatientAppointmentViewSet(viewsets.ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated, IsPatient]
#     serializer_class = AppointmentSerializer
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = AppointmentFilter


#     def get_queryset(self):
#         profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
#         return Appointment.objects.filter(patient=profile)

class PatientAppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter

    def get_queryset(self):
        return Appointment.objects.filter(patient__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user.patient_profile)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.status == 'cancelled':
            raise serializers.ValidationError("Cannot update a cancelled appointment.")
        serializer.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'cancelled':
            # return Response({"detail": "Cannot update a cancelled appointment."}, status=status.HTTP_400_BAD_REQUEST)
            raise PermissionDenied(detail=f"Lịch hẹn đã bị huỷ lúc {instance.updated_at}, không thể cập nhật.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'cancelled':
            raise PermissionDenied(detail=f"Lịch hẹn đã bị huỷ lúc {instance.updated_at}, không thể cập nhật.")
        return super().partial_update(request, *args, **kwargs)

class PatientRecordListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return MedicalRecord.objects.filter(patient=profile)

# class PatientListView(generics.ListAPIView):
#     """
#     GET /api/patients/admin/
#     Dành cho admin xem all patients
#     """
#     serializer_class = PatientProfileSerializer
#     permission_classes = [IsAuthenticated, IsAdmin]

#     def get_queryset(self):
#         return PatientProfile.objects.select_related('user').all()
