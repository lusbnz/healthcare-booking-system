from channels.routing import ProtocolTypeRouter, URLRouter
from channels.middleware import AuthMiddlewareStack
from django.urls import re_path
from notifications.consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
