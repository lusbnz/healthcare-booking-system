# patients/urls.py
from django.urls import path
from .views import PatientProfileUpdateView
from rest_framework.routers import SimpleRouter
from .views import (
    PatientDashboardView,
    PatientDoctorListView,
    PatientBookingCreateView,
    PatientAppointmentViewSet,
    PatientRecordListView,
)
# from notifications.views import NotificationViewSet

router = SimpleRouter()
router.register(r'appointments', PatientAppointmentViewSet, basename='patient-appointments')
# router.register(r'notifications', NotificationViewSet, basename='patient-notifications')

urlpatterns = [
    path('profile/', PatientProfileUpdateView.as_view(), name='patient-me-profile'),
    path('dashboard/', PatientDashboardView.as_view(), name='patient-dashboard'),
    path('doctors/', PatientDoctorListView.as_view(), name='patient-doctors'),
    path('booking/', PatientBookingCreateView.as_view(), name='patient-booking'),
    path('medical-records/', PatientRecordListView.as_view(), name='patient-records'),
] + router.urls
