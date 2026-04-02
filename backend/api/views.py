from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserInputSensorDataSerializer
from .models import Userinputsensordata, Users, Predictions, Alerts
from rest_framework.decorators import api_view
import joblib
import pandas as pd
from django.utils import timezone

# Build paths inside the project like this: BASE_DIR / 'subdir'.
from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the trained model
model_path = os.path.join(BASE_DIR, 'ml', 'gradient_boosting_model.joblib')
model = joblib.load(model_path)

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
        if not user_id:
            return Response({'prediction': result, 'reason': reason, 'statement': statement, 'error': 'User not logged in. Data not saved.'}, status=status.HTTP_200_OK)

        user_obj = Users.objects.get(id=user_id)
        user_sensor_entry = Userinputsensordata.objects.create(
            user=user_obj,
            timestamp=timezone.now(),
            gas_level=gas_level,
            smoke_level=smoke_level,
            temperature=temperature,
            pressure=0.0,
            alarm=prediction
        )

        # Save to Predictions table
        Predictions.objects.create(
            user_sensor=user_sensor_entry,
            predicted_alarm=prediction,
            confidence_score=1.0 
        )

        # If Alarm (level 2), save to Alerts table
        if prediction == 2:
            Alerts.objects.create(
                user_sensor=user_sensor_entry,
                message=reason,
                created_at=timezone.now()
            )

    except Users.DoesNotExist:
        return Response({'prediction': result, 'reason': reason, 'statement': statement, 'error': 'User session invalid. Please logout and login again.'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error during hazard detection persistence: {str(e)}")

    return Response({'prediction': result, 'reason': reason, 'statement': statement}, status=status.HTTP_200_OK)

@api_view(['POST'])
def forecast_hazard(request):
    user_id = request.data.get('user')
    if not user_id:
        return Response({'error': 'User ID is required for forecasting.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        # Check if user exists first
        if not Users.objects.filter(id=user_id).exists():
            return Response({'error': 'User session invalid. Please logout and login again.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the last 5 sensor readings for this user
        readings = Userinputsensordata.objects.filter(user_id=user_id).order_by('-timestamp')[:5]
        
        if not readings.exists():
            return Response({'error': 'No historical data found. Please use "Hazard Detection" first to submit some sensor readings.'}, status=status.HTTP_404_NOT_FOUND)

        # Convert to DataFrame for calculation
        df_hist = pd.DataFrame(list(readings.values('gas_level', 'smoke_level', 'temperature')))
        
        # Calculate a simple future trend (average + small increment for proactive warning)
        # In a real scenario, this would be a time-series model like ARIMA or Prophet
        avg_vals = df_hist.mean()
        max_vals = df_hist.max()
        
        # Forecast = current average with a 5% "risk buffer" projection
        forecasted_data = {
            'gas_level': [avg_vals['gas_level'] * 1.05],
            'smoke_level': [avg_vals['smoke_level'] * 1.05],
            'temperature': [avg_vals['temperature'] * 1.05]
        }
        
        df_forecast = pd.DataFrame(forecasted_data)
        
        # Use existing model to classify the forecasted state
        prediction = int(model.predict(df_forecast)[0])
        result = {0: 'Safe', 1: 'Warning', 2: 'Alarm'}.get(prediction, 'Error')
        reason, statement = get_prediction_reason(prediction, forecasted_data['gas_level'][0], forecasted_data['smoke_level'][0], forecasted_data['temperature'][0])

        return Response({
            'forecast': {
                'gas_level': round(forecasted_data['gas_level'][0], 2),
                'smoke_level': round(forecasted_data['smoke_level'][0], 2),
                'temperature': round(forecasted_data['temperature'][0], 2)
            },
            'prediction': result,
            'reason': f"Forecast Analysis: {reason}",
            'statement': f"Forecast Prediction: {statement}"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def dashboard_stats(request):
    user_id = request.data.get('user')
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 1. Summary Counts
        all_data = Userinputsensordata.objects.filter(user_id=user_id)
        total_records = all_data.count()
        safe_count = all_data.filter(alarm=0).count()
        warning_count = all_data.filter(alarm=1).count()
        alarm_count = all_data.filter(alarm=2).count()

        # 2. Recent History (Last 5)
        recent_history = all_data.order_by('-timestamp')[:5]
        history_list = []
        for h in recent_history:
            history_list.append({
                'timestamp': h.timestamp,
                'gas': h.gas_level,
                'smoke': h.smoke_level,
                'temp': h.temperature,
                'status': {0: 'Safe', 1: 'Warning', 2: 'Alarm'}.get(h.alarm, 'Unknown')
            })

        # 3. Trends (Last 10 for chart)
        trend_data = all_data.order_by('-timestamp')[:10]
        trends = []
        for t in reversed(trend_data): # Reverse to show chronological order in chart
            trends.append({
                'time': t.timestamp.strftime('%H:%M:%S'),
                'gas': t.gas_level,
                'smoke': t.smoke_level,
                'temp': t.temperature
            })

        # 4. Recent Alerts
        # We need to filter alerts based on the user's sensor data
        recent_alerts = Alerts.objects.filter(user_sensor__user_id=user_id).order_by('-created_at')[:5]
        alerts_list = []
        for a in recent_alerts:
            alerts_list.append({
                'message': a.message,
                'time': a.created_at,
                'level': 'Alarm' # All entries in Alerts table are currently level 2 (Alarm)
            })

        return Response({
            'summary': {
                'total': total_records,
                'safe': safe_count,
                'warning': warning_count,
                'alerts': alarm_count
            },
            'history': history_list,
            'trends': trends,
            'alerts': alerts_list,
            'current_status': history_list[0]['status'] if history_list else 'No Data'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
