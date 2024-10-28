from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('', views.login, name='login'),
    path('login/', views.login, name='Login'),
    path('registro/', views.registro, name='registro'),
    path('inicio/', views.inicio, name='inicio'),
    path('reservas/', views.reservas, name='reservas'),
    path('perfil/', views.perfil, name='perfil'),
    path('mantenedorUsuarios/', views.mantenedorUsuarios, name='mantenedorUsuarios'),
    path('mantenedorTiposUsuario/', views.mantenedorTiposUsuario, name='mantenedorTiposUsuario'),
    path('mantenedorReservas/', views.mantenedorReservas, name='mantenedorReservas'),
    path('mantenedorSalas/', views.mantenedorSalas, name='mantenedorSalas'),
    path('crearUsuario/', views.crearUsuario, name='crearUsuario'),
    path('ObtenerSesion/', views.ObtenerSesion, name='ObtenerSesion'),
    path('CerrarSesion/', views.CerrarSesion, name='CerrarSesion'),
    path('ObtenerDatosUsuario/', views.ObtenerDatosUsuario, name='ObtenerDatosUsuario'),

    path('AdminBuscarTiposUsuario/', views.AdminBuscarTiposUsuario, name='AdminBuscarTiposUsuario'),
    path('AdminCrearTipoUsuario/', views.AdminCrearTipoUsuario, name='AdminCrearTipoUsuario'),
    path('AdminBuscarTipoUsuarioEditar/', views.AdminBuscarTipoUsuarioEditar, name='AdminBuscarTipoUsuarioEditar'),
    path('AdminEditarTipoUsuario/', views.AdminEditarTipoUsuario, name='AdminEditarTipoUsuario'),
    path('AdminEliminarTipoUsuario/', views.AdminEliminarTipoUsuario, name='AdminEliminarTipoUsuario'),
    path('AdminBuscarTiposUsuarioCMB/', views.AdminBuscarTiposUsuarioCMB, name='AdminBuscarTiposUsuarioCMB'),

    path('AdminCrearUsuario/', views.AdminCrearUsuario, name='AdminCrearUsuario'),
    path('AdminBuscarUsuarios/', views.AdminBuscarUsuarios, name='AdminBuscarUsuarios'),
    path('AdminBuscarUsuarioEditar/', views.AdminBuscarUsuarioEditar, name='AdminBuscarUsuarioEditar'),
    path('AdminEditarUsuario/', views.AdminEditarUsuario, name='AdminEditarUsuario'),
    path('AdminEliminarUsuario/', views.AdminEliminarUsuario, name='AdminEliminarUsuario'),
]

