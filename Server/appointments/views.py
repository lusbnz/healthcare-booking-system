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
        if user.role == 'admin':
            return self.queryset
        if user.role == 'doctor':
            return self.queryset.filter(doctor__user=user)
        if user.role == 'patient':
            return self.queryset.filter(patient__user=user)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'patient':
            raise PermissionDenied("Only patients can create appointments.")
        serializer.save(patient=user.patient_profile)

    def perform_update(self, serializer):
        # Doctors can confirm or cancel, patients can cancel
        user = self.request.user
        instance = self.get_object()
        if user.role == 'patient' and serializer.validated_data.get('status') != 'cancelled':
            raise PermissionDenied("Patients can only cancel appointments.")
        serializer.save()
