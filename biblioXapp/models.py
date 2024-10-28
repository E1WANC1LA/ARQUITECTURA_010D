from django.db import models


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombreCompleto = models.CharField(max_length=100)
    tipo_usuario = models.ForeignKey('TipoUsuario', on_delete=models.CASCADE)
    correo = models.CharField(max_length=100 , unique=True , null=True)
    contrasena = models.CharField(max_length=100 , null=True)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombreCompleto']


class TipoUsuario(models.Model):
    id_tipo_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    sala_estudio = models.ForeignKey('SalaEstudio', on_delete=models.CASCADE)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):
        return self.usuario
    class Meta:
        ordering = ['usuario']

class SalaEstudio(models.Model):
    id_sala_estudio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']