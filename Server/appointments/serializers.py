from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'timeslot', 'reason', 'status', 'created_at', 'updated_at']
        read_only_fields = ['patient', 'created_at', 'updated_at']