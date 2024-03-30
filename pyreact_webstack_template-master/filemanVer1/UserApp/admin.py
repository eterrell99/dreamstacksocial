from django.contrib import admin
from .models import User, UserSaves

# Register your models here.
admin.site.register(User)
admin.site.register(UserSaves)
