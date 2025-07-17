from django.db import models
from django.utils import timezone

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    patient = models.ForeignKey(
        'patients.PatientProfile', on_delete=models.CASCADE, related_name='appointments'
    )
    doctor = models.ForeignKey(
        'doctors.DoctorProfile', on_delete=models.CASCADE, related_name='appointments'
    )
    timeslot = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.user.username} -> {self.doctor.user.username} at {self.timeslot}"