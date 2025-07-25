# from rest_framework import viewsets, permissions, status
# from rest_framework.exceptions import PermissionDenied
# from rest_framework.decorators import action
# from rest_framework.response import Response

# from .models import Appointment
# from .serializers import AppointmentSerializer
# from users.permissions import IsPatient, IsDoctor

# class AppointmentViewSet(viewsets.ModelViewSet):
#     queryset = Appointment.objects.select_related('patient', 'doctor').all()
#     serializer_class = AppointmentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         qs = self.queryset

#         if user.user_type == 'doctor':
#             qs = qs.filter(doctor__user=user)
#         elif user.user_type == 'patient':
#             qs = qs.filter(patient__user=user)
#         else:
#             return Appointment.objects.none()

#         status_param = self.request.query_params.get('status')
#         if status_param:
#             qs = qs.filter(status=status_param)
#         return qs

#     def create(self, request, *args, **kwargs):
#         if request.user.user_type != 'patient':
#             raise PermissionDenied("Chỉ bệnh nhân mới được tạo lịch hẹn.")
#         return super().create(request, *args, **kwargs)

#     def update(self, request, *args, **kwargs):
#         appt = self.get_object()
#         # 1) Không cho cập nhật khi đã huỷ
#         if appt.status == 'cancelled':
#             raise PermissionDenied("Lịch hẹn đã huỷ, không thể cập nhật.")
#         return super().update(request, *args, **kwargs)

#     def partial_update(self, request, *args, **kwargs):
#         appt = self.get_object()
#         if appt.status == 'cancelled':
#             raise PermissionDenied("Lịch hẹn đã huỷ, không thể cập nhật.")
#         return super().partial_update(request, *args, **kwargs)

#     def perform_create(self, serializer):
#         # gán patient tự động
#         serializer.save(patient=self.request.user.patient_profile)

#     def perform_update(self, serializer):
#         user = self.request.user
#         data = serializer.validated_data

#         # Bệnh nhân chỉ được phép huỷ (chuyển thành cancelled)
#         if user.user_type == 'patient' and data.get('status') != 'cancelled':
#             raise PermissionDenied("Bệnh nhân chỉ được phép huỷ lịch hẹn.")
#         serializer.save()

#     @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsDoctor])
#     def confirm(self, request, pk=None):
#         appt = self.get_object()
#         if appt.status != 'pending':
#             return Response(
#                 {"detail": "Chỉ lịch hẹn Pending mới xác nhận được."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         appt.status = 'confirmed'
#         appt.save()
#         return Response(self.get_serializer(appt).data)

#     @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsDoctor])
#     def cancel(self, request, pk=None):
#         appt = self.get_object()
#         if appt.status != 'pending':
#             return Response(
#                 {"detail": "Chỉ lịch hẹn Pending mới huỷ được."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         appt.status = 'cancelled'
#         appt.save()
#         return Response(self.get_serializer(appt).data)

# appointments/views.py
from rest_framework import viewsets, permissions, status, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer
from users.permissions import IsPatient, IsDoctor
from notifications.models import Notification


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset         = Appointment.objects.select_related('patient', 'doctor').all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset

        if user.user_type == 'doctor':
            qs = qs.filter(doctor__user=user)
        elif user.user_type == 'patient':
            qs = qs.filter(patient__user=user)
        else:
            return Appointment.objects.none()

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def create(self, request, *args, **kwargs):
        # Chỉ patient mới tạo được
        if request.user.user_type != 'patient':
            raise PermissionDenied("Chỉ bệnh nhân mới được tạo lịch hẹn.")
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Lưu appointment
        appt = serializer.save(patient=self.request.user.patient_profile)
        # Thông báo cho bác sĩ
        Notification.objects.create(
            recipient=appt.doctor.user,
            message=(
                f"Bạn có cuộc hẹn mới từ "
                f"{appt.patient.user.get_full_name()} vào {appt.timeslot:%Y-%m-%d %H:%M} (pending)."
            )
        )
        # Thông báo cho bệnh nhân
        Notification.objects.create(
            recipient=self.request.user,
            message=(
                f"Cuộc hẹn với bác sĩ "
                f"{appt.doctor.user.get_full_name()} đã được tạo và đang chờ xác nhận."
            )
        )

    def update(self, request, *args, **kwargs):
        appt = self.get_object()
        if appt.status == 'cancelled':
            raise PermissionDenied("Lịch hẹn đã bị huỷ, không thể cập nhật.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        appt = self.get_object()
        if appt.status == 'cancelled':
            raise PermissionDenied("Lịch hẹn đã bị huỷ, không thể cập nhật.")
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        appt = self.get_object()
        data = serializer.validated_data
        user = self.request.user

        # Bệnh nhân chỉ được huỷ
        if user.user_type == 'patient':
            if data.get('status') == 'cancelled':
                # Bệnh nhân huỷ: tạo notification cho bác sĩ
                appt = serializer.save()
                Notification.objects.create(
                    recipient=appt.doctor.user,
                    message=(
                        f"Bệnh nhân {user.get_full_name()} đã huỷ cuộc hẹn "
                        f"ngày {appt.timeslot:%Y-%m-%d %H:%M}."
                    )
                )
                return
            else:
                raise PermissionDenied("Bệnh nhân chỉ được phép huỷ lịch hẹn.")

        # Nếu đến đây và status có thay đổi thành confirmed (qua PUT/PATCH)
        if data.get('status') == 'confirmed':
            appt = serializer.save()
            Notification.objects.create(
                recipient=appt.patient.user,
                message=(
                    f"Cuộc hẹn ngày {appt.timeslot:%Y-%m-%d %H:%M} "
                    f"đã được xác nhận bởi bác sĩ {self.request.user.get_full_name()}."
                )
            )
            return

        # Trường hợp update khác (ví dụ only reason/time):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsDoctor])
    def confirm(self, request, pk=None):
        appt = self.get_object()
        if appt.status != 'pending':
            return Response(
                {"detail": "Chỉ lịch hẹn Pending mới xác nhận được."},
                status=status.HTTP_400_BAD_REQUEST
            )
        appt.status = 'confirmed'
        appt.save()
        # Tạo notification cho bệnh nhân
        Notification.objects.create(
            recipient=appt.patient.user,
            message=(
                f"Cuộc hẹn ngày {appt.timeslot:%Y-%m-%d %H:%M} "
                f"đã được xác nhận bởi bác sĩ {request.user.get_full_name()}."
            )
        )
        return Response(self.get_serializer(appt).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsDoctor])
    def cancel(self, request, pk=None):
        appt = self.get_object()
        if appt.status != 'pending':
            return Response(
                {"detail": "Chỉ lịch hẹn Pending mới huỷ được."},
                status=status.HTTP_400_BAD_REQUEST
            )
        appt.status = 'cancelled'
        appt.save()
        # Tạo notification cho bệnh nhân
        Notification.objects.create(
            recipient=appt.patient.user,
            message=(
                f"Cuộc hẹn ngày {appt.timeslot:%Y-%m-%d %H:%M} "
                f"đã bị huỷ bởi bác sĩ {request.user.get_full_name()}."
            )
        )
        return Response(self.get_serializer(appt).data)
