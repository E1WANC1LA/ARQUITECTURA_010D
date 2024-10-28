var GL_ID_TIPO_USUARIO=0;
var GL_ID_USUARIO=0;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    console.log('Cookie value for ' + name + ':', cookieValue);
}


function IniciarSesion() {
    var correo = document.getElementById('correo').value;
    var contrasena = document.getElementById('contrasena').value;
    
    if (correo.toString() === '' || contrasena.toString() === '') {
        alert('Por favor, rellene todos los campos.');
        return;
    }


    var fd = new FormData();
    fd.append("correo", correo);
    fd.append("contrasena", contrasena);
    console.log('Correo: ' + correo);
    $.ajax({
        type: "POST",
        url: "/ObtenerSesion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                if (response.usuario.tipo_usuario === 3) {
                    window.location.href = '/mantenedorUsuarios/';
                }
                if (response.usuario.tipo_usuario === 2) {
                    window.location.href = '/inicio/';
                }
            } else {
                alert('Credenciales incorrectas');
            }
        }
    });
}




function Registrarse() {
    var msg = '';
    var nombreCompleto = $('#nombreCompleto').val();
    var correo = $('#correo').val();
    var contrasena = $('#contrasena').val();
      var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (correo.toString() === '' || contrasena.toString() === '' || nombreCompleto.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (!regex.test(correo)) {
        msg = msg + '\nPor favor, introduzca un correo electronico valido.';
    }
  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();;

    fd.append("nombreCompleto", nombreCompleto);
    fd.append("correo", correo);
    fd.append("contrasena", contrasena);
    fd.append("tipo_usuario", 2);

    console.log('Nombre completo: ' + nombreCompleto);
    $.ajax({
        type: "POST",
        url: "/crearUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario creado con éxito');
                window.location.href = '/login/';
            } else {
                alert('Falló la creación del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}



function CerrarSesion(){

$.ajax({
    type: "POST",
    url: "/CerrarSesion/",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    success: function (response) {
        console.log(response);
        if (response.Excepciones != null) {
            alert('Ha ocurrido un error inesperado');
            console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
            return;
        }
        if (response.error != null) {
            alert(response.error);
            return;
        }
        if(response.estado === 'completado') {
            window.location.href = '/login/';
        } else {
            alert('Falló la creación del usuario');
        }
    }
});
}


function buscarTiposUsuario(){
    var fd = new FormData();
    
    $('#tablaTipoUsuario tbody').empty();
    $('#divMensajeNoEncontradoTipoUsuario').hide();
    $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposUsuario/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    return;
                }
                if(response.estado === 'completado') {
                    var tabla = $('#tablaTipoUsuario'); 
                    if (response.datos.length == 0) {
                        $('#tablaTipoUsuario').parent().parent().parent().parent().hide();
                        $('#divMensajeNoEncontradoTipoUsuario').show();
                        return;
                    }
                    $('#tablaTipoUsuario').parent().parent().parent().parent().show();

                    $.each(response.datos, function(i, tipo) {
                        var FilaDatos = document.createElement("tr");

                        var cellId = document.createElement("td");
                        var cellNombre = document.createElement("td");
                        var cellConteo = document.createElement("td");
                        var cellAcciones = document.createElement("td");
                        
                        cellNombre.className = 'nombreTipousuario';

                        cellId.innerHTML = tipo.id_tipo_usuario;
                        cellNombre.innerHTML = tipo.nombre;
                        cellConteo.innerHTML = tipo.conteo_usuarios;
                        cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarTipoUsuario('+tipo.id_tipo_usuario+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaTipoUsuario('+tipo.id_tipo_usuario+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                        FilaDatos.appendChild(cellId);
                        FilaDatos.appendChild(cellNombre);
                        FilaDatos.appendChild(cellConteo);
                        FilaDatos.appendChild(cellAcciones);

                        tabla.append(FilaDatos);
                    });

                } else {
                    alert('Falló la busqueda del tipo de usuario');
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
         });


}

function  PrepararModalAgregarTipoUsuario(){
    $('#NombreAddTipoUsuario').val('');
}


function GrabarTipoUsuario(){
    var msg = '';
    var nombre = $('#NombreAddTipoUsuario').val();
   

    if (nombre.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }

  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();

    fd.append("Nombre", nombre);


    $.ajax({
        type: "POST",
        url: "/AdminCrearTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                $('#modal-agregarTipoUsuario').modal('hide');
                alert('Tipo de usuario creado con éxito');
                buscarTiposUsuario();

            } else {
                alert('Falló la creación del tipo de usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}



function PrepararModalEditarTipoUsuario(id_tipo_usuario){
    $('#modal-editarTipoUsuario').modal('show');
    GL_ID_TIPO_USUARIO = id_tipo_usuario;
    var fd = new FormData();
    fd.append("IdTipoUsuario", id_tipo_usuario);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarTipoUsuarioEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                $('#NombreEditTipoUsuario').val((response.datos.nombre).toString());
            } else {
                alert('Falló la recuperacion del tipo de usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function EditarTipoUsuario(){
    var fd = new FormData();
    fd.append("tipo_usuario_id", GL_ID_TIPO_USUARIO);
    fd.append("Nombre", $('#NombreEditTipoUsuario').val());
    $.ajax({
        type: "POST",
        url: "/AdminEditarTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de usuario editado con éxito');
                buscarTiposUsuario();
                $('#modal-editarTipoUsuario').modal('hide');
            } else {
                alert('Falló la edicion del tipo de usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}



function EliminaTipoUsuario(id_tipo_usuario,element){
    GL_ID_TIPO_USUARIO = id_tipo_usuario;
    var nombre = $(element).closest('tr').find('.nombreTipousuario').text();
    $('#idMensajeEliminrTipoUsuario').html('¿Está seguro que desea eliminar el tipo de usuario '+nombre.toString()+'?');
    $('#modal-confirmaEliminarTipoUsuario').modal('show');
}


function EliminarTipoUsuario(){
    var fd = new FormData();
    fd.append("tipo_usuario_id", GL_ID_TIPO_USUARIO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de usuario eliminado con éxito');
                buscarTiposUsuario();
            } else {
                alert('Falló la eliminación del tipo de usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function llenarCmbTipoUsuario(cmb){
    return new Promise((resolve, reject) => {

     var fd = new FormData();
        $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposUsuarioCMB/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    reject();
                    return;
                }
                if(response.estado === 'completado') {
                    $('#'+cmb.toString()+'').empty();
                    $('#'+cmb.toString()+'').append('<option value="0">Seleccione un tipo de usuario</option>');
                    $.each(response.datos, function(i, tipo) {
                        $('#'+cmb.toString()+'').append('<option value="'+tipo.id_tipo_usuario+'">'+tipo.nombre+'</option>');
                    });
                    resolve();
            
                } else {
                    alert('Falló la recuperacion del tipo de usuario');
                    reject();
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText);
                reject();
             },
            failure: function (response) { alert(response); 
                reject();

            }
        });
    });

}

function PrepararModalAgregarUsuario(){
    $('#AddNombreUsuario').val('');
    $('#AddCorreoUsuario').val('');
    $('#AddContrasenaUsuario').val('');
    llenarCmbTipoUsuario('cmbUsuarioAddTipoUsuario');
}


function buscarUsuarios(){
    var fd = new FormData();   
    
    $('#tablaUsuarios tbody').empty();
    $('#divMensajeNoEncontradoUsuario').hide();
    $.ajax({
        type: "POST",
        url: "/AdminBuscarUsuarios/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var tabla = $('#tablaUsuarios'); 
                if (response.datos.length == 0) {
                    $('#tablaUsuarios').parent().parent().parent().parent().hide();
                    $('#divMensajeNoEncontradoUsuario').show();
                    return;
                }
                $('#tablaUsuarios').parent().parent().parent().parent().show();
                $.each(response.datos, function(i, usuario) {
                    var FilaDatos = document.createElement("tr");

                    var cellId = document.createElement("td");
                    var cellNombre = document.createElement("td");
                    var cellEmail = document.createElement("td");

                    var cellTipoUsuario = document.createElement("td");
                    var cellAcciones = document.createElement("td");
                    
                    cellNombre.className = 'nombreUsuario';

                    cellId.innerHTML = usuario.id_usuario;
                    cellNombre.innerHTML = usuario.nombreCompleto;
                    cellEmail.innerHTML = usuario.correo;
                    cellTipoUsuario.innerHTML = usuario.tipo_usuario_nombre;
                    cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarUsuario('+usuario.id_usuario+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaUsuario('+usuario.id_usuario+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                    FilaDatos.appendChild(cellId);
                    FilaDatos.appendChild(cellNombre);
                    FilaDatos.appendChild(cellEmail);
                    FilaDatos.appendChild(cellTipoUsuario);
                    FilaDatos.appendChild(cellAcciones);

                    tabla.append(FilaDatos);
                });
              

             } 
                
                else {
                    alert('Falló la busqueda de usuarios');
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
         });



}


function RegistrarUsuario() {
    var msg = '';
    var nombreCompleto = $('#AddNombreUsuario').val();
    var correo = $('#AddCorreoUsuario').val();
    var contrasena = $('#AddContrasenaUsuario').val();
    var tipoUsuario = $('#cmbUsuarioAddTipoUsuario').val();
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (correo.toString() === '' || contrasena.toString() === '' || nombreCompleto.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (!regex.test(correo)) {
        msg = msg + '\nPor favor, introduzca un correo electronico valido.';
    }
  
  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();

    fd.append("Nombre", nombreCompleto);
    fd.append("Email", correo);
    fd.append("Contrasena", contrasena);
    fd.append("TipoUsuario", parseInt(tipoUsuario));


    $.ajax({
        type: "POST",
        url: "/AdminCrearUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario creado con éxito');
                $('#modal-agregarUsuario').modal('hide');
                buscarUsuarios();
                
            } else {
                alert('Falló la creación del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}



function EliminaUsuario(id_usuario,element){
    GL_ID_USUARIO = id_usuario;
    var nombre = $(element).closest('tr').find('.nombreUsuario').text();
    $('#idMensajeEliminarUsuario').html('¿Está seguro que desea eliminar el usuario '+nombre.toString()+'?');
    $('#modal-confirmaEliminarUsuario').modal('show');
}

function PrepararModalEditarUsuario(id_usuario){
    $('#modal-editarUsuario').modal('show');
    var fd = new FormData();
    GL_ID_USUARIO = id_usuario;
    fd.append("IdUsuario", id_usuario);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarUsuarioEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var nombreCompleto = (response.datos.nombreCompleto).toString();
    
                $('#EditNombreUsuario').val(nombreCompleto.toString());
                $('#EditCorreoUsuario').val((response.datos.correo).toString());
                $('#EditContrasenaUsuario').val((response.datos.contrasena).toString());
                llenarCmbTipoUsuario('cmbUsuarioEditTipoUsuario').then(() => {
                    $('#cmbUsuarioEditTipoUsuario').val(response.datos.tipo_usuario);
                });
            } else {
                alert('Falló la recuperacion del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });






}

function EditarUsuario(){
    var fd = new FormData();
    var nombreCompleto = $('#EditNombreUsuario').val();
    fd.append("IdUsuario", GL_ID_USUARIO);
    fd.append("Nombre", nombreCompleto);
    fd.append("Correo", $('#EditCorreoUsuario').val());
    fd.append("Contrasena", $('#EditContrasenaUsuario').val());
    fd.append("TipoUsuario", $('#cmbUsuarioEditTipoUsuario').val());
    $.ajax({
        type: "POST",
        url: "/AdminEditarUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario editado con éxito');
                buscarUsuarios();
                $('#modal-editarUsuario').modal('hide');
            } else {
                alert('Falló la edicion del usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EliminarUsuario(){
    var fd = new FormData();
    fd.append("IdUsuario", GL_ID_USUARIO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario eliminado con éxito');
                buscarUsuarios();
            } else {
                alert('Falló la eliminación del usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}




function buscarDatosUsuario(){
    var fd = new FormData();
    $.ajax({
        type: "POST",
        url: "/ObtenerDatosUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                $('#nombre').val(response.datos.nombreCompleto);
                $('#email').val(response.datos.correo);
                $('#rol').val(response.datos.tipo_usuario.nombre);
            } else {
                alert('Falló la busqueda del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}