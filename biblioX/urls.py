from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('biblioXapp.urls')), 
    path('biblioXapp/', include('biblioXapp.urls')), 
]
