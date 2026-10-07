<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ManteniWeb.Inicio" %>
<!DOCTYPE html><html lang="es">
<head runat="server"><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Nexo · Mesa de soporte</title><link rel="stylesheet" href="Content/site.css?v=3"/></head>
<body><form id="principal" runat="server" novalidate>
<aside class="sidebar">
<a class="brand" href="Default.aspx"><span class="mark">n.</span><span>NEXO<small>MESA DE SOPORTE</small></span></a>
<div class="nav-label">ESPACIO DE TRABAJO</div>
<nav aria-label="Funcionalidades principales">
<button type="button" class="tab active" data-panel="registro" aria-pressed="true"><span>＋</span> Registrar ticket</button>
<button type="button" class="tab" data-panel="consulta" aria-pressed="false"><span>▦</span> Consultar tickets</button>
<button type="button" class="tab" data-panel="proceso" aria-pressed="false"><span>◎</span> Atender tickets</button>
</nav><div class="sidebar-note"><span class="pulse"></span> Sesión de trabajo<small>Un espacio para dar seguimiento<br/>a cada solicitud de soporte.</small></div>
<div class="sidebar-bottom">NEXO / SOPORTE INTERNO<small>Programación avanzada en web</small></div></aside>
<div class="workspace"><header class="top"><span>Operaciones <span class="slash">/</span> Mesa de soporte</span><span class="top-status"><span class="pulse"></span> Sesión activa <span class="avatar">NS</span></span></header>
<main><div class="intro"><div><p class="eyebrow">SOPORTE QUE CONECTA</p><h1 id="page-title">Cada ticket, bajo control.</h1><p class="lead" id="page-subtitle">Consulte sus solicitudes y mantenga el trabajo en movimiento.</p></div><button type="button" class="primary" id="nuevo">＋ Nuevo ticket</button></div>
<div id="mensaje" role="status" aria-live="polite" tabindex="-1" hidden></div>
<section id="consulta" class="panel-section" aria-labelledby="titulo-consulta">
<div class="stats" aria-label="Resumen de tickets de esta sesión">
<article><span class="stat-symbol neutral">▦</span><span>Total de tickets</span><strong id="total">0</strong><small>Registrados en esta sesión</small></article>
<article><span class="stat-symbol amber">◷</span><span>Abiertos</span><strong id="abiertos">0</strong><small>Pendientes de revisión</small></article>
<article><span class="stat-symbol blue">◎</span><span>En atención</span><strong id="en-atencion">0</strong><small>Con seguimiento técnico</small></article>
<article><span class="stat-symbol green">✓</span><span>Resueltos</span><strong id="resueltos">0</strong><small>Con solución documentada</small></article></div>
<div class="card"><div class="section-head"><div><h2 id="titulo-consulta">Bandeja de tickets <span class="count" id="cantidad">0</span></h2><p>Información y seguimiento de su sesión de trabajo.</p></div><button type="button" class="secondary actualizar">↻ Actualizar</button></div>
<div class="filters"><label class="search"><span class="sr-only">Buscar tickets</span><input id="buscar" type="search" placeholder="Buscar por ID, asunto o solicitante…" maxlength="100"/></label><label><span class="sr-only">Filtrar por estado</span><select id="filtro-estado"><option value="">Todos los estados</option><option>Abierto</option><option>En atención</option><option>Resuelto</option></select></label><label><span class="sr-only">Filtrar por prioridad</span><select id="filtro-prioridad"><option value="">Todas las prioridades</option><option>Alta</option><option>Media</option><option>Baja</option></select></label></div>
<div class="table-wrap"><table><caption class="sr-only">Tickets de soporte</caption><thead><tr><th>Ticket / Asunto</th><th>Solicitante</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Detalle</th></tr></thead><tbody id="lista"></tbody></table></div>
<div id="vacio-consulta" class="empty"><span class="empty-icon">▤</span><h3 id="titulo-vacio">Su bandeja está lista</h3><p id="texto-vacio">Registre su primer ticket para comenzar el seguimiento.</p></div>
<div class="table-footer"><span id="resultados">0 tickets</span><span>Fechas y horas UTC−6</span></div></div></section>
<section id="registro" class="panel-section" aria-labelledby="titulo-registro" hidden>
<div class="register-layout"><div class="card form-card"><div class="section-head"><div><p class="eyebrow">NUEVA SOLICITUD</p><h2 id="titulo-registro">Abrir un ticket de soporte</h2><p>Cuéntenos qué sucede. Todos los campos son obligatorios.</p></div></div>
<div id="errores" class="errors" role="alert" hidden></div><div class="fields">
<label class="wide">Asunto<input id="asunto" minlength="5" maxlength="100" placeholder="Ej.: No puedo conectarme a la red de la oficina" required/></label>
<label>Nombre del solicitante<input id="solicitante" minlength="3" maxlength="80" autocomplete="name" placeholder="Nombre y apellido" required/></label>
<label>Correo electrónico<input id="correo" type="email" maxlength="120" autocomplete="email" placeholder="nombre@empresa.com" required/></label>
<label>Área<select id="area" required><option value="">Seleccione un área</option><option>Administración</option><option>Operaciones</option><option>Tecnología</option><option>Servicios generales</option></select></label>
<label>Categoría<select id="categoria" required><option value="">Seleccione una categoría</option><option>Hardware</option><option>Software</option><option>Red y conectividad</option><option>Accesos</option><option>Otro</option></select></label>
<label>Prioridad<select id="prioridad" required><option value="">Seleccione una prioridad</option><option>Baja</option><option>Media</option><option>Alta</option></select></label>
<label>Personas afectadas<input id="personas" type="number" min="1" max="500" step="1" placeholder="De 1 a 500" required/></label>
<label class="wide">¿Qué problema está presentando?<textarea id="descripcion" rows="4" minlength="10" maxlength="500" placeholder="Explique qué intentó hacer, qué ocurrió y desde cuándo sucede." required></textarea><small>Entre 10 y 500 caracteres. No incluya contraseñas.</small></label></div>
<div class="form-footer"><span>El ticket se creará con estado Abierto.</span><button type="button" class="primary" id="registrar">Crear ticket →</button></div></div>
<aside class="help-card"><span class="help-symbol">i</span><h3>Un buen reporte ayuda a resolver.</h3><p>Incluya el equipo o sistema afectado y el mensaje de error, si existe.</p><hr/><h4>¿Cómo elegir la prioridad?</h4><p><strong class="red-text">Alta</strong><br/>El problema impide continuar el trabajo.</p><p><strong>Media</strong><br/>Dificulta una tarea, pero hay una alternativa.</p><p><strong>Baja</strong><br/>Consulta o inconveniente menor.</p><div class="help-foot">REPORTE → ATENCIÓN → SOLUCIÓN</div></aside></div></section>
<section id="proceso" class="panel-section" aria-labelledby="titulo-proceso" hidden>
<div class="queue-banner"><div><p class="eyebrow">ATENCIÓN DE SOPORTE</p><h2 id="titulo-proceso">Una solución empieza con una buena revisión.</h2><p>Abra un ticket, documente el diagnóstico y registre cómo se solucionó.</p></div><div class="urgent"><strong id="alta-pendiente">0</strong><span>de prioridad alta<br/>sin resolver</span></div></div>
<div class="section-head queue-head"><h3>Cola de atención</h3><button type="button" class="secondary actualizar">↻ Actualizar</button></div>
<div id="acciones" class="tasks"></div><div id="vacio-proceso" class="empty card"><span class="empty-icon">✓</span><h3>No hay tickets en esta sesión</h3><p>Registre un ticket para comenzar la atención.</p></div></section>
<footer><span>Nexo · Mesa de soporte</span><span>Los datos de esta sesión son temporales: caducan tras 30 minutos de inactividad o al reiniciar el servidor.</span></footer>
</main></div>
<dialog id="detalle" aria-labelledby="detalle-titulo"><div class="dialog-head"><div><p class="eyebrow" id="detalle-id">DETALLE DEL TICKET</p><h2 id="detalle-titulo">Atención de ticket</h2></div><button type="button" class="icon-button" id="cerrar-detalle" aria-label="Cerrar detalle">×</button></div>
<div class="dialog-body"><div id="mensaje-detalle" class="notice-success" role="status" aria-live="polite" tabindex="-1" hidden></div><div id="detalle-datos"></div><div id="atencion-form"><div class="divider-heading"><h3 id="etapa-titulo">Paso 1 · Registrar atención</h3><span id="etapa-descripcion">Registre el diagnóstico y la revisión. Este paso no cierra el ticket.</span></div>
<div id="errores-atencion" class="errors" role="alert" hidden></div><div class="fields">
<label>Técnico responsable<input id="tecnico" maxlength="80" placeholder="Nombre de quien atiende"/></label><label>Persona atendida<input id="persona-atendida" maxlength="80"/></label>
<label class="wide">Diagnóstico · ¿qué problema se identificó?<textarea id="diagnostico" rows="2" maxlength="1000" placeholder="Describa la causa o el diagnóstico inicial."></textarea></label>
<label class="wide">Revisión · ¿qué se revisó o comprobó?<textarea id="revision" rows="2" maxlength="1000" placeholder="Registre verificaciones, pruebas o acciones realizadas."></textarea></label>
<label class="wide" id="campo-solucion" hidden>Solución · ¿cómo se solucionó?<textarea id="solucion" rows="2" maxlength="1000" placeholder="Explique la solución aplicada."></textarea><small>Describa la solución con un mínimo de 10 caracteres para confirmar el cierre.</small></label></div>
<div class="dialog-actions"><span id="estado-ayuda"></span><button type="button" class="primary" id="guardar-atencion">Guardar atención</button><button type="button" class="primary" id="resolver" hidden>Confirmar solución y cerrar ✓</button></div></div><div id="historial"></div></div></dialog>
</form><noscript>Active JavaScript para utilizar la mesa de soporte.</noscript><script src="Scripts/jquery-3.7.1.min.js"></script><script src="Scripts/app.js?v=3"></script></body></html>
