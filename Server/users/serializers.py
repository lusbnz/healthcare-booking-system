from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from patients.serializers import PatientProfileSerializer
from doctors.serializers import DoctorProfileSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

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
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # create profile safely
        if user.user_type == 'doctor':
            from doctors.models import DoctorProfile
            DoctorProfile.objects.create(user=user)
        elif user.user_type == 'patient':
            from patients.models import PatientProfile
            PatientProfile.objects.create(user=user)

        return user

class DoctorForAdminSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    specialty = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    license_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'phone_number',
                  'specialty', 'address', 'license_number']

    def get_fullname(self, obj):
        return obj.get_full_name()

    def get_specialty(self, obj):
        prof = getattr(obj, 'doctor_profile', None)
        return prof.specialty if prof else None

    def get_address(self, obj):
        prof = getattr(obj, 'doctor_profile', None)
        return prof.address if prof else None

    def get_license_number(self, obj):
        prof = getattr(obj, 'doctor_profile', None)
        return prof.license_number if prof else None
    
class PatientForAdminSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    date_of_birth = serializers.SerializerMethodField()
    insurance_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'fullname', 'address', 'date_of_birth', 'insurance_number']

    def get_fullname(self, obj):
        return obj.get_full_name()

    def get_address(self, obj):
        prof = getattr(obj, 'patient_profile', None)
        return prof.address if prof else None

    def get_date_of_birth(self, obj):
        prof = getattr(obj, 'patient_profile', None)
        return prof.date_of_birth if prof else None

    def get_insurance_number(self, obj):
        prof = getattr(obj, 'patient_profile', None)
        return prof.insurance_number if prof else None