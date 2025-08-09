from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView,
    MeView,
    ChangePasswordView,
    AdminPatientViewSet,
    AdminDoctorViewSet,
)

router = DefaultRouter()
router.register(r'admin/patients', AdminPatientViewSet, basename='admin-patients')
router.register(r'admin/doctors', AdminDoctorViewSet, basename='admin-doctors')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', MeView.as_view(), name='me'),
    path('changepassword/', ChangePasswordView.as_view(), name='change-password'),
]

# add the router-generated URLs at the end
urlpatterns += router.urls