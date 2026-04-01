from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('user-input-sensor-data/', views.user_input_sensor_data, name='user_input_sensor_data'),
]
