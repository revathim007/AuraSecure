from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def welcome_api(request):
    return Response({"message": "Welcome from Django Backend!"})
