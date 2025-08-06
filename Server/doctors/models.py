from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class DoctorProfile(models.Model):
    user           = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty      = models.CharField(max_length=100)
    address        = models.TextField(blank=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name()} — {self.specialty}"


class Availability(models.Model):
    DAYS_OF_WEEK = [
        ('Monday',    'Thứ Hai'),
        ('Tuesday',   'Thứ Ba'),
        ('Wednesday', 'Thứ Tư'),
        ('Thursday',  'Thứ Năm'),
        ('Friday',    'Thứ Sáu'),
        ('Saturday',  'Thứ Bảy'),
        ('Sunday',    'Chủ Nhật'),
    ]

    doctor      = models.ForeignKey(
        DoctorProfile,                 # <<-- thay đổi ở đây
        on_delete=models.CASCADE,
        related_name='availabilities'
    )
    day_of_week = models.CharField(max_length=9, choices=DAYS_OF_WEEK)
    start_time  = models.TimeField()
    end_time    = models.TimeField()

    class Meta:
        unique_together = ('doctor', 'day_of_week', 'start_time', 'end_time')
        ordering = ['doctor', 'day_of_week', 'start_time']

    def clean(self):
        # start trước end
        if self.start_time >= self.end_time:
            raise ValidationError("start_time phải trước end_time")

        # không chồng khung
        overlaps = Availability.objects.filter(
            doctor=self.doctor,
            day_of_week=self.day_of_week
        ).exclude(pk=self.pk).filter(
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        )
        if overlaps.exists():
            raise ValidationError("Khung giờ này bị chồng lắp với một khung đã tồn tại")

    def save(self, *args, **kwargs):
        # gán validation dù tạo qua API hay admin
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.doctor.user.get_full_name()} – {self.day_of_week} {self.start_time}-{self.end_time}"
