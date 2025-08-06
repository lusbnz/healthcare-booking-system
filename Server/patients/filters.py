import django_filters
from appointments.models import Appointment

class AppointmentFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status')
    doctor = django_filters.NumberFilter(field_name='doctor__id')
    timeslot = django_filters.DateTimeFilter(field_name='timeslot')

    class Meta:
        model = Appointment
        fields = ['status', 'doctor', 'timeslot']