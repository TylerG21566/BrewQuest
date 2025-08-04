
from django.contrib import admin;
from .models import * 
# Register your models here.
"""
    register livequiz models to django admin page to display in admin
"""
admin.site.register(Room)
admin.site.register(Player)
admin.site.register(HostToMark)