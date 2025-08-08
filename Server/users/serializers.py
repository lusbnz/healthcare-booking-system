from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from patients.serializers import PatientProfileSerializer
from doctors.serializers import DoctorProfileSerializer

User = get_user_model()

class DoctorForPatientSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    doctor_profile_id = serializers.SerializerMethodField()  # Thêm trường này

    class Meta:
        model = User
        fields = [
            'id',
            'username', 
            'email',
            'phone_number',
            'profile',
            'doctor_profile_id'  # Thêm vào fields
        ]

    def get_profile(self, obj):
        if hasattr(obj, 'doctor_profile'):
            return DoctorProfileSerializer(obj.doctor_profile).data
        return None

    def get_doctor_profile_id(self, obj):
        if hasattr(obj, 'doctor_profile'):
            return obj.doctor_profile.id
        return None

class MeSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    # fullname = serializers.CharField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number',
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

        if user.user_type == 'doctor':
            from doctors.models import DoctorProfile
            DoctorProfile.objects.create(user=user)
        elif user.user_type == 'patient':
            from patients.models import PatientProfile
            PatientProfile.objects.create(user=user)

        return user
