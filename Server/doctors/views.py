# doctors/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsDoctor, IsAdmin
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer

class DoctorProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT /api/doctors/me/profile/
    Chỉ doctor được update chính họ.
    """
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_object(self):
        # đảm bảo luôn có profile; nếu chưa có thì tạo mới
        profile, _ = DoctorProfile.objects.get_or_create(user=self.request.user)
        return profile

class DoctorListView(generics.ListAPIView):
    """
    GET /api/doctors/admin/
    Dành cho admin xem danh sách tất cả bác sĩ.
    """
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return DoctorProfile.objects.select_related('user').all()
