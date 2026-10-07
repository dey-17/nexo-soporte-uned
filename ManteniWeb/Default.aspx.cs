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
                return Respuesta(true, "Ticket TK-" + nueva.Id.ToString("D4") + " registrado correctamente.");
            }
            catch (ArgumentException error) { return Respuesta(false, error.Message); }
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static object Procesar(AtencionEntrada entrada)
        {
            try {
                GestorSolicitudes.Procesar(ListaActual(), entrada);
                return Respuesta(true, entrada.Accion == "Resolver" ? "Ticket resuelto. La solución quedó registrada y el ticket está cerrado." : "Atención registrada. El ticket queda en atención; todavía no está cerrado.");
            }
            catch (ArgumentException error) { return Respuesta(false, error.Message); }
        }

        private static object Respuesta(bool ok, string mensaje)
        {
            List<Solicitud> lista = ListaActual();
            return new { Ok = ok, Mensaje = mensaje,
                Solicitudes = lista.OrderByDescending(s => s.Id).ToList(),
                Resumen = new { Total = lista.Count, Abiertos = lista.Count(s => s.Estado == "Abierto"),
                    EnAtencion = lista.Count(s => s.Estado == "En atención"), Resueltos = lista.Count(s => s.Estado == "Resuelto"),
                    AltaPendiente = lista.Count(s => s.Prioridad == "Alta" && s.Estado != "Resuelto") }
            };
        }
    }
}
