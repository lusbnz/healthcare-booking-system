# patients/urls.py
from django.urls import path
from .views import PatientProfileUpdateView, PatientListView

urlpatterns = [
    # endpoint cho patient tự xem / cập nhật profile
    path('profile/', PatientProfileUpdateView.as_view(), name='patient-me-profile'),
    # endpoint cho admin list toàn bộ patient
    path('admin/', PatientListView.as_view(), name='admin-patients'),
]
