# doctors/models.py
from django.db import models
from django.conf import settings

class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=100)
    address   = models.TextField(blank=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)
    # license_number, clinic_name, v.v…
