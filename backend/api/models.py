from django.db import models

class Alerts(models.Model):
    user_sensor = models.ForeignKey('Userinputsensordata', models.DO_NOTHING, blank=True, null=True)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Alerts'

class Chatbotlogs(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    query = models.CharField(max_length=255)
    response = models.CharField(max_length=500)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ChatbotLogs'

class Predictions(models.Model):
    user_sensor = models.ForeignKey('Userinputsensordata', models.DO_NOTHING, blank=True, null=True)
    predicted_alarm = models.IntegerField()
    confidence_score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Predictions'

class Userinputsensordata(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    timestamp = models.DateTimeField()
    gas_level = models.FloatField()
    temperature = models.FloatField()
    pressure = models.FloatField()
    smoke_level = models.FloatField()
    alarm = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'UserInputSensorData'

class Users(models.Model):
    full_name = models.CharField(max_length=100)
    username = models.CharField(unique=True, max_length=50)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    contact = models.CharField(max_length=15)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Users'

class SensorData1Tbl(models.Model):
    timestamp = models.DateTimeField()
    gas_level = models.FloatField()
    temperature = models.FloatField()
    pressure = models.FloatField()
    smoke_level = models.FloatField()
    id = models.AutoField(primary_key=True)
    alarm = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = '_Sensor_Data1TBL'
