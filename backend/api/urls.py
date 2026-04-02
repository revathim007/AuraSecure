from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('user-input-sensor-data/', views.user_input_sensor_data, name='user_input_sensor_data'),
    path('predict/', views.predict_hazard, name='predict_hazard'),
    path('forecast/', views.forecast_hazard, name='forecast_hazard'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
]
