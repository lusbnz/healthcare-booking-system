# doctors/serializers.py
from rest_framework import serializers
from .models import DoctorProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        # những field chuyên biệt bạn muốn expose
        fields = [
            'specialty',
            'address',
            'license_number',
            # thêm khi cần: 'clinic_name', 'experience_years', …
        ]
