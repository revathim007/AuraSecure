from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserInputSensorDataSerializer
from rest_framework.decorators import api_view
from .models import Userinputsensordata, Users
import joblib
import pandas as pd
from django.utils import timezone

# Load the trained model
model = joblib.load('ml/gradient_boosting_model.joblib')

def get_prediction_reason(level, gas, smoke, temp):
    if level == 2: # Alarm
        reasons = []
        if gas > 250: reasons.append(f"gas level ({gas}) is critically high")
        if smoke > 15: reasons.append(f"smoke level ({smoke}) is critically high")
        if temp > 90: reasons.append(f"temperature ({temp}°C) is critically high")
        reason_text = f"Alarm triggered due to {' and '.join(reasons)}." if reasons else "Multiple sensor readings contributed to the alarm."
        statement = "EVACUATE IMMEDIATELY! Critical levels detected. Please contact emergency services."
        return reason_text, statement
    if level == 1: # Warning
        reasons = []
        if 200 < gas <= 250: reasons.append(f"gas level ({gas}) is elevated")
        if 10 < smoke <= 15: reasons.append(f"smoke level ({smoke}) is elevated")
        if 75 < temp <= 90: reasons.append(f"temperature ({temp}°C) is elevated")
        reason_text = f"Warning: {' and '.join(reasons)}. Conditions are approaching critical." if reasons else "Potential hazard detected. Monitor levels closely."
        statement = "CAUTION: Monitor levels closely and check equipment for potential leaks or malfunctions."
        return reason_text, statement
    return "All sensor levels are within the normal range.", "System status: Normal. No hazards detected."

@api_view(['POST'])
def predict_hazard(request):
    gas_level = request.data.get('gas_level', 0)
    smoke_level = request.data.get('smoke_level', 0)
    temperature = request.data.get('temperature', 0)
    user_id = request.data.get('user')

    df = pd.DataFrame({
        'gas_level': [gas_level],
        'smoke_level': [smoke_level],
        'temperature': [temperature]
    })

    # Perform prediction
    prediction = int(model.predict(df)[0])
    result = {0: 'Safe', 1: 'Warning', 2: 'Alarm'}.get(prediction, 'Error')
    reason, statement = get_prediction_reason(prediction, gas_level, smoke_level, temperature)

    # Save to UserInputSensorData table
    try:
        user_obj = Users.objects.get(id=user_id)
        Userinputsensordata.objects.create(
            user=user_obj,
            timestamp=timezone.now(),
            gas_level=gas_level,
            smoke_level=smoke_level,
            temperature=temperature,
            pressure=0.0,  # Default since it's not provided by frontend
            alarm=prediction
        )
    except Users.DoesNotExist:
        # If user is not found, we still return prediction but log/handle the error
        print(f"Error: User with ID {user_id} not found during data persistence.")
    except Exception as e:
        print(f"Error saving sensor data: {str(e)}")

    return Response({'prediction': result, 'reason': reason, 'statement': statement}, status=status.HTTP_200_OK)

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
