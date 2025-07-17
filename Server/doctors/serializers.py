# doctors/serializers.py
from rest_framework import serializers
from .models import DoctorProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'fullname',
            'email',
            'phone_number',
            'specialty',
            'address',
            'license_number',
        ]
