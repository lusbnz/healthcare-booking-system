# Generated by Django 5.2.4 on 2025-07-15 10:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0002_patientprofile_insurance_number_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientprofile',
            name='medical_history',
        ),
    ]
