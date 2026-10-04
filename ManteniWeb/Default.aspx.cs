using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.UI;
using ManteniWeb.Models;
using ManteniWeb.Services;

namespace ManteniWeb
{
    public class Inicio : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Materializar la sesión al abrir la página antes de las llamadas Ajax.
            var lista = ListaActual();
        }

        private static List<Solicitud> ListaActual()
        {
            var session = HttpContext.Current.Session;
            if (session["Solicitudes"] == null) session["Solicitudes"] = new List<Solicitud>();
            return (List<Solicitud>)session["Solicitudes"];
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static object Consultar()
        {
            return Respuesta(true, "Listado actualizado.");
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static object Registrar(SolicitudEntrada entrada)
        {
            try {
                Solicitud nueva = GestorSolicitudes.Registrar(ListaActual(), entrada);
                return Respuesta(true, "Solicitud #" + nueva.Id + " registrada correctamente.");
            }
            catch (ArgumentException error) { return Respuesta(false, error.Message); }
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static object Procesar(int id, string estadoEsperado)
        {
            try {
                GestorSolicitudes.Procesar(ListaActual(), id, estadoEsperado);
                return Respuesta(true, "Estado de la solicitud #" + id + " actualizado.");
            }
            catch (ArgumentException error) { return Respuesta(false, error.Message); }
        }

        private static object Respuesta(bool ok, string mensaje)
        {
            List<Solicitud> lista = ListaActual();
            return new { Ok = ok, Mensaje = mensaje,
                Solicitudes = lista.OrderByDescending(s => s.Id).ToList(),
                Resumen = new { Total = lista.Count, Pendientes = lista.Count(s => s.Estado == "Pendiente"),
                    EnProceso = lista.Count(s => s.Estado == "En proceso"), Resueltas = lista.Count(s => s.Estado == "Resuelta") }
            };
        }
    }
}
