from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MedicalRecordViewSet

router = DefaultRouter()
router.register(r'', MedicalRecordViewSet, basename='medical-records')

urlpatterns = [
    path('', include(router.urls)),
]
