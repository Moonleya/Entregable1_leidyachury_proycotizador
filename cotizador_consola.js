// ======= CONSTANTES DE NEGOCIO (IGUALES A TU CÓDIGO) =======
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

const MARGEN = 0.25; // margen comercial
const STORAGE_KEY = "cotizacionesWideTech";

// ======= FUNCIONES DE NEGOCIO =======
function margenComercial(costo) {
  return Math.round(costo * MARGEN);
}

// cálculo WEB (reutilizado de tu código original)
function calcularWeb(q) {
  const items = [
    { nombre: "Módulos nuevos",             cantidad: q.moduloNuevo,         precio: PRECIOS_WEB.moduloNuevo },
    { nombre: "Ajustes de módulos",         cantidad: q.ajusteModulo,        precio: PRECIOS_WEB.ajusteModulo },
    { nombre: "Funcionalidades nuevas",     cantidad: q.funcionalidadNueva,  precio: PRECIOS_WEB.funcionalidadNueva },
    { nombre: "Ajustes de funcionalidades", cantidad: q.ajusteFuncionalidad, precio: PRECIOS_WEB.ajusteFuncionalidad },
    { nombre: "Configs Backoffice",         cantidad: q.configBackoffice,    precio: PRECIOS_WEB.configBackoffice },
    { nombre: "Reportes",                   cantidad: q.reporte,             precio: PRECIOS_WEB.reporte },
    { nombre: "Dashboards",                 cantidad: q.dashboard,           precio: PRECIOS_WEB.dashboard },
    { nombre: "Personalización dashboards", cantidad: q.personalizacionDash, precio: PRECIOS_WEB.personalizacionDash }
  ];

  let costoOperativo = 0;
  for (let i = 0; i < items.length; i++) {
    costoOperativo += items[i].cantidad * items[i].precio;
  }

  const costoComercial = margenComercial(costoOperativo);
  const total = costoOperativo + costoComercial;

  return { items, costoOperativo, costoComercial, total };
}

// ======= LECTURA DEL FORMULARIO =======
function leerProyectoDesdeForm() {
  const nombreProyecto = document.getElementById("nombreProyecto").value.trim();
  const fechaCotizacion = document.getElementById("fechaCotizacion").value;

  const componenteSel = document.querySelector('input[name="componente"]:checked');
  const idiomaSel = document.querySelector('input[name="idioma"]:checked');
  const estadoSel = document.querySelector('input[name="estado"]:checked');

  return {
    nombreProyecto,
    fechaCotizacion,
    componente: componenteSel ? componenteSel.value : "",
    idioma: idiomaSel ? idiomaSel.value : "",
    estado: estadoSel ? estadoSel.value : ""
  };
}

function leerWebDesdeForm() {
  const getInt = (id) => {
    const v = parseInt(document.getElementById(id).value, 10);
    return Number.isNaN(v) || v < 0 ? 0 : v;
  };

  return {
    moduloNuevo: getInt("web_moduloNuevo"),
    ajusteModulo: getInt("web_ajusteModulo"),
    funcionalidadNueva: getInt("web_funcionalidadNueva"),
    ajusteFuncionalidad: getInt("web_ajusteFuncionalidad"),
    configBackoffice: getInt("web_configBackoffice"),
    reporte: getInt("web_reporte"),
    dashboard: getInt("web_dashboard"),
    personalizacionDash: getInt("web_personalizacionDash")
  };
}

// ======= MOSTRAR RESULTADOS EN EL DOM =======
function formatearMoneda(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

function mostrarResumen(proyecto, webDetalle, totalGeneral) {
  // datos del proyecto
  document.getElementById("resNombre").textContent = proyecto.nombreProyecto;
  document.getElementById("resFecha").textContent = proyecto.fechaCotizacion;
  document.getElementById("resComponente").textContent = proyecto.componente;
  document.getElementById("resIdioma").textContent = proyecto.idioma;
  document.getElementById("resEstado").textContent = proyecto.estado;

  const msgEstado = document.getElementById("resMensajeEstado");
  if (proyecto.estado === "Idea") {
    msgEstado.textContent = "El proyecto aún está en fase de idea.";
  } else {
    msgEstado.textContent = "El proyecto ya tiene un avance definido.";
  }

  // totales web
  document.getElementById("resCostoOperativoWeb").textContent = formatearMoneda(webDetalle.costoOperativo);
  document.getElementById("resCostoComercialWeb").textContent = formatearMoneda(webDetalle.costoComercial);
  document.getElementById("resTotalWeb").textContent = formatearMoneda(webDetalle.total);

  // total general (por ahora solo WEB)
  document.getElementById("resTotalProyecto").textContent = formatearMoneda(totalGeneral);
}

// ======= LOCALSTORAGE =======
function obtenerCotizaciones() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function guardarCotizacion(proyecto, webDetalle, totalGeneral) {
  const lista = obtenerCotizaciones();
  const nueva = {
    id: Date.now(),
    proyecto,
    web: {
      costoOperativo: webDetalle.costoOperativo,
      costoComercial: webDetalle.costoComercial,
      total: webDetalle.total
    },
    totalGeneral
  };
  lista.push(nueva);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function renderHistorial() {
  const listaUl = document.getElementById("listaHistorial");
  listaUl.innerHTML = "";

  const cotizaciones = obtenerCotizaciones();
  if (cotizaciones.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay cotizaciones guardadas todavía.";
    listaUl.appendChild(li);
    return;
  }

  cotizaciones.forEach((coti) => {
    const li = document.createElement("li");
    const nombre = coti.proyecto.nombreProyecto || "Sin nombre";
    const fecha = coti.proyecto.fechaCotizacion || "Sin fecha";
    li.textContent = `${fecha} - ${nombre} - Total: ${formatearMoneda(coti.totalGeneral)}`;
    listaUl.appendChild(li);
  });
}

// ======= GESTIÓN DEL FORMULARIO (EVENTOS) =======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProyecto");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeGuardado = document.getElementById("mensajeGuardado");

  renderHistorial(); // cargamos historial al abrir página

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeError.textContent = "";
    mensajeGuardado.textContent = "";

    const proyecto = leerProyectoDesdeForm();
    const webDatos = leerWebDesdeForm();

    // Validación mínima
    if (!proyecto.nombreProyecto || !proyecto.fechaCotizacion) {
      mensajeError.textContent = "Por favor, completa al menos Nombre del Proyecto y Fecha de Cotización.";
      return;
    }

    // calcular web
    const webDetalle = calcularWeb(webDatos);
    const totalGeneral = webDetalle.total; // aquí luego podrías sumar App, Hardware, etc.

    // mostrar en el DOM
    mostrarResumen(proyecto, webDetalle, totalGeneral);

    // guardar en localStorage
    guardarCotizacion(proyecto, webDetalle, totalGeneral);
    renderHistorial();

    mensajeGuardado.textContent = "Cotización calculada y guardada correctamente.";
  });
});