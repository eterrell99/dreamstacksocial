from django.urls import path
from .views import GenericUserAPIView,UserAPIView, CustomRegisterView,GetUserByEmailAPIView, GenericUserSaveAPIView,UserSaveAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)


urlpatterns = [   
   path('user/', UserAPIView.as_view()),                                                                                 
   path('user/<int:id>/', GenericUserAPIView.as_view()),
   path('user/register/', CustomRegisterView.as_view()),
   path('user/lookup/<str:email>/', GetUserByEmailAPIView.as_view()),
   path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
   path('user/save/', UserSaveAPIView.as_view(), name='UserSaveAPIView'),
   path('user/<int:id>/svs/', GenericUserSaveAPIView.as_view(), name='UserSaveAPIView'),
   ]