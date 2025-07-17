from django.db import models
from django.utils import timezone

class MedicalRecord(models.Model):
    patient = models.ForeignKey(
        'patients.PatientProfile', on_delete=models.CASCADE, related_name='medical_records'
    )
    doctor = models.ForeignKey(
        'doctors.DoctorProfile', on_delete=models.SET_NULL, null=True
    )
    appointment = models.OneToOneField(
        'appointments.Appointment', on_delete=models.CASCADE, related_name='record'
    )
    diagnosis = models.TextField()
    prescription = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record for {self.patient.user.username} @ {self.created_at.date()}"