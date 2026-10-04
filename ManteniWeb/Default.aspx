<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ManteniWeb.Inicio" %>
<!DOCTYPE html>
<html lang="es">
<head runat="server"><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>ManteniWeb · Solicitudes de mantenimiento</title><link rel="stylesheet" href="Content/site.css"/></head>
<body>
<form id="principal" runat="server">
  <header class="top"><a class="brand" href="Default.aspx"><span class="mark">M</span> ManteniWeb</a><span class="session">● Sesión de trabajo · Prototipo</span></header>
  <main>
    <div class="intro"><div><p class="eyebrow">OPERACIONES / MANTENIMIENTO</p><h1>Todo reporte tiene un siguiente paso.</h1><p class="lead">Registre necesidades, consulte solicitudes y dé seguimiento al trabajo de su sede.</p></div><span class="tag">Sin base de datos</span></div>
    <aside class="notice">Los datos se conservan únicamente en esta sesión. Se pierden tras 30 minutos de inactividad o al reiniciar el servidor. Otra sesión tendrá su propia lista.</aside>
    <nav aria-label="Funcionalidades principales"><button type="button" class="tab active" data-panel="registro" aria-pressed="true">01 · Registrar</button><button type="button" class="tab" data-panel="consulta" aria-pressed="false">02 · Consultar</button><button type="button" class="tab" data-panel="proceso" aria-pressed="false">03 · Procesar</button></nav>
    <div id="mensaje" role="status" aria-live="polite" tabindex="-1" hidden></div>
    <section id="registro" class="panel" aria-labelledby="titulo-registro">
      <div class="section-head"><div><p class="eyebrow">NUEVA SOLICITUD</p><h2 id="titulo-registro">Cuéntenos qué necesita atención</h2><p>Todos los campos son obligatorios. La solicitud inicia como pendiente.</p></div><span class="chip">Paso 1 de 3</span></div>
      <div id="errores" class="errors" role="alert" hidden></div>
      <div class="fields">
        <label>Nombre del solicitante<input id="solicitante" type="text" minlength="3" maxlength="80" autocomplete="name" placeholder="Ej.: Ana Jiménez" required/></label>
        <label>Correo electrónico<input id="correo" type="email" maxlength="120" autocomplete="email" placeholder="Ej.: ana@organizacion.cr" required/></label>
        <label>Área<select id="area" required><option value="">Seleccione un área</option><option>Administración</option><option>Operaciones</option><option>Tecnología</option><option>Servicios generales</option></select></label>
        <label>Prioridad<select id="prioridad" required><option value="">Seleccione una prioridad</option><option>Baja</option><option>Media</option><option>Alta</option></select></label>
        <label>Personas afectadas<input id="personas" type="number" min="1" max="500" step="1" placeholder="De 1 a 500" required/></label>
        <div class="hint"><strong>Describa la necesidad con claridad.</strong><span>Incluya ubicación y efecto del problema. Evite datos sensibles.</span></div>
        <label class="wide">Descripción<textarea id="descripcion" rows="4" minlength="10" maxlength="500" placeholder="Ej.: La luminaria de recepción no enciende y dificulta la atención." required></textarea><small>Entre 10 y 500 caracteres.</small></label>
      </div><div class="form-footer"><span>Almacenamiento temporal · Máximo 200 solicitudes</span><button type="button" class="primary" id="registrar">Registrar solicitud →</button></div>
    </section>
    <section id="consulta" class="panel" aria-labelledby="titulo-consulta" hidden>
      <div class="section-head"><div><p class="eyebrow">LISTADO DE LA SESIÓN</p><h2 id="titulo-consulta">Sus solicitudes, en un lugar</h2><p>La más reciente aparece primero. Actualizar obtiene los datos del servidor sin recargar la página.</p></div><button type="button" class="secondary actualizar">Actualizar listado</button></div>
      <div class="table-wrap"><table><caption class="sr-only">Solicitudes registradas en la sesión</caption><thead><tr><th>ID / Fecha (UTC−6)</th><th>Solicitante</th><th>Área / Prioridad</th><th>Descripción</th><th>Personas</th><th>Estado</th></tr></thead><tbody id="lista"></tbody></table></div>
      <p id="vacio-consulta" class="empty">Aún no hay solicitudes. Empiece en Registrar.</p>
    </section>
    <section id="proceso" class="panel" aria-labelledby="titulo-proceso" hidden>
      <div class="section-head"><div><p class="eyebrow">SEGUIMIENTO OPERATIVO</p><h2 id="titulo-proceso">Convierta reportes en trabajo resuelto</h2><p>Avance una etapa por vez. El resumen se calcula en el servidor después de cada cambio.</p></div><button type="button" class="secondary actualizar">Actualizar estados</button></div>
      <div class="stats"><div><span>Total</span><strong id="total">0</strong></div><div><span>Pendientes</span><strong id="pendientes">0</strong></div><div><span>En proceso</span><strong id="en-proceso">0</strong></div><div><span>Resueltas</span><strong id="resueltas">0</strong></div></div>
      <div id="acciones" class="tasks"></div><p id="vacio-proceso" class="empty">Registre una solicitud para iniciar el seguimiento.</p>
    </section>
    <footer>UNED · 03101 Programación avanzada en web · Tarea 1 <span>Web Forms / C# / jQuery / Ajax</span></footer>
  </main>
</form>
<noscript>Active JavaScript para utilizar las tres funcionalidades.</noscript>
<script src="Scripts/jquery-3.7.1.min.js"></script><script src="Scripts/app.js"></script>
</body></html>
