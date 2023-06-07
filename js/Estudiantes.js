let bandera = 0;

$(document).ready(function () {
    verEstudiantes();
});

function verEstudiantes() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/verEstudiantes'
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const estudiantes = dataJson.data;
        const table = document.getElementById('estudiantesTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';

        estudiantes.forEach(estudiante => {
            html += '<tr>';
            html += '   <td>' + estudiante.codigo + '</td>';
            html += '   <td>' + estudiante.nombres + '</td>';
            html += '   <td>' + estudiante.apellidos + '</td>';
            html += '   <td>';
            html += '      <button onclick="modificar(' + estudiante.codigo + ')">Modificar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <button onclick="eliminar(' + estudiante.codigo + ')">Eliminar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <a href="indexActividad.html">Notas</a>';
            html += '   </td>';
            html += '</tr>';
        });

        tbody.innerHTML = html;
    }).fail((error) => {
        console.error(error);
    });
}

document.getElementById('registrar').addEventListener('click', () => {
    bandera = -1;
    document.getElementById('tituloModal').innerText = 'Registrar';
});

document.getElementById('guardar').addEventListener('click', () => {
    let formulario = document.forms['formularioEstudiante'];
    let codigo = formulario['codigo'].value;
    let nombres = formulario['nombres'].value;
    let apellidos = formulario['apellidos'].value;

    if (nombres === "" || apellidos === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (bandera == -1) {
        // CREAR
        $.ajax({
            url: 'http://localhost:8000/crearEstudiante',
            method: 'post',
            data: {
                codigo: codigo,
                nombres: nombres,
                apellidos: apellidos
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            verEstudiantes();
            location.reload();
        });
    } else if (bandera == 1) {
        // MODIFICAR
        let formularioModificar = document.forms['formularioEstudiante'];
        let nombresModificar = formularioModificar['nombres'].value;
        let apellidosModificar = formularioModificar['apellidos'].value;

        if (nombresModificar === "" || apellidosModificar === "") {
            alert("Campos incompletos");
            return;
        }

        $.ajax({
            url: 'http://localhost:8000/modificarEstudiante/' + codigo,
            method: 'put',
            data: {
                nombres: nombresModificar,
                apellidos: apellidosModificar,
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            verEstudiantes();
            location.reload();
        });
    }
});

let modificar = function (estudianteCodigo) {
    document.getElementById('tituloModal').innerText = 'Modificar';
    bandera = 1;
    codigo = estudianteCodigo;
};

let eliminar = function (codigo) {
    $.ajax({
        url: 'http://localhost:8000/eliminarEstudiante/' + codigo,
        method: 'delete',
    }).done(response => {
        const dataJson = JSON.parse(response);
        const msg = dataJson.data;
        alert(msg);
        verEstudiantes();
        location.reload();
    });
};