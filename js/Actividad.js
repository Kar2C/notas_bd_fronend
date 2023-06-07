let bandera = 0;

$(document).ready(function () {
    verActividades();
});

function verActividades() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/verActividades/' + id,
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const actividades = dataJson.data;
        const table = document.getElementById('actividadesTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';
        let notas = [];

        actividades.forEach(actividad => {
            html += '<tr>';
            html += '   <td>' + actividad.id + '</td>';
            html += '   <td>' + actividad.descripcion + '</td>';
            html += '   <td>' + actividad.nota + '</td>';
            html += '   <td>';
            html += '      <button onclick="modificar(' + actividad.id + ')">Modificar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <button onclick="eliminar(' + actividad.id + ')">Eliminar</button>';
            html += '   </td>';
            html += '</tr>';

            notas.push(parseFloat(actividad.nota));
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
    let formulario = document.forms['formularioActividad'];
    let descripcion = formulario['descripcion'].value;
    let nota = formulario['nota'].value;
    let codigoEstudiante = formulario['codigoEstudiante'].value;

    if (descripcion === "" || nota === "" || codigoEstudiante === "") {
        alert("Campos incompletos");
        return;
    }

    if (bandera == -1) {
        $.ajax({
            url: 'http://localhost:8000/crearActividad',
            method: 'post',
            data: {
                descripcion: descripcion,
                nota: nota,
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            verActividades();
            location.reload();
        });
    } else if (bandera == 1) {
        let formularioModificar = document.forms['formularioActividad'];
        let descripcionModificar = formularioModificar['descripcion'].value;
        let notaModificar = formularioModificar['nota'].value;

        if (descripcionModificar === "" || notaModificar === "") {
            alert("Campos incompletos");
            return;
        }

        $.ajax({
            url: 'http://localhost:8000/modificarActividad/' + id,
            method: 'put',
            data: {
                descripcion: descripcionModificar,
                nota: notaModificar,
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            verActividades();
            location.reload();
        });
    }
});

let modificar = function (actividadId) {
    document.getElementById('tituloModal').innerText = 'Modificar';
    bandera = 1;
    id = actividadId;
};

let eliminar = function (id) {
    $.ajax({
        url: 'http://localhost:8000/eliminarActividad/' + id,
        method: 'delete',
    }).done(response => {
        const dataJson = JSON.parse(response);
        const msg = dataJson.data;
        alert(msg);
        verActividades();
        location.reload();
    });
};