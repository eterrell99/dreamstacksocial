from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.generics import RetrieveAPIView
from rest_framework import mixins
from rest_auth.registration.views import RegisterView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

class GetUserByEmailAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed

    def get_object(self):
        email = self.kwargs.get('email')
        return User.objects.get(email=email)
    

class CustomRegisterView(RegisterView):
    queryset = User.objects.all()

class UserAPIView(APIView):
    @staticmethod
    def get(request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class GenericUserAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'id'
    def get(self,request, id=None):
        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
        
    def post(self, request):
        return self.create(request)
    
    def put(self, request, id=None):
        return self.update(request, id)
    def patch(self, request, id=None):
        return self.partial_update(request, id)
    def delete(self, request, id):
        return self.destroy(request, id)
