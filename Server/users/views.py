from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .serializers import MeSerializer

from .serializers import RegisterSerializer, UserSerializer, DoctorForAdminSerializer, PatientForAdminSerializer
from .permissions import IsAdmin  # permission riêng cho admin

User = get_user_model()


# Đăng ký
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# Lấy thông tin user hiện tại
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET /api/users/me/
        Trả về thông tin chung của user + nested profile nếu là doctor/patient.
        """
        serializer = MeSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    


# Admin - danh sách bác sĩ
class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorForAdminSerializer  # We'll use the existing serializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return User.objects.filter(user_type='doctor').select_related('doctor_profile')
    
    def get_serializer_class(self):
        return self.serializer_class

# Admin - danh sách bệnh nhân
class PatientListView(generics.ListAPIView):
    serializer_class = PatientForAdminSerializer  # We'll use the existing serializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return User.objects.filter(user_type='patient').select_related('patient_profile')

    def get_serializer_class(self):
        return self.serializer_class
    
# Đổi mật khẩu
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"detail": "Thiếu old_password hoặc new_password."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"detail": "Mật khẩu cũ không đúng."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)
    
from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from .serializers import DoctorForAdminSerializer,PatientForAdminSerializer

class AdminPatientViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.filter(user_type='patient').select_related('patient_profile')
    serializer_class = PatientForAdminSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class AdminDoctorViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.filter(user_type='doctor').select_related('doctor_profile')
    serializer_class = DoctorForAdminSerializer
    permission_classes = [IsAuthenticated, IsAdmin]