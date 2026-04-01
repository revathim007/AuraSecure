from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserInputSensorDataSerializer
from rest_framework.decorators import api_view
from .models import Userinputsensordata

@api_view(['POST'])
def user_input_sensor_data(request):
    serializer = UserInputSensorDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from .models import Users
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def login_user(request):
    try:
        user = Users.objects.get(username=request.data['username'])
    except Users.DoesNotExist:
        return Response({'error': 'No user found'}, status=404)

    if not check_password(request.data['password'], user.password):
        return Response({'error': 'Wrong password'}, status=400)

    serializer = UserSerializer(user)
    return Response(serializer.data)
