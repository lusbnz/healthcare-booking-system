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

from users.permissions import IsPatient
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from doctors.models import DoctorProfile
from doctors.serializers import DoctorProfileSerializer
from records.models import MedicalRecord
from records.serializers import MedicalRecordSerializer
from notifications.models import Notification

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


class PatientDoctorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        qs = DoctorProfile.objects.all()
        specialty = self.request.query_params.get('specialty')
        city = self.request.query_params.get('city')
        if specialty:
            # specialty là CharField trên DoctorProfile
            qs = qs.filter(specialty__icontains=specialty)
        if city:
            # giả sử city nằm trong address
            qs = qs.filter(address__icontains=city)
        return qs


class PatientBookingCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        serializer.save(patient=profile)


class PatientAppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter


    def get_queryset(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return Appointment.objects.filter(patient=profile)


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
