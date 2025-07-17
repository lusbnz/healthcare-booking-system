# doctors/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsDoctor, IsAdmin
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer


from users.serializers import MeSerializer, DoctorProfileSerializer

class DoctorProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT /api/doctors/me/profile/
    Chỉ doctor được update chính họ.
    """
    serializer_class = MeSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

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
        profile, _ = DoctorProfile.objects.get_or_create(user=user)
        profile_data = request.data.get('profile', {})
        serializer = DoctorProfileSerializer(profile, data=profile_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MeSerializer(user).data)


# class DoctorListView(generics.ListAPIView):
#     """
#     GET /api/doctors/admin/
#     Dành cho admin xem danh sách tất cả bác sĩ.
#     """
#     serializer_class = DoctorProfileSerializer
#     permission_classes = [IsAuthenticated, IsAdmin]

#     def get_queryset(self):
#         return DoctorProfile.objects.select_related('user').all()
