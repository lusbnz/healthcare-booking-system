from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsDoctor
from .models import DoctorProfile, Availability
from .serializers import DoctorProfileSerializer, AvailabilitySerializer
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from records.serializers import MedicalRecordSerializer

# 1. Me / Profile
class DoctorMeView(generics.RetrieveUpdateAPIView):
    serializer_class   = DoctorProfileSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_object(self):
        return self.request.user.doctor_profile

# 2. Availability
class AvailabilityListCreateView(generics.ListCreateAPIView):
    serializer_class   = AvailabilitySerializer
    permission_classes = [IsAuthenticated, IsDoctor]
    def get_queryset(self):
        return self.request.user.doctor_profile.availabilities.all()
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor_profile)

class AvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = AvailabilitySerializer
    permission_classes = [IsAuthenticated, IsDoctor]
    lookup_field       = 'id'
    def get_queryset(self):
        return self.request.user.doctor_profile.availabilities.all()
