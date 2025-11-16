// Variables 
const PRECIOS_WEB = {
  moduloNuevo: 220,
  ajusteModulo: 120,
  funcionalidadNueva: 180,
  ajusteFuncionalidad: 90,
  configBackoffice: 70,
  reporte: 140,
  dashboard: 160,
  personalizacionDash: 200
};
// Margen comercial
const MARGEN = 0.25;


function margenComercial(costo) {
  return Math.round(costo * MARGEN);
}

function pedirEnteroPositivo(etiqueta) {
  while (true) {
    const r = prompt(`${etiqueta}\n(ingresa un número entero ≥ 0)`);
    if (r === null) return null;
    const n = Number(String(r).trim());
    if (Number.isInteger(n) && n >= 0) return n;
    alert("Valor inválido. Intenta de nuevo.");
  }
}

// Variables locales
let nombreproyecto = "";
let fechacotizacion = "";
let componente = "";
let idioma = "";
let estado = "";

// Entradas del “formulario inicio de proyecto"
function pedirDatos() {
  nombreproyecto = prompt("Nombre del proyecto:") || "";
  fechacotizacion = prompt("Fecha de cotización (AAAA-MM-DD o texto):") || "";

  const compIdx = prompt("Tipo de componente: \n1) web\n2) App\n3) Homologación de hardware\n(ingresa 1, 2 ó 3)");
  componente = compIdx === "1" ? "web" : compIdx === "2" ? "App" : "Homologación de Hardware";

  const idiIdx = prompt("Idioma del proyecto:\n1) único Idioma\n2) Bilingue\n3) Multilingue");
  idioma = idiIdx === "1" ? "único Idioma" : idiIdx === "2" ? "Bilingue" : "Multilingue";

  const estIdx = prompt("Estado del Proyecto : \n1) Idea\n2) Boceto\n3) En desarrollo");
  estado = estIdx === "1" ? "Idea" : estIdx === "2" ? "Boceto" : "En desarrollo";
}

// Procesamiento + salida
function mostrarResumen() {
  pedirDatos();

  console.clear();
  console.log("==== RESUMEN DE INFORMACIÓN DEL PROYECTO ====");
  console.log("Nombre del Proyecto: " + nombreproyecto);
  console.log("Fecha de cotización :" + fechacotizacion);
  console.log("componente:" + componente);
  console.log("Idioma del proyecto:" + idioma);
  console.log("Estado del proyecto:" + estado);

  if (estado === "Idea") {
    console.log("El proyecto aún está en fase de idea.");
    alert("Atención: el proyecto aún está en fase de idea.");
  } else {
    console.log("El proyecto ya tiene un avance definido.");
    alert("El proyecto ya tiene un avance definido.");
  }

  const datos = [nombreproyecto, fechacotizacion, componente, idioma, estado];
  for (let i = 0; i < datos.length; i++) {
    console.log("Dato " + (i + 1) + ": " + datos[i]);
  }

  const confirmar = confirm("¿Deseas guardar esta información del Proyecto?");
  console.log(confirmar ? "Proyecto confirmado y guardado (simulado)." : "Proyecto no guardado.");
}

function validarCampos() {
  if (nombreproyecto === "" || fechacotizacion === "") {
    console.log("Faltan campos por llenar.");
  } else {
    console.log("Todos los campos principales fueron llenados.");
  }
}

/* MÓDULO WEB  */
// Entrada de datos al modulo web
function pedirDatosWeb() {
  const q = {
    moduloNuevo:           pedirEnteroPositivo("WEB: ¿Cuántos MÓDULOS FUNCIONALES NUEVOS?"),
    ajusteModulo:          pedirEnteroPositivo("WEB: ¿Cuántos AJUSTES de MÓDULOS actuales?"),
    funcionalidadNueva:    pedirEnteroPositivo("WEB: ¿Cuántas FUNCIONALIDADES NUEVAS?"),
    ajusteFuncionalidad:   pedirEnteroPositivo("WEB: ¿Cuántos AJUSTES de FUNCIONALIDADES actuales?"),
    configBackoffice:      pedirEnteroPositivo("WEB: ¿Cuántos AJUSTES de CONFIGURACIÓN en Backoffice?"),
    reporte:               pedirEnteroPositivo("WEB: ¿Cuántos REPORTES?"),
    dashboard:             pedirEnteroPositivo("WEB: ¿Cuántos DASHBOARDS?"),
    personalizacionDash:   pedirEnteroPositivo("WEB: ¿Cuántas PERSONALIZACIONES de dashboards (paquetes)?")
  };
  if (Object.values(q).some(v => v === null)) return null; // si cancelan, se sale
  return q;
}

// Proceso calculo web 
function calcularWeb(q) {
  const items = [
    { nombre: "Módulos nuevos",                cantidad: q.moduloNuevo,          precio: PRECIOS_WEB.moduloNuevo },
    { nombre: "Ajustes de módulos",            cantidad: q.ajusteModulo,         precio: PRECIOS_WEB.ajusteModulo },
    { nombre: "Funcionalidades nuevas",        cantidad: q.funcionalidadNueva,   precio: PRECIOS_WEB.funcionalidadNueva },
    { nombre: "Ajustes de funcionalidades",    cantidad: q.ajusteFuncionalidad,  precio: PRECIOS_WEB.ajusteFuncionalidad },
    { nombre: "Configs Backoffice",            cantidad: q.configBackoffice,     precio: PRECIOS_WEB.configBackoffice },
    { nombre: "Reportes",                      cantidad: q.reporte,              precio: PRECIOS_WEB.reporte },
    { nombre: "Dashboards",                    cantidad: q.dashboard,            precio: PRECIOS_WEB.dashboard },
    { nombre: "Personalización dashboards",    cantidad: q.personalizacionDash,  precio: PRECIOS_WEB.personalizacionDash }
  ];

  let costoOperativo = 0;
  for (let i = 0; i < items.length; i++) {
    costoOperativo += items[i].cantidad * items[i].precio;
  }

  const costoComercial = margenComercial(costoOperativo);
  const total = costoOperativo + costoComercial;

  return { items, costoOperativo, costoComercial, total };
}

// Salida
function mostrarResumenWeb(detalle) {
  console.log("========== WEB: DETALLE ==========");
  for (let i = 0; i < detalle.items.length; i++) {
    const it = detalle.items[i];
    if (it.cantidad > 0) {
      console.log(`• ${it.nombre}: ${it.cantidad} x $${it.precio} = $${it.cantidad * it.precio}`);
    }
  }
  console.log("----------------------------------");
  console.log("Costo Operativo Web: $" + detalle.costoOperativo);
  console.log("Costo Comercial Web: $" + detalle.costoComercial);
  console.log("TOTAL WEB: $" + detalle.total);
  console.log("==================================\n");

  alert(
    "Resumen WEB (ver detalle en consola):\n" +
    `Operativo: $${detalle.costoOperativo}\n` +
    `Comercial: $${detalle.costoComercial}\n` +
    `TOTAL: $${detalle.total}`
  );
}

// Funciones  Web
function ejecutarModuloWeb() {
  console.log("[WEB] pedirDatosWeb()");
  const datos = pedirDatosWeb();
  if (!datos) {
    alert("Operación cancelada. No se calculará la sección Web.");
    console.log("[WEB] Cancelado por el usuario.");
    return null;
  }
  console.log("[WEB] calcularWeb()");
  const detalle = calcularWeb(datos);
  mostrarResumenWeb(detalle);
  return detalle;
}

/* FLUJO GENERAL  */
mostrarResumen();
validarCampos();

//console.clear();
console.log("===== INFO DEL PROYECTO =====");
let totalGeneral = 0;

const incluirWeb = confirm("¿Deseas cotizar la parte Web?");
if (incluirWeb) {
  console.log("[FLUJO] Entrando a Módulo Web...");
  const web = ejecutarModuloWeb();
  if (web) totalGeneral += web.total;
} else {
  console.log("[FLUJO] Se omitió la sección Web.");
}

console.log("=========== RESUMEN ==========");
console.log(`TOTAL ESTIMADO DEL PROYECTO: $${totalGeneral}`);
console.log("==============================\n");
alert(`TOTAL ESTIMADO DEL PROYECTO: $${totalGeneral}`);
