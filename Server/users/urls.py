from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, DoctorListView, PatientListView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('changepassword/', ChangePasswordView.as_view(), name='change-password'),

    # Admin
    path('admin/doctors/', DoctorListView.as_view(), name='admin-doctors'),
    path('admin/patients/', PatientListView.as_view(), name='admin-patients'),
]
