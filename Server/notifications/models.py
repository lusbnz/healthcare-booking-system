from django.db import models
from django.conf import settings

class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.recipient}: {self.message[:30]}{'...' if len(self.message) > 30 else ''}"
