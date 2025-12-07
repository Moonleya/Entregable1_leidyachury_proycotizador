// Tarifas base
const TARIFA_WEB_MODULO = 300;
const TARIFA_WEB_AJUSTE = 150;
const TARIFA_APP_PANTALLA = 250;
const TARIFA_APP_AJUSTE = 120;
const TARIFA_HW_HOMOLOGACION = 500;
const TARIFA_HW_AJUSTE = 200;

const STORAGE_KEY = "cotizacionesWideTech";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cotizador-form");
  if (!form) {
    // Si este log aparece en consola, es porque el id del form no coincide
    return;
  }

  renderHistorial();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const datos = leerDatosFormulario();
    const costos = calcularCostos(datos);

    mostrarResultados(costos);
    guardarCotizacion(datos, costos);
    renderHistorial();

    const mensaje = document.getElementById("mensajeGuardado");
    if (mensaje) {
      mensaje.textContent = "Cotización guardada correctamente.";
      setTimeout(() => (mensaje.textContent = ""), 3000);
    }
  });
});

// ---------- Lectura de formulario ----------
function leerDatosFormulario() {
  const getNumber = (id) =>
    parseInt(document.getElementById(id).value) || 0;

  return {
    nombreProyecto: document.getElementById("nombreProyecto").value.trim(),
    fecha: document.getElementById("fecha").value,
    webModulosNuevos: getNumber("webModulosNuevos"),
    webAjustesActuales: getNumber("webAjustesActuales"),
    appPantallasNuevas: getNumber("appPantallasNuevas"),
    appAjustes: getNumber("appAjustes"),
    hardwareHomologaciones: getNumber("hardwareHomologaciones"),
    hardwareAjustes: getNumber("hardwareAjustes"),
  };
}

// ---------- Cálculos ----------
function calcularCostos(d) {
  const totalWeb =
    d.webModulosNuevos * TARIFA_WEB_MODULO +
    d.webAjustesActuales * TARIFA_WEB_AJUSTE;

  const totalApp =
    d.appPantallasNuevas * TARIFA_APP_PANTALLA +
    d.appAjustes * TARIFA_APP_AJUSTE;

  const totalHardware =
    d.hardwareHomologaciones * TARIFA_HW_HOMOLOGACION +
    d.hardwareAjustes * TARIFA_HW_AJUSTE;

  const totalProyecto = totalWeb + totalApp + totalHardware;

  return { totalWeb, totalApp, totalHardware, totalProyecto };
}

// ---------- DOM (mostrar resultados) ----------
function formatearMoneda(v) {
  return "$ " + v.toLocaleString("es-CO");
}

function mostrarResultados(c) {
  document.getElementById("totalWeb").textContent = formatearMoneda(c.totalWeb);
  document.getElementById("totalApp").textContent = formatearMoneda(c.totalApp);
  document.getElementById("totalHardware").textContent = formatearMoneda(c.totalHardware);
  document.getElementById("totalProyecto").textContent = formatearMoneda(c.totalProyecto);
}

// ---------- LocalStorage ----------
function obtenerCotizacionesGuardadas() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function guardarCotizacion(datos, costos) {
  const lista = obtenerCotizacionesGuardadas();
  lista.push({
    id: Date.now(),
    nombreProyecto: datos.nombreProyecto,
    fecha: datos.fecha,
    costos,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function renderHistorial() {
  const ul = document.getElementById("historial-list");
  if (!ul) return;

  ul.innerHTML = "";
  const lista = obtenerCotizacionesGuardadas();

  if (lista.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay cotizaciones guardadas aún.";
    ul.appendChild(li);
    return;
  }

  lista.forEach((item) => {
    const li = document.createElement("li");
    li.textContent =
      `${item.fecha || "Sin fecha"} - ${item.nombreProyecto || "Sin nombre"} - ` +
      `Total: ${formatearMoneda(item.costos.totalProyecto)}`;
    ul.appendChild(li);
  });
}