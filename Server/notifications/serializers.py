from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'read', 'created_at']
        read_only_fields = ['id', 'recipient', 'created_at']
