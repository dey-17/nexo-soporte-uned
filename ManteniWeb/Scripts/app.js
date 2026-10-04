(function ($) {
    'use strict';
    var ocupado = false;
    function mensaje(texto, error) {
        $('#mensaje').text(texto).toggleClass('error', !!error).prop('hidden', false);
    }
    // Todas las peticiones son POST JSON a WebMethods del code-behind.
    function enviar(metodo, datos, alCompletar) {
        if (ocupado) return;
        ocupado = true;
        $('button').prop('disabled', true);
        $('main').attr('aria-busy', 'true');
        $.ajax({ url: 'Default.aspx/' + metodo, method: 'POST',
            contentType: 'application/json; charset=utf-8', dataType: 'json',
            data: JSON.stringify(datos || {}), timeout: 15000
        }).done(function (respuesta) {
            var resultado = respuesta.d;
            dibujar(resultado);
            mensaje(resultado.Mensaje, !resultado.Ok);
            if (resultado.Ok && alCompletar) alCompletar();
        }).fail(function () {
            mensaje('No fue posible confirmar la operación. Actualice el listado antes de volver a enviarla para evitar duplicados.', true);
        }).always(function () {
            ocupado = false;
            $('button').prop('disabled', false);
            $('main').attr('aria-busy', 'false');
        });
    }
    function insignia(valor) {
        var clase = valor === 'Resuelta' ? 'done' : valor === 'En proceso' ? 'working' : 'pending';
        return $('<span>').addClass('badge ' + clase).text(valor);
    }
    // .text() trata los datos del usuario como texto, nunca como HTML ejecutable.
    function dibujar(datos) {
        $('#lista, #acciones').empty();
        $('#vacio-consulta, #vacio-proceso').prop('hidden', datos.Solicitudes.length > 0);
        $('#total').text(datos.Resumen.Total); $('#pendientes').text(datos.Resumen.Pendientes);
        $('#en-proceso').text(datos.Resumen.EnProceso); $('#resueltas').text(datos.Resumen.Resueltas);
        datos.Solicitudes.forEach(function (s) {
            var fila = $('<tr>');
            $('<td>').append($('<strong>').text('#' + s.Id), $('<small>').text(s.Fecha)).appendTo(fila);
            $('<td>').append($('<strong>').text(s.Solicitante), $('<small>').text(s.Correo)).appendTo(fila);
            $('<td>').append($('<span>').text(s.Area), $('<small>').text('Prioridad ' + s.Prioridad)).appendTo(fila);
            $('<td>').text(s.Descripcion).appendTo(fila);
            $('<td>').text(s.PersonasAfectadas).appendTo(fila);
            $('<td>').append(insignia(s.Estado)).appendTo(fila);
            $('#lista').append(fila);
            var tarjeta = $('<article>').addClass('task');
            var detalle = $('<div>').append($('<h3>').text('#' + s.Id + ' · ' + s.Area),
                $('<p>').text(s.Descripcion), $('<small>').text('Prioridad ' + s.Prioridad + ' · ' + s.PersonasAfectadas + ' persona(s) afectada(s)'));
            tarjeta.append(detalle, insignia(s.Estado));
            if (s.Estado !== 'Resuelta') {
                $('<button>').attr('type', 'button').addClass('secondary').text(s.Estado === 'Pendiente' ? 'Iniciar atención' : 'Marcar resuelta')
                    .on('click', function () { enviar('Procesar', { id: s.Id, estadoEsperado: s.Estado }); }).appendTo(tarjeta);
            } else $('<span>').addClass('closed').text('Atención completada').appendTo(tarjeta);
            $('#acciones').append(tarjeta);
        });
    }
    function validar() {
        var entrada = { Solicitante: $('#solicitante').val().trim(), Correo: $('#correo').val().trim(),
            Area: $('#area').val(), Prioridad: $('#prioridad').val(),
            PersonasAfectadas: Number($('#personas').val()), Descripcion: $('#descripcion').val().trim() };
        var errores = [];
        $('#registro input, #registro select, #registro textarea').removeAttr('aria-invalid');
        function error(id, texto) { errores.push(texto); $(id).attr('aria-invalid', 'true'); }
        if (entrada.Solicitante.length < 3 || entrada.Solicitante.length > 80) error('#solicitante', 'El solicitante debe tener entre 3 y 80 caracteres.');
        if (entrada.Correo.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entrada.Correo)) error('#correo', 'Ingrese un correo válido.');
        if (!entrada.Area) error('#area', 'Seleccione un área.');
        if (!entrada.Prioridad) error('#prioridad', 'Seleccione una prioridad.');
        if (!Number.isInteger(entrada.PersonasAfectadas) || entrada.PersonasAfectadas < 1 || entrada.PersonasAfectadas > 500) error('#personas', 'Las personas afectadas deben ser un entero entre 1 y 500.');
        if (entrada.Descripcion.length < 10 || entrada.Descripcion.length > 500) error('#descripcion', 'La descripción debe tener entre 10 y 500 caracteres.');
        $('#errores').empty().prop('hidden', errores.length === 0);
        if (errores.length) {
            var lista = $('<ul>'); errores.forEach(function (e) { lista.append($('<li>').text(e)); });
            $('#errores').append(lista); $('[aria-invalid="true"]').first().trigger('focus'); return null;
        }
        return entrada;
    }
    $(function () {
        // Evitar submit/postback incluso al presionar Enter en un campo.
        $('#principal').on('submit', function (e) { e.preventDefault(); $('#registrar').trigger('click'); });
        $('.tab').on('click', function () {
            $('.tab').removeClass('active').attr('aria-pressed', 'false');
            $(this).addClass('active').attr('aria-pressed', 'true');
            $('.panel').prop('hidden', true); $('#' + $(this).data('panel')).prop('hidden', false);
            if ($(this).data('panel') !== 'registro') enviar('Consultar');
        });
        $('#registrar').on('click', function () {
            var entrada = validar();
            if (entrada) enviar('Registrar', { entrada: entrada }, function () {
                $('#registro input, #registro textarea').val(''); $('#registro select').val('');
                $('#mensaje').trigger('focus');
            });
        });
        $('.actualizar').on('click', function () { enviar('Consultar'); });
        enviar('Consultar');
    });
}(jQuery));
