from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('signup/', index),
    path('login/', index),
    path('profile/', index),
    path('post/<int:id>/',index ),
    path('ee/',index),
    path('ee/<str:eeID>/', index)

]