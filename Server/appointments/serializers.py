# from rest_framework import serializers
# from .models import Appointment

# class AppointmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Appointment
#         fields = ['id', 'patient', 'doctor', 'timeslot', 'reason', 'status', 'created_at', 'updated_at']
#         read_only_fields = ['patient', 'created_at', 'updated_at']

from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name', 
            'timeslot',
            'reason',
            'status',
            'created_at',
            'updated_at'
        ]

    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name() if obj.patient else None

    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name() if obj.doctor else None