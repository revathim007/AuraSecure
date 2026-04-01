from rest_framework import serializers
from .models import Users, Userinputsensordata

from django.utils import timezone

class UserInputSensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userinputsensordata
        fields = ['user', 'gas_level', 'smoke_level', 'temperature']

    def create(self, validated_data):
        validated_data['timestamp'] = timezone.now()
        validated_data['pressure'] = 0  # Default value
        validated_data['alarm'] = 0  # Default value
        return super().create(validated_data)
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'full_name', 'username', 'email', 'password', 'contact']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)
