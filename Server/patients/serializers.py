# patients/serializers.py
from rest_framework import serializers
from .models import PatientProfile

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = [
            'address',
            'date_of_birth',
            'insurance_number',
        ]
