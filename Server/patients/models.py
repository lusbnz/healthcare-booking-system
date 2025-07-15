# patients/models.py
from django.db import models
from django.conf import settings

class PatientProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_profile'
    )
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Thêm trường insurance_number
    insurance_number = models.CharField(
        max_length=50,
        blank=True,
        help_text="Số thẻ bảo hiểm y tế"
    )

    def __str__(self):
        return f"Profile của {self.user.username}"
