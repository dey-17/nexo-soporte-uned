using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using ManteniWeb.Models;

namespace ManteniWeb.Services
{
    // Lógica separada para poder probarla sin navegador ni servidor web.
    // La lista se recibe desde Session; no hay colecciones static compartidas.
    public static class GestorSolicitudes
    {
        public static Solicitud Registrar(List<Solicitud> lista, SolicitudEntrada entrada)
        {
            if (entrada == null) throw new ArgumentException("Complete los datos de la solicitud.");
            string asunto = Texto(entrada.Asunto, 5, 100, "El asunto debe tener entre 5 y 100 caracteres.");
            if (!new[] { "Hardware", "Software", "Red y conectividad", "Accesos", "Otro" }.Contains(entrada.Categoria)) throw new ArgumentException("Seleccione una categoría válida.");
            string nombre = Texto(entrada.Solicitante, 3, 80, "El solicitante debe tener entre 3 y 80 caracteres.");
            string correo = Texto(entrada.Correo, 5, 120, "Ingrese un correo de hasta 120 caracteres.");
            if (!Regex.IsMatch(correo, @"^[^\s@]+@[^\s@]+\.[^\s@]+$")) throw new ArgumentException("El correo no tiene un formato válido.");
            if (!new[] { "Administración", "Operaciones", "Tecnología", "Servicios generales" }.Contains(entrada.Area)) throw new ArgumentException("Seleccione un área válida.");
            if (!new[] { "Baja", "Media", "Alta" }.Contains(entrada.Prioridad)) throw new ArgumentException("Seleccione una prioridad válida.");
            if (entrada.PersonasAfectadas < 1 || entrada.PersonasAfectadas > 500) throw new ArgumentException("Las personas afectadas deben ser entre 1 y 500.");
            string descripcion = Texto(entrada.Descripcion, 10, 500, "La descripción debe tener entre 10 y 500 caracteres.");
            if (lista.Count >= 200) throw new ArgumentException("Esta sesión alcanzó el máximo de 200 solicitudes del prototipo.");
            Solicitud solicitud = new Solicitud {
                Id = lista.Count == 0 ? 1 : lista.Max(s => s.Id) + 1,
                Asunto = asunto, Categoria = entrada.Categoria, Solicitante = nombre, Correo = correo, Area = entrada.Area,
                Prioridad = entrada.Prioridad, PersonasAfectadas = entrada.PersonasAfectadas,
                Descripcion = descripcion, Estado = "Abierto", Version = 1, Historial = new List<Atencion>(),
                Fecha = DateTime.UtcNow.AddHours(-6).ToString("dd/MM/yyyy HH:mm")
            };
            lista.Add(solicitud);
            return solicitud;
        }

        public static void Procesar(List<Solicitud> lista, AtencionEntrada entrada)
        {
            if (entrada == null) throw new ArgumentException("Complete los datos de atención.");
            Solicitud solicitud = lista.SingleOrDefault(s => s.Id == entrada.Id);
            if (solicitud == null) throw new ArgumentException("El ticket ya no está en esta sesión. Actualice el listado.");
            if (solicitud.Version != entrada.Version) throw new ArgumentException("El ticket cambió en otra pestaña. Sus notas no se guardaron. Cierre el detalle y ábralo de nuevo para revisar la versión actual.");
            if (solicitud.Estado == "Resuelto") throw new ArgumentException("El ticket ya está resuelto y su atención es de solo lectura.");
            if (entrada.Accion != "Guardar" && entrada.Accion != "Resolver") throw new ArgumentException("Seleccione una acción válida.");
            if (entrada.Accion == "Resolver" && solicitud.Estado != "En atención") throw new ArgumentException("Primero registre la revisión inicial para poner el ticket en atención.");
            string tecnico = Texto(entrada.Tecnico, 3, 80, "El técnico debe tener entre 3 y 80 caracteres.");
            string persona = Texto(entrada.PersonaAtendida, 3, 80, "La persona atendida debe tener entre 3 y 80 caracteres.");
            string diagnostico = Texto(entrada.Diagnostico, 10, 1000, "El diagnóstico debe tener entre 10 y 1000 caracteres.");
            string revision = Texto(entrada.Revision, 10, 1000, "Detalle lo revisado entre 10 y 1000 caracteres.");
            string solucion = Texto(entrada.Solucion, entrada.Accion == "Resolver" ? 10 : 0, 1000, "Para resolver, describa la solución entre 10 y 1000 caracteres.");
            if (solicitud.Historial.Count >= 50) throw new ArgumentException("Este ticket alcanzó el máximo de 50 registros de atención del prototipo.");
            // No modificar nada hasta que todas las reglas hayan sido comprobadas.
            solicitud.Tecnico = tecnico; solicitud.PersonaAtendida = persona;
            solicitud.Diagnostico = diagnostico; solicitud.Revision = revision; solicitud.Solucion = solucion;
            solicitud.Estado = entrada.Accion == "Resolver" ? "Resuelto" : "En atención";
            solicitud.UltimaAtencion = DateTime.UtcNow.AddHours(-6).ToString("dd/MM/yyyy HH:mm");
            solicitud.Version++;
            solicitud.Historial.Add(new Atencion { Fecha = solicitud.UltimaAtencion, Estado = solicitud.Estado,
                Tecnico = tecnico, PersonaAtendida = persona, Diagnostico = diagnostico, Revision = revision, Solucion = solucion });
        }

        private static string Texto(string valor, int minimo, int maximo, string mensaje)
        {
            valor = (valor ?? "").Trim();
            if (valor.Length < minimo || valor.Length > maximo) throw new ArgumentException(mensaje);
            return valor;
        }
    }
}
