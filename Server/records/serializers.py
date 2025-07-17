from rest_framework import serializers
from .models import MedicalRecord

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'doctor', 'appointment', 'diagnosis', 'prescription', 'notes', 'created_at']
        read_only_fields = ['patient', 'doctor', 'appointment', 'created_at']