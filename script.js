// =========================================================
// Datos del ejemplo (Tarea 3): aires acondicionados
// =========================================================

// Lista de criterios (atributos) que se van a evaluar
// tipo: "beneficio" = mayor es mejor, "costo" = menor es mejor
var criterios = [
  { clave: "precio",   nombre: "Precio",                unidad: "USD",  tipo: "costo",    peso: 0.25 },
  { clave: "btu",      nombre: "Capacidad (BTU)",        unidad: "BTU",  tipo: "beneficio", peso: 0.20 },
  { clave: "seer",     nombre: "Eficiencia (SEER)",      unidad: "",     tipo: "beneficio", peso: 0.20 },
  { clave: "ruido",    nombre: "Nivel de ruido",         unidad: "dB",   tipo: "costo",    peso: 0.15 },
  { clave: "garantia", nombre: "Garantia del compresor", unidad: "anios",tipo: "beneficio", peso: 0.10 },
  { clave: "control",  nombre: "Funciones inteligentes", unidad: "/10",  tipo: "beneficio", peso: 0.10 }
];

// Lista de productos (alternativas), tomada del ejemplo de la tarea 3
// "imagen" guarda la RUTA o URL de la foto de cada equipo (ver notas al final del archivo)
var productos = [
  { id: "A1", nombre: "A1 - LG Dual Inverter 12000 BTU",   imagen: "img/A1.jpg", precio: 450, btu: 12000, seer: 20, ruido: 19, garantia: 10, control: 9 },
  { id: "A2", nombre: "A2 - Samsung WindFree 12000 BTU",   imagen: "img/A2.jpg", precio: 500, btu: 12000, seer: 21, ruido: 20, garantia: 7,  control: 9 },
  { id: "A3", nombre: "A3 - Midea Xtreme Save 12000 BTU",  imagen: "img/A3.jpg", precio: 380, btu: 12000, seer: 18, ruido: 22, garantia: 5,  control: 6 },
  { id: "A4", nombre: "A4 - Carrier 18000 BTU",            imagen: "img/A4.jpg", precio: 600, btu: 18000, seer: 16, ruido: 24, garantia: 5,  control: 5 },
  { id: "A5", nombre: "A5 - Daikin Inverter 12000 BTU",    imagen: "img/A5.jpg", precio: 550, btu: 12000, seer: 22, ruido: 18, garantia: 10, control: 8 },
  { id: "A6", nombre: "A6 - Hisense 9000 BTU (economico)", imagen: "img/A6.jpg", precio: 300, btu: 9000,  seer: 15, ruido: 26, garantia: 3,  control: 4 },
  { id: "A7", nombre: "A7 - Mirage 24000 BTU (semi-ind)",  imagen: "img/A7.jpg", precio: 750, btu: 24000, seer: 14, ruido: 30, garantia: 5,  control: 5 },
  { id: "A8", nombre: "A8 - Panasonic Inverter Nanoe",     imagen: "img/A8.jpg", precio: 520, btu: 12000, seer: 19, ruido: 21, garantia: 8,  control: 7 }
];

// Imagen que se usa cuando un producto no tiene foto propia o la ruta no existe todavia
var IMAGEN_GENERICA = "img/generico.png";

// contador para poner id a los productos nuevos que agregue el usuario
var contadorNuevos = 0;

// =========================================================
// Parte 1: tabla de pesos
// =========================================================

function pintarTablaPesos() {
  var tabla = document.getElementById("tablaPesos");

  // borrar filas viejas (menos el encabezado, que es la fila 0)
  while (tabla.rows.length > 1) {
    tabla.deleteRow(1);
  }

  for (var i = 0; i < criterios.length; i++) {
    var c = criterios[i];
    var fila = tabla.insertRow();

    var celdaNombre = fila.insertCell();
    celdaNombre.innerHTML = c.nombre;

    var celdaTipo = fila.insertCell();
    celdaTipo.innerHTML = (c.tipo === "costo") ? "Costo (menor mejor)" : "Beneficio (mayor mejor)";

    var celdaPeso = fila.insertCell();
    celdaPeso.innerHTML =
      '<input type="number" min="0" max="1" step="0.01" value="' + c.peso + '" data-clave="' + c.clave + '" class="input-peso">';
  }

  // agregar el evento a cada input de peso
  var inputsPeso = document.querySelectorAll(".input-peso");
  for (var j = 0; j < inputsPeso.length; j++) {
    inputsPeso[j].addEventListener("input", actualizarSumaPesos);
  }

  actualizarSumaPesos();
}

// lee los pesos que estan escritos en la tabla y los guarda en el arreglo "criterios"
function leerPesosDesdeTabla() {
  var inputsPeso = document.querySelectorAll(".input-peso");
  for (var i = 0; i < inputsPeso.length; i++) {
    var clave = inputsPeso[i].getAttribute("data-clave");
    var valor = parseFloat(inputsPeso[i].value);
    if (isNaN(valor)) valor = 0;

    for (var j = 0; j < criterios.length; j++) {
      if (criterios[j].clave === clave) {
        criterios[j].peso = valor;
      }
    }
  }
}

function actualizarSumaPesos() {
  leerPesosDesdeTabla();
  var suma = 0;
  for (var i = 0; i < criterios.length; i++) {
    suma = suma + criterios[i].peso;
  }
  document.getElementById("sumaPesos").innerHTML = suma.toFixed(2);
}

// =========================================================
// Parte 2: mostrar productos
// =========================================================

function pintarProductos() {
  var contenedor = document.getElementById("listaProductos");

  var html = '<table border="1" cellpadding="6"><tr><th>Producto</th>';
  for (var i = 0; i < criterios.length; i++) {
    html += "<th>" + criterios[i].nombre + "</th>";
  }
  html += "<th></th></tr>";

  for (var p = 0; p < productos.length; p++) {
    var prod = productos[p];
    var rutaImagen = prod.imagen ? prod.imagen : IMAGEN_GENERICA;
    html += '<tr class="fila-producto">';
    html += '<td>' + prod.nombre +
      '<br><img class="foto-producto" src="' + rutaImagen + '" alt="' + prod.nombre + '" onerror="this.src=\'' + IMAGEN_GENERICA + '\'"></td>';
    for (var k = 0; k < criterios.length; k++) {
      var c = criterios[k];
      html += "<td>" + prod[c.clave] + " " + c.unidad + "</td>";
    }
    html += '<td><button class="btn-eliminar" data-id="' + prod.id + '">Quitar</button></td>';
    html += "</tr>";
  }
  html += "</table>";

  contenedor.innerHTML = html;

  // botones de quitar producto
  var botonesQuitar = document.querySelectorAll(".btn-eliminar");
  for (var b = 0; b < botonesQuitar.length; b++) {
    botonesQuitar[b].addEventListener("click", function () {
      var idAQuitar = this.getAttribute("data-id");
      eliminarProducto(idAQuitar);
    });
  }
}

function eliminarProducto(id) {
  var nuevaLista = [];
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id !== id) {
      nuevaLista.push(productos[i]);
    }
  }
  productos = nuevaLista;
  pintarProductos();
}

// =========================================================
// Parte 3: formulario para agregar un producto nuevo
// =========================================================

function pintarFormularioNuevoProducto() {
  var tabla = document.getElementById("tablaFormulario");
  var html = "";

  html += "<tr><td>Nombre del producto</td><td><input type='text' id='campo-nombre'></td></tr>";
  html += "<tr><td>Imagen (URL o ruta, ej. img/A9.jpg)</td><td><input type='text' id='campo-imagen' placeholder='img/nombre.jpg'></td></tr>";

  for (var i = 0; i < criterios.length; i++) {
    var c = criterios[i];
    html += "<tr><td>" + c.nombre + " (" + c.unidad + ")</td>";
    html += "<td><input type='number' step='any' id='campo-" + c.clave + "'></td></tr>";
  }

  tabla.innerHTML = html;
}

function guardarNuevoProducto() {
  var nombre = document.getElementById("campo-nombre").value.trim();
  var imagen = document.getElementById("campo-imagen").value.trim();
  var datosNuevos = { nombre: nombre, imagen: imagen.length > 0 ? imagen : IMAGEN_GENERICA };
  var todoValido = nombre.length > 0;

  for (var i = 0; i < criterios.length; i++) {
    var clave = criterios[i].clave;
    var valor = parseFloat(document.getElementById("campo-" + clave).value);
    if (isNaN(valor)) {
      todoValido = false;
    }
    datosNuevos[clave] = valor;
  }

  if (!todoValido) {
    document.getElementById("mensajeError").style.display = "block";
    return;
  }

  document.getElementById("mensajeError").style.display = "none";

  contadorNuevos = contadorNuevos + 1;
  datosNuevos.id = "N" + contadorNuevos;
  productos.push(datosNuevos);

  pintarProductos();
  document.getElementById("formNuevoProducto").style.display = "none";
}

// =========================================================
// Parte 4: metodo SAW
// =========================================================

function calcularSAW() {
  leerPesosDesdeTabla();

  // 1. buscar el maximo y el minimo de cada criterio
  var maximos = {};
  var minimos = {};

  for (var i = 0; i < criterios.length; i++) {
    var clave = criterios[i].clave;
    var valores = [];
    for (var p = 0; p < productos.length; p++) {
      valores.push(productos[p][clave]);
    }
    maximos[clave] = Math.max.apply(null, valores);
    minimos[clave] = Math.min.apply(null, valores);
  }

  // 2. sacar la suma de los pesos, por si no da exactamente 1
  var sumaPesos = 0;
  for (var i2 = 0; i2 < criterios.length; i2++) {
    sumaPesos = sumaPesos + criterios[i2].peso;
  }
  if (sumaPesos === 0) sumaPesos = 1; // evitar division entre 0

  // 3. normalizar y calcular el puntaje de cada producto
  var resultados = [];

  for (var p2 = 0; p2 < productos.length; p2++) {
    var prod = productos[p2];
    var normalizado = {};
    var puntaje = 0;

    for (var c2 = 0; c2 < criterios.length; c2++) {
      var crit = criterios[c2];
      var pesoNormalizado = crit.peso / sumaPesos;
      var valorNorm;

      if (crit.tipo === "beneficio") {
        valorNorm = prod[crit.clave] / maximos[crit.clave];
      } else {
        valorNorm = minimos[crit.clave] / prod[crit.clave];
      }

      normalizado[crit.clave] = valorNorm;
      puntaje = puntaje + (valorNorm * pesoNormalizado);
    }

    resultados.push({
      id: prod.id,
      nombre: prod.nombre,
      datos: prod,
      normalizado: normalizado,
      puntaje: puntaje
    });
  }

  // 4. ordenar los criterios por peso, de mayor a menor (sirve para desempatar)
  var criteriosPorPeso = criterios.slice(); // copia del arreglo
  criteriosPorPeso.sort(function (a, b) {
    return b.peso - a.peso;
  });

  // 5. ordenar los resultados por puntaje (de mayor a menor)
  resultados.sort(function (a, b) {
    var diferencia = b.puntaje - a.puntaje;
    if (Math.abs(diferencia) > 0.000001) {
      return diferencia;
    }
    // si hay empate en el puntaje, se revisa el criterio con mas peso, luego el siguiente...
    for (var i3 = 0; i3 < criteriosPorPeso.length; i3++) {
      var clave3 = criteriosPorPeso[i3].clave;
      var dif2 = b.normalizado[clave3] - a.normalizado[clave3];
      if (Math.abs(dif2) > 0.000001) {
        return dif2;
      }
    }
    return 0; // empate total
  });

  // 6. asignar el numero de posicion (si hay empate total, se repite la posicion)
  for (var r = 0; r < resultados.length; r++) {
    if (r === 0) {
      resultados[r].puesto = 1;
      resultados[r].empatado = false;
      continue;
    }
    var anterior = resultados[r - 1];
    var actual = resultados[r];

    var mismoPuntaje = Math.abs(actual.puntaje - anterior.puntaje) < 0.000001;
    var mismoEnTodo = mismoPuntaje;

    if (mismoPuntaje) {
      for (var i4 = 0; i4 < criteriosPorPeso.length; i4++) {
        var clave4 = criteriosPorPeso[i4].clave;
        if (Math.abs(actual.normalizado[clave4] - anterior.normalizado[clave4]) > 0.000001) {
          mismoEnTodo = false;
          break;
        }
      }
    }

    if (mismoEnTodo) {
      actual.puesto = anterior.puesto;
      actual.empatado = true;
    } else {
      actual.puesto = r + 1;
      actual.empatado = false;
    }
  }

  // 7. respetar el orden que eligio el usuario (mejor a peor, o al reves)
  var orden = document.getElementById("ordenSelect").value;
  if (orden === "asc") {
    resultados.reverse();
  }

  return resultados;
}

function mostrarRanking() {
  var resultados = calcularSAW();
  var contenedor = document.getElementById("resultadoRanking");

  var html = "<table border='1' cellpadding='6'>";
  html += "<tr><th>Puesto</th><th>Producto</th>";
  for (var i = 0; i < criterios.length; i++) {
    html += "<th>" + criterios[i].nombre + "</th>";
  }
  html += "<th>Puntaje SAW</th></tr>";

  for (var r = 0; r < resultados.length; r++) {
    var res = resultados[r];
    var clasePuesto = "";
    if (res.puesto === 1) clasePuesto = "puesto-1";
    if (res.puesto === 2) clasePuesto = "puesto-2";
    if (res.puesto === 3) clasePuesto = "puesto-3";
    var rutaImagenRes = res.datos.imagen ? res.datos.imagen : IMAGEN_GENERICA;

    html += "<tr class='" + clasePuesto + "'>";
    html += "<td>" + res.puesto + (res.empatado ? " (empate)" : "") + "</td>";
    html += '<td>' + res.nombre +
      '<br><img class="foto-producto" src="' + rutaImagenRes + '" alt="' + res.nombre + '" onerror="this.src=\'' + IMAGEN_GENERICA + '\'"></td>';

    for (var c = 0; c < criterios.length; c++) {
      var clave = criterios[c].clave;
      html += "<td>" + res.datos[clave] + " " + criterios[c].unidad + "</td>";
    }

    html += "<td>" + res.puntaje.toFixed(4) + "</td>";
    html += "</tr>";
  }
  html += "</table>";

  contenedor.innerHTML = html;
}

// =========================================================
// Parte 5: conectar los botones cuando carga la pagina
// =========================================================

window.onload = function () {
  pintarTablaPesos();
  pintarProductos();
  pintarFormularioNuevoProducto();

  document.getElementById("btnCalcular").addEventListener("click", mostrarRanking);

  document.getElementById("btnMostrarForm").addEventListener("click", function () {
    var form = document.getElementById("formNuevoProducto");
    form.style.display = (form.style.display === "none") ? "block" : "none";
  });

  document.getElementById("btnGuardarProducto").addEventListener("click", guardarNuevoProducto);

  document.getElementById("btnCancelarProducto").addEventListener("click", function () {
    document.getElementById("formNuevoProducto").style.display = "none";
    pintarFormularioNuevoProducto();
    document.getElementById("mensajeError").style.display = "none";
  });

  document.getElementById("ordenSelect").addEventListener("change", function () {
    // si ya se habia calculado antes, se vuelve a mostrar con el nuevo orden
    var yaHayResultado = document.getElementById("resultadoRanking").innerHTML.indexOf("table") !== -1;
    if (yaHayResultado) {
      mostrarRanking();
    }
  });
};
