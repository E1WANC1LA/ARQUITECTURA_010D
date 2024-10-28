from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Usuario, TipoUsuario, Reserva, SalaEstudio
import traceback
from django.forms.models import model_to_dict
from django.core.files.storage import FileSystemStorage
from uuid import uuid4
import os
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def login(request):
    return render(request, 'biblioXapp/login.html')


@csrf_exempt
def registro(request):
    return render(request, 'biblioXapp/registro.html')


@csrf_exempt
def inicio(request):
    return render(request, 'biblioXapp/inicio.html')

@csrf_exempt
def reservas(request):
    return render(request, 'biblioXapp/reservas.html')


@csrf_exempt
def perfil(request):
    return render(request, 'biblioXapp/perfil.html')

@csrf_exempt
def mantenedorUsuarios(request):
    return render(request, 'biblioXapp/mantenedorUsuarios.html')

@csrf_exempt
def mantenedorTiposUsuario(request):
    return render(request, 'biblioXapp/mantenedorTiposUsuario.html')

@csrf_exempt
def mantenedorReservas(request):
    return render(request, 'biblioXapp/mantenedorReservas.html')

@csrf_exempt
def mantenedorSalas(request):
    return render(request, 'biblioXapp/mantenedorSalas.html')


@csrf_exempt
def crearUsuario(request):
    if request.method == 'POST':
        try:
            nombreCompleto = request.POST.get('nombreCompleto')
            correo = request.POST.get('correo')
            contrasena = request.POST.get('contrasena')
            tipo_usuario_id = request.POST.get('tipo_usuario')
            tipo_usuario_id = int(tipo_usuario_id)

            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
            msg = {}

            if Usuario.objects.filter(correo=correo).exists():
                msg['correo'] = '<br>Este correo ya está en uso.'

            if msg:
                error_message = ""
                for key, value in msg.items():
                    error_message += f"{value}\n"
                return JsonResponse({'error': error_message})

            usuario = Usuario(nombreCompleto=nombreCompleto,
                              tipo_usuario=tipo_usuario, correo=correo, contrasena=contrasena)
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})



@csrf_exempt
def ObtenerSesion(request):
    if request.method == 'POST':
        try:
            correo = request.POST.get('correo')
            contrasena = request.POST.get('contrasena')
           
            usuario = Usuario.objects.filter(correo=correo, contrasena=contrasena).first()

            if usuario is not None:
                request.session['usuario'] = model_to_dict(usuario)
                return JsonResponse({'estado': 'completado', 'usuario': model_to_dict(usuario)})
            else:
                return JsonResponse({'estado': 'fallido'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def CerrarSesion(request):
    try:
        if 'usuario' in request.session:
            del request.session['usuario']
        return JsonResponse({'estado': 'completado'})
    except Exception as e:
        return JsonResponse({
            'Excepciones': {
                'message': str(e),  # Mensaje de la excepción
                'type': type(e).__name__,  # Tipo de la excepción
                'details': traceback.format_exc()  # Detalles de la excepción
            }
        })


@csrf_exempt
def AdminCrearTipoUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')

            tipo_usuario = TipoUsuario(nombre=nombre)
            tipo_usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def AdminBuscarTiposUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre',None)
        
            tipos_usuario = TipoUsuario.objects.all().order_by('id_tipo_usuario')

            tipos_usuario_conteo = []

            for tipo in tipos_usuario:
                conteo = Usuario.objects.filter(tipo_usuario=tipo).count()
                tipo_dict = model_to_dict(tipo)
                tipo_dict['conteo_usuarios'] = conteo
                tipos_usuario_conteo.append(tipo_dict)
            return JsonResponse({'estado': 'completado', 'datos': tipos_usuario_conteo}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    


@csrf_exempt
def AdminBuscarTipoUsuarioEditar(request):
    if request.method == 'POST':
        try:
            tipo_usuario_id = request.POST.get('IdTipoUsuario')
            tipo_usuario_id = int(tipo_usuario_id)

            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
            tipo_usuario = model_to_dict(tipo_usuario)

            return JsonResponse({'estado':"completado",'datos': tipo_usuario})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                'details': traceback.format_exc()  # Detalles de la excepción
            }
        })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def AdminEditarTipoUsuario(request):
    if request.method == 'POST':
        try:
            tipo_usuario_id = request.POST.get('tipo_usuario_id')
            nombre = request.POST.get('Nombre')

            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
            tipo_usuario.nombre = nombre
            tipo_usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
            }
        })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def AdminEliminarTipoUsuario(request):
    if request.method == 'POST':
        try:
            tipo_usuario_id = request.POST.get('tipo_usuario_id')
            tipo_usuario_id = int(tipo_usuario_id)

            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
            tipo_usuario.delete()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
            }
        })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def AdminBuscarTiposUsuarioCMB(request):
    if request.method == 'POST':
        try:
            tipos_usuario = TipoUsuario.objects.all()
            tipos_usuario_dict = [model_to_dict(tipo) for tipo in tipos_usuario]
            return JsonResponse({'estado': 'completado', 'datos': tipos_usuario_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def AdminCrearUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')
            tipo_usuario_id = request.POST.get('TipoUsuario')
            correo = request.POST.get('Email')
            contrasena = request.POST.get('Contrasena')

            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
        
            msg = {}

            # Comprueba si ya existe un usuario con el mismo correo
            if Usuario.objects.filter(correo=correo).exists():
                msg['correo'] = '<br>Este correo ya está en uso.'

            if msg:
                error_message = ""
                for key, value in msg.items():
                    error_message += f"{value}\n"
                return JsonResponse({'error': error_message})

            usuario = Usuario(nombreCompleto=nombre, tipo_usuario=tipo_usuario , correo=correo, contrasena=contrasena)
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
   

@csrf_exempt
def AdminBuscarUsuarios(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre', '')
            tipo_usuario = request.POST.get('TipoUsuario', '0')
            usuarios = Usuario.objects.raw('''
                SELECT u.*, t.nombre as tipo_usuario_nombre 
                FROM biblioXapp_usuario u
                LEFT JOIN biblioXapp_tipousuario t ON u.tipo_usuario_id = t.id_tipo_usuario
                WHERE (u.nombreCompleto LIKE %s OR %s = '') AND (u.tipo_usuario_id = %s OR %s = '0')
            ''', ['%' + nombre + '%', nombre, tipo_usuario, tipo_usuario])


            usuarios_dict = []
            for usuario in usuarios:
                usuario_dict = model_to_dict(usuario)
                usuario_dict['tipo_usuario_nombre'] = usuario.tipo_usuario_nombre
                usuarios_dict.append(usuario_dict)

            return JsonResponse({'estado': 'completado', 'datos': usuarios_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})



@csrf_exempt
def AdminBuscarUsuarioEditar(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario_dict = model_to_dict(usuario)
            return JsonResponse({'estado': 'completado', 'datos': usuario_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
        

@csrf_exempt
def AdminEditarUsuario(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            nombre = request.POST.get('Nombre')
            tipo_usuario_id = request.POST.get('TipoUsuario')
            correo = request.POST.get('Correo')
            contrasena = request.POST.get('Contrasena')

            # Obtén la instancia de TipoUsuario que corresponde al ID
            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)

            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario.nombreCompleto = nombre
            usuario.tipo_usuario = tipo_usuario
            usuario.correo = correo
            usuario.contrasena = contrasena
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


@csrf_exempt
def AdminEliminarUsuario(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario.delete()
            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

@csrf_exempt
def ObtenerDatosUsuario(request):
    if request.method == 'POST':
        try:
            usuario = request.session['usuario']
            usuario = Usuario.objects.get(pk=usuario['id_usuario'])
            usuario_dict = model_to_dict(usuario)
            usuario_dict['tipo_usuario'] = model_to_dict(usuario.tipo_usuario)
            

            return JsonResponse({'estado': 'completado', 'datos': usuario_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})