namespace ManteniWeb.Models
{
    public class SolicitudEntrada
    {
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
    }
}
