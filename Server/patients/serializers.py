# patients/serializers.py
# from rest_framework import serializers
# from .models import PatientProfile

# class PatientProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PatientProfile
#         fields = [
#             'address',
#             'date_of_birth',
#             'insurance_number',
#         ]

from rest_framework import serializers
from .models import PatientProfile

class PatientProfileSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='user.fullname', required=False)

    class Meta:
        model = PatientProfile
        fields = [
            'fullname',
            'address',
            'date_of_birth', 
            'insurance_number',
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'fullname' in user_data:
            instance.user.fullname = user_data['fullname']
            instance.user.save()
        return super().update(instance, validated_data)
