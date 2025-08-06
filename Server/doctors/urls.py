from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorMeView, AvailabilityListCreateView, AvailabilityDetailView
from appointments.views import AppointmentViewSet
from records.views      import MedicalRecordViewSet

router = DefaultRouter()
# appointments (dùng chính ViewSet đã mở rộng)
router.register(r'appointments', AppointmentViewSet, basename='appointments')
# medical records
router.register(r'records',      MedicalRecordViewSet, basename='records')

urlpatterns = [
    path('profile/',        DoctorMeView.as_view(),                  name='doctor-me'),
    path('availability/',      AvailabilityListCreateView.as_view(),   name='availability-list'),
    path('availability/<int:id>/', AvailabilityDetailView.as_view(),   name='availability-detail'),

    # nối luôn router
    path('', include(router.urls)),
]
