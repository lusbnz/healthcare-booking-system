from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from patients.serializers import PatientProfileSerializer
from doctors.serializers import DoctorProfileSerializer

User = get_user_model()

class MeSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    fullname = serializers.CharField(source='fullname')

    class Meta:
        model = User
        fields = [
            'id', 'username', 'fullname', 'email', 'phone_number',
            'user_type', 'profile'
        ]

    def get_profile(self, obj):
        # nếu là bệnh nhân
        if obj.user_type == 'patient' and hasattr(obj, 'patient_profile'):
            return PatientProfileSerializer(obj.patient_profile).data
        # nếu là bác sĩ
        if obj.user_type == 'doctor' and hasattr(obj, 'doctor_profile'):
            return DoctorProfileSerializer(obj.doctor_profile).data
        # admin hoặc loại khác thì không có profile
        return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'patient')
        )
        return user
