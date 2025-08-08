from django.db import models
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.recipient}: {self.message[:30]}{'...' if len(self.message) > 30 else ''}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Gửi notification qua WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{self.recipient.id}_notifications",
            {
                "type": "notification_message",
                "data": {
                    "id": self.id,
                    "message": self.message,
                    "created_at": self.created_at.isoformat(),
                }
            }
        )
