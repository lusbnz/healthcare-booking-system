# patients/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsPatient, IsAdmin
from .models import PatientProfile
from .serializers import PatientProfileSerializer

class PatientProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT /api/patients/me/profile/
    Chỉ patient được update chính họ.
    """
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_object(self):
        # đảm bảo luôn có profile; nếu chưa có bạn có thể tạo tự động
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return profile


class PatientListView(generics.ListAPIView):
    """
    GET /api/patients/admin/
    Dành cho admin xem all patients
    """
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return PatientProfile.objects.select_related('user').all()
