from django.shortcuts import render
from django.conf import settings
# Create your views here.


def index(request, *args, **kwargs):
    x=(settings.STATIC_ROOT+'main.js' )
    print(x)
    return render(request, 'index.html')
