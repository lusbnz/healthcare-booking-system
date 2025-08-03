from rest_framework import serializers
from .models import DoctorProfile, Availability
from django.contrib.auth import get_user_model

User = get_user_model()

class DoctorProfileSerializer(serializers.ModelSerializer):
    # fullname = serializers.CharField()
    fullname = serializers.CharField(source='user.fullname')
    email        = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')
    specialty      = serializers.CharField()
    address        = serializers.CharField(allow_blank=True)
    license_number = serializers.CharField(allow_blank=True, allow_null=True)

    class Meta:
        model  = DoctorProfile
        fields = ['fullname','email','phone_number','specialty','address','license_number']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # đọc từ property user.fullname
        rep['fullname'] = instance.user.fullname
        return rep

    # def get_fullname(self, obj):
    #     return obj.user.get_full_name()

    # def update(self, instance, validated_data):
    #     # user_data sẽ có key 'get_full_name', 'email', 'phone_number'
    #     user_data = validated_data.pop('user', {})
    #     profile_data = validated_data

    #     user = instance.user

    #     # 1. Xử lý fullname: tách thành first_name + last_name
    #     full_name = user_data.get('get_full_name')
    #     if full_name is not None:
    #         parts = full_name.strip().split(' ', 1)
    #         user.first_name = parts[0]
    #         user.last_name = parts[1] if len(parts) > 1 else ''
        
    #     # 2. Xử lý email và phone_number
    #     if 'email' in user_data:
    #         user.email = user_data['email']
    #     if 'phone_number' in user_data:
    #         user.phone_number = user_data['phone_number']
    #     user.save()

    #     # 3. Cập nhật DoctorProfile fields
    #     for attr, val in profile_data.items():
    #         setattr(instance, attr, val)
    #     instance.save()

    #     return instance

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        profile_data = validated_data
        user = instance.user

        # Ghi fullname nếu có
        if 'fullname' in self.initial_data:
            # user.fullname = self.initial_data['fullname']  # dùng setter bạn đã định nghĩa
            user.fullname = user_data.get('fullname', user.fullname)
        if 'email' in user_data:
            user.email = user_data['email']
        if 'phone_number' in user_data:
            user.phone_number = user_data['phone_number']
        user.save()

        # update profile
        for attr, value in profile_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Availability
        fields = ['id','day_of_week','start_time','end_time']
