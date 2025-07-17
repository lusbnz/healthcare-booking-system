from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, permissions, viewsets
from users.permissions import IsDoctor, IsAdmin, IsPatient
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.select_related('patient', 'doctor', 'appointment').all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return self.queryset
        if user.role == 'doctor':
            return self.queryset.filter(doctor__user=user)
        if user.role == 'patient':
            return self.queryset.filter(patient__user=user)
        return MedicalRecord.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['doctor', 'admin']:
            raise PermissionDenied("Only doctors or admins can create medical records.")
        serializer.save(doctor=user.doctor_profile, patient=serializer.validated_data['patient'])