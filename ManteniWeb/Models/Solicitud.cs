namespace ManteniWeb.Models
{
    public class SolicitudEntrada
    {
        public string Asunto { get; set; }
        public string Categoria { get; set; }
        public string Solicitante { get; set; }
        public string Correo { get; set; }
        public string Area { get; set; }
        public string Prioridad { get; set; }
        public int PersonasAfectadas { get; set; }
        public string Descripcion { get; set; }
    }

    public class Solicitud : SolicitudEntrada
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public string Fecha { get; set; }
        public int Version { get; set; }
        public string Tecnico { get; set; }
        public string PersonaAtendida { get; set; }
        public string Diagnostico { get; set; }
        public string Revision { get; set; }
        public string Solucion { get; set; }
        public string UltimaAtencion { get; set; }
        public System.Collections.Generic.List<Atencion> Historial { get; set; }
    }

    public class AtencionEntrada
    {
        public int Id { get; set; }
        public int Version { get; set; }
        public string Accion { get; set; }
        public string Tecnico { get; set; }
        public string PersonaAtendida { get; set; }
        public string Diagnostico { get; set; }
        public string Revision { get; set; }
        public string Solucion { get; set; }
    }

    public class Atencion
    {
        public string Fecha { get; set; }
        public string Estado { get; set; }
        public string Tecnico { get; set; }
        public string PersonaAtendida { get; set; }
        public string Diagnostico { get; set; }
        public string Revision { get; set; }
        public string Solucion { get; set; }
    }
}
