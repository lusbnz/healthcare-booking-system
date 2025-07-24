from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Appointment
from .serializers import AppointmentSerializer
from users.permissions import IsPatient, IsDoctor, IsAdmin

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('patient', 'doctor').all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset

        # 1) Lọc theo role
        if user.user_type == 'doctor':
            qs = qs.filter(doctor__user=user)
        elif user.user_type == 'patient':
            qs = qs.filter(patient__user=user)
        elif user.user_type == 'admin':
            qs = qs  # admin coi tất cả
        else:
            return Appointment.objects.none()

        # # 2) Lọc theo status nếu có ?status=…
        # status_param = self.request.query_params.get('status')
        # if status_param:
        #     qs = qs.filter(status=status_param)

        return qs

    def perform_create(self, serializer):
        if self.request.user.role != 'patient':
            raise PermissionDenied("Only patients can create appointments.")
        serializer.save(patient=self.request.user.patient_profile)

    def perform_update(self, serializer):
        user = self.request.user
        data = serializer.validated_data
        # Patients chỉ được huỷ
        if user.role == 'patient' and data.get('status') != 'cancelled':
            raise PermissionDenied("Patients can only cancel appointments.")
        serializer.save()