# doctors/urls.py
from django.urls import path
from .views import DoctorProfileUpdateView, DoctorListView

urlpatterns = [
    # endpoint cho doctor tự xem / cập nhật profile
    path('profile/', DoctorProfileUpdateView.as_view(), name='doctor-me-profile'),
    # endpoint cho admin list toàn bộ doctors
    path('admin/', DoctorListView.as_view(), name='admin-doctors'),
]
