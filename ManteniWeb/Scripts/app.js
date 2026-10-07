(function ($) {
    'use strict';
    var ocupado = false, tickets = [], seleccionado = null, versionAbierta = null, editando = false;
    var panelActual = 'registro', modoCierre = false;
    function codigo(id) { return 'TK-' + String(id).padStart(4, '0'); }
    function mensaje(texto, error) {
        $('#mensaje').text(texto).toggleClass('error', !!error).prop('hidden', false);
    }
    function bloqueo(valor) {
        ocupado = valor;
        $('button').prop('disabled', valor);
        $('main').attr('aria-busy', String(valor));
        if (!valor && seleccionado) $('#resolver').prop('disabled', seleccionado.Estado !== 'En atención');
    }
    function enviar(metodo, datos, alCompletar, silencio) {
        if (ocupado) return;
        bloqueo(true);
        $.ajax({ url: 'Default.aspx/' + metodo, method: 'POST',
            contentType: 'application/json; charset=utf-8', dataType: 'json',
            data: JSON.stringify(datos || {}), timeout: 15000
        }).done(function (respuesta) {
            var resultado = respuesta.d;
            tickets = resultado.Solicitudes;
            dibujar(resultado.Resumen);
            if (!silencio || !resultado.Ok) mensaje(resultado.Mensaje, !resultado.Ok);
            if (!resultado.Ok && document.getElementById('detalle').open) {
                $('#errores-atencion').text(resultado.Mensaje).prop('hidden', false);
            }
            if (resultado.Ok && alCompletar) alCompletar(resultado);
        }).fail(function () {
            var texto = 'No fue posible confirmar la operación. Actualice antes de reenviarla para evitar duplicados.';
            mensaje(texto, true);
            if (document.getElementById('detalle').open) $('#errores-atencion').text(texto).prop('hidden', false);
        }).always(function () { bloqueo(false); });
    }
    function insignia(estado) {
        var clase = estado === 'Resuelto' ? 'done' : estado === 'En atención' ? 'working' : 'open';
        return $('<span>').addClass('badge ' + clase).text(estado);
    }
    function prioridad(valor) { return $('<span>').addClass('priority ' + valor.toLowerCase()).text('● ' + valor); }
    function normalizar(texto) { return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
    // Datos del usuario siempre insertados como texto, no como HTML.
    function dibujarTabla() {
        $('#lista').empty();
        var busqueda = normalizar($('#buscar').val().trim()), estado = $('#filtro-estado').val(), nivel = $('#filtro-prioridad').val();
        var visibles = tickets.filter(function (s) {
            return (!estado || s.Estado === estado) && (!nivel || s.Prioridad === nivel) &&
                (!busqueda || normalizar(codigo(s.Id) + ' ' + s.Asunto + ' ' + s.Solicitante).includes(busqueda));
        });
        visibles.forEach(function (s) {
            var fila = $('<tr>');
            $('<td>').append($('<div>').addClass('ticket-code').text(codigo(s.Id)), $('<strong>').text(s.Asunto), $('<small>').text(s.Fecha)).appendTo(fila);
            $('<td>').append($('<strong>').text(s.Solicitante), $('<small>').text(s.Area)).appendTo(fila);
            $('<td>').text(s.Categoria).appendTo(fila);
            $('<td>').append(prioridad(s.Prioridad)).appendTo(fila);
            $('<td>').append(insignia(s.Estado)).appendTo(fila);
            $('<td>').append($('<button>').attr({ type: 'button', 'aria-label': 'Ver detalle de ' + codigo(s.Id) }).addClass('text-button').text('Ver →')
                .on('click', function () { abrir(s.Id, false); })).appendTo(fila);
            $('#lista').append(fila);
        });
        $('#vacio-consulta').prop('hidden', visibles.length > 0);
        $('#titulo-vacio').text(tickets.length ? 'Sin coincidencias' : 'Su bandeja está lista');
        $('#texto-vacio').text(tickets.length ? 'Pruebe otro término o cambie los filtros.' : 'Registre su primer ticket para comenzar el seguimiento.');
        $('#resultados').text(visibles.length + ' de ' + tickets.length + ' tickets');
    }
    function dibujar(resumen) {
        $('#total, #cantidad').text(resumen.Total); $('#abiertos').text(resumen.Abiertos);
        $('#en-atencion').text(resumen.EnAtencion); $('#resueltos').text(resumen.Resueltos);
        $('#alta-pendiente').text(resumen.AltaPendiente);
        dibujarTabla();
        $('#acciones').empty(); $('#vacio-proceso').prop('hidden', tickets.length > 0);
        // Tickets abiertos primero; dentro de cada grupo, prioridad alta antes de media/baja.
        var estados = { 'Abierto': 0, 'En atención': 1, 'Resuelto': 2 }, prioridades = { Alta: 0, Media: 1, Baja: 2 };
        tickets.slice().sort(function (a, b) { return estados[a.Estado] - estados[b.Estado] || prioridades[a.Prioridad] - prioridades[b.Prioridad] || a.Id - b.Id; }).forEach(function (s) {
            var tarjeta = $('<article>').addClass('task');
            tarjeta.append($('<div>').addClass('task-top').append($('<span>').addClass('ticket-code').text(codigo(s.Id)), insignia(s.Estado)),
                $('<h3>').text(s.Asunto), $('<p>').text(s.Descripcion),
                $('<div>').addClass('task-meta').append($('<span>').text(s.Solicitante), $('<span>').text(s.Categoria), prioridad(s.Prioridad)));
            var pie = $('<div>').addClass('task-footer').append($('<small>').text(s.Tecnico ? 'Técnico: ' + s.Tecnico : 'Sin atención registrada'));
            $('<button>').attr('type', 'button').addClass(s.Estado === 'Resuelto' ? 'secondary' : 'primary')
                .text(s.Estado === 'Resuelto' ? 'Ver solución' : s.Estado === 'En atención' ? 'Agregar seguimiento' : 'Atender ticket →')
                .on('click', function () { abrir(s.Id, s.Estado !== 'Resuelto'); }).appendTo(pie);
            if (s.Estado === 'En atención') {
                $('<button>').attr('type', 'button').addClass('primary').text('Resolver ticket ✓')
                    .on('click', function () { abrir(s.Id, true, true); }).appendTo(pie);
            }
            tarjeta.append(pie); $('#acciones').append(tarjeta);
        });
    }
    function abrir(id, editar, cierre) {
        seleccionado = tickets.find(function (s) { return s.Id === id; });
        if (!seleccionado) { mensaje('Este ticket ya no está en la sesión.', true); return; }
        var s = seleccionado;
        versionAbierta = s.Version;
        editando = editar && s.Estado !== 'Resuelto';
        modoCierre = editando && !!cierre && s.Estado === 'En atención';
        $('#mensaje-detalle').empty().prop('hidden', true);
        $('#detalle-id').text(codigo(s.Id) + ' · ' + s.Categoria);
        $('#detalle-titulo').text(s.Asunto);
        var resumen = $('<div>').addClass('detail-summary');
        resumen.append($('<div>').addClass('detail-meta').append(insignia(s.Estado), prioridad(s.Prioridad),
            $('<span>').text(s.Area), $('<span>').text(s.Fecha + ' · UTC−6')),
            $('<strong>').text('Solicitante: ' + s.Solicitante),
            $('<small>').text(s.Correo + ' · ' + s.PersonasAfectadas + ' persona(s) afectada(s)'),
            $('<p>').text(s.Descripcion));
        $('#detalle-datos').empty().append(resumen);
        $('#atencion-form').prop('hidden', !editando);
        $('#errores-atencion').empty().prop('hidden', true);
        $('#atencion-form [aria-invalid]').removeAttr('aria-invalid');
        $('#tecnico').val(s.Tecnico || ''); $('#persona-atendida').val(s.PersonaAtendida || s.Solicitante);
        $('#diagnostico').val(s.Diagnostico || ''); $('#revision').val(s.Revision || ''); $('#solucion').val(s.Solucion || '');
        $('#tecnico, #persona-atendida, #diagnostico, #revision').prop('readOnly', modoCierre);
        $('#campo-solucion').prop('hidden', !modoCierre);
        $('#guardar-atencion').prop('hidden', modoCierre);
        $('#resolver').prop('hidden', !modoCierre);
        $('#etapa-titulo').text(modoCierre ? 'Paso 2 · Resolver ticket' : 'Paso 1 · Registrar atención');
        $('#etapa-descripcion').text(modoCierre ? 'Revise la atención registrada y documente la solución.' : 'Registre el diagnóstico y la revisión. Este paso no cierra el ticket.');
        $('#resolver').prop('disabled', s.Estado !== 'En atención');
        $('#estado-ayuda').text(modoCierre ? 'Al confirmar, el ticket quedará Resuelto y será de solo lectura.' : 'Después de guardar, podrá elegir Resolver ticket en la cola de atención.');
        $('#historial').empty().append($('<h3>').text('Historial de atención'));
        if (!s.Historial.length) $('#historial').append($('<p>').text('Todavía no hay revisiones registradas.'));
        s.Historial.slice().reverse().forEach(function (h) {
            var item = $('<article>').addClass('history-item').append($('<h4>').text(h.Fecha + ' · ' + h.Estado + ' · ' + h.Tecnico));
            [['Persona atendida', h.PersonaAtendida], ['Diagnóstico', h.Diagnostico], ['Revisión', h.Revision], ['Solución', h.Solucion || 'Pendiente de documentar']].forEach(function (par) {
                item.append($('<p>').append($('<strong>').text(par[0] + ': '), document.createTextNode(par[1])));
            });
            $('#historial').append(item);
        });
        var dialogo = document.getElementById('detalle');
        if (!dialogo.open) dialogo.showModal();
    }
    function mostrar(panel) {
        panelActual = panel;
        $('#mensaje').prop('hidden', true);
        $('.tab').each(function () { var activa = $(this).data('panel') === panel; $(this).toggleClass('active', activa).attr('aria-pressed', String(activa)); });
        $('.panel-section').prop('hidden', true); $('#' + panel).prop('hidden', false);
        var titulos = { consulta: ['Cada ticket, bajo control.', 'Consulte sus solicitudes y mantenga el trabajo en movimiento.'],
            registro: ['Estamos para ayudarle.', 'Un reporte claro es el primer paso hacia una solución.'],
            proceso: ['Atención con seguimiento.', 'Documente cada revisión y cierre el ciclo con una solución.'] };
        $('#page-title').text(titulos[panel][0]); $('#page-subtitle').text(titulos[panel][1]);
        $('#nuevo').prop('hidden', panel === 'registro');
        if (panel !== 'registro') enviar('Consultar', {}, null, true);
    }
    function erroresEn(contenedor, errores) {
        var panel = $(contenedor).empty().prop('hidden', errores.length === 0);
        if (errores.length) {
            var lista = $('<ul>'); errores.forEach(function (e) { lista.append($('<li>').text(e)); }); panel.append(lista);
            $(contenedor).parent().find('[aria-invalid="true"]').first().trigger('focus');
        }
        return errores.length === 0;
    }
    function validarRegistro() {
        var e = { Asunto: $('#asunto').val().trim(), Categoria: $('#categoria').val(), Solicitante: $('#solicitante').val().trim(),
            Correo: $('#correo').val().trim(), Area: $('#area').val(), Prioridad: $('#prioridad').val(),
            PersonasAfectadas: Number($('#personas').val()), Descripcion: $('#descripcion').val().trim() }, errores = [];
        $('#registro [aria-invalid]').removeAttr('aria-invalid');
        function fallo(id, texto) { errores.push(texto); $(id).attr('aria-invalid', 'true'); }
        if (e.Asunto.length < 5 || e.Asunto.length > 100) fallo('#asunto', 'El asunto debe tener entre 5 y 100 caracteres.');
        if (!e.Categoria) fallo('#categoria', 'Seleccione una categoría.');
        if (e.Solicitante.length < 3 || e.Solicitante.length > 80) fallo('#solicitante', 'El solicitante debe tener entre 3 y 80 caracteres.');
        if (e.Correo.length < 5 || e.Correo.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.Correo)) fallo('#correo', 'Ingrese un correo válido.');
        if (!e.Area) fallo('#area', 'Seleccione un área.');
        if (!e.Prioridad) fallo('#prioridad', 'Seleccione una prioridad.');
        if (!Number.isInteger(e.PersonasAfectadas) || e.PersonasAfectadas < 1 || e.PersonasAfectadas > 500) fallo('#personas', 'Las personas afectadas deben ser un entero entre 1 y 500.');
        if (e.Descripcion.length < 10 || e.Descripcion.length > 500) fallo('#descripcion', 'La descripción debe tener entre 10 y 500 caracteres.');
        return erroresEn('#errores', errores) ? e : null;
    }
    function guardarAtencion(accion) {
        if (!seleccionado || !editando || ocupado) return;
        if ((accion === 'Resolver') !== modoCierre) return;
        var entrada = { Id: seleccionado.Id, Version: versionAbierta, Accion: accion,
            Tecnico: $('#tecnico').val().trim(), PersonaAtendida: $('#persona-atendida').val().trim(),
            Diagnostico: $('#diagnostico').val().trim(), Revision: $('#revision').val().trim(), Solucion: $('#solucion').val().trim() }, errores = [];
        $('#atencion-form [aria-invalid]').removeAttr('aria-invalid');
        [['#tecnico', entrada.Tecnico, 3, 80, 'Técnico'], ['#persona-atendida', entrada.PersonaAtendida, 3, 80, 'Persona atendida'],
            ['#diagnostico', entrada.Diagnostico, 10, 1000, 'Diagnóstico'], ['#revision', entrada.Revision, 10, 1000, 'Revisión'],
            ['#solucion', entrada.Solucion, accion === 'Resolver' ? 10 : 0, 1000, 'Solución']].forEach(function (r) {
                if (r[1].length < r[2] || r[1].length > r[3]) { errores.push(r[4] + ': entre ' + r[2] + ' y ' + r[3] + ' caracteres.'); $(r[0]).attr('aria-invalid', 'true'); }
            });
        if (erroresEn('#errores-atencion', errores)) enviar('Procesar', { entrada: entrada }, function (resultado) {
            abrir(entrada.Id, false);
            $('#mensaje-detalle').text(resultado.Mensaje + (accion === 'Resolver' ? '' : ' Cierre esta ventana y elija Resolver ticket cuando tenga la solución.'))
                .prop('hidden', false).trigger('focus');
        });
    }
    $(function () {
        $('#principal').on('submit', function (e) { e.preventDefault(); if (!document.getElementById('detalle').open && panelActual === 'registro') $('#registrar').trigger('click'); });
        $('.tab').on('click', function () { mostrar($(this).data('panel')); });
        $('#nuevo').on('click', function () { mostrar('registro'); $('#asunto').trigger('focus'); });
        $('#registrar').on('click', function () {
            var entrada = validarRegistro();
            if (entrada) enviar('Registrar', { entrada: entrada }, function () {
                $('#registro input, #registro textarea, #registro select').val('');
                $('#mensaje').trigger('focus');
            });
        });
        $('#buscar').on('input', dibujarTabla); $('#filtro-estado, #filtro-prioridad').on('change', dibujarTabla);
        $('.actualizar').on('click', function () { enviar('Consultar'); });
        $('#guardar-atencion').on('click', function () { guardarAtencion('Guardar'); });
        $('#resolver').on('click', function () { guardarAtencion('Resolver'); });
        $('#cerrar-detalle').on('click', function () { document.getElementById('detalle').close(); });
        $('#detalle').on('close', function () { seleccionado = null; versionAbierta = null; editando = false; });
        mostrar('registro');
        enviar('Consultar', {}, null, true);
    });
}(jQuery));
