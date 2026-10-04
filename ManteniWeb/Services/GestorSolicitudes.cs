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
                Solicitante = nombre, Correo = correo, Area = entrada.Area,
                Prioridad = entrada.Prioridad, PersonasAfectadas = entrada.PersonasAfectadas,
                Descripcion = descripcion, Estado = "Pendiente",
                Fecha = DateTime.UtcNow.AddHours(-6).ToString("dd/MM/yyyy HH:mm")
            };
            lista.Add(solicitud);
            return solicitud;
        }

        public static void Procesar(List<Solicitud> lista, int id, string estadoEsperado)
        {
            Solicitud solicitud = lista.SingleOrDefault(s => s.Id == id);
            if (solicitud == null) throw new ArgumentException("La solicitud ya no está en esta sesión. Actualice el listado.");
            if (solicitud.Estado != estadoEsperado) throw new ArgumentException("El estado cambió en otra pestaña. Actualice antes de continuar.");
            if (solicitud.Estado == "Pendiente") solicitud.Estado = "En proceso";
            else if (solicitud.Estado == "En proceso") solicitud.Estado = "Resuelta";
            else throw new ArgumentException("La solicitud ya está resuelta.");
        }

        private static string Texto(string valor, int minimo, int maximo, string mensaje)
        {
            valor = (valor ?? "").Trim();
            if (valor.Length < minimo || valor.Length > maximo) throw new ArgumentException(mensaje);
            return valor;
        }
    }
}
