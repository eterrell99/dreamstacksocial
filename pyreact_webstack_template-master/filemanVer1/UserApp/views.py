from .models import User, UserSaves
from .serializers import UserSerializer, UserSaveSerializer,CRUDserSaveSerializer
from rest_framework.views import APIView
from rest_framework import generics,status
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



class UserSaveAPIView(generics.ListAPIView):
    serializer_class = UserSaveSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed
    queryset = UserSaves.objects.all()
    def get_queryset(self):
        return UserSaves.objects.filter(user=self.request.user)


class GenericUserSaveAPIView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    serializer_class = CRUDserSaveSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # You can restrict access as needed
    queryset = UserSaves.objects.all()
    lookup_field = 'id'
    def get(self,request, id=None):

        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
    def post(self, request, id):
        request.data['user'] = request.user.id
        request.data['user_saved'] = id

        return self.create(request)
    

    def delete(self, request, id):
        user_id = id

        # Get the authenticated user
        user = request.user

        # Find and delete the like associated with the user and post_id
        try:
            postsave = UserSaves.objects.filter(user=user, user_saved__id=user_id)

            self.perform_destroy(postsave)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserSaves.DoesNotExist:
            return Response({"detail": "usersave not found"}, status=status.HTTP_404_NOT_FOUND)
           