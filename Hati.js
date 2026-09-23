function inicio(){
	const portada = document.getElementById('Portada');
	portada.style.transform = "translateX(-100vw)";
	imprimirConsola(`<span class="sistema"> Entorno 3D activo (Modo Nativo JS)</span>`)
	}

const logMensajes = document.getElementById("log-mensajes");

function txtPU(texto){
}

function imprimirConsola(texto) {
	logMensajes.innerHTML += `<div class="log-entrada">${texto}</div>`;
	logMensajes.scrollTop = logMensajes.scrollHeight; // Hace scroll hacia abajo
	}




// 1. Preparamos el entorno 3D con físicas mejoradas
const datosGrafo = { nodes: [], links: [] };
const Grafo = ForceGraph3D()
(document.getElementById('espacio-3d'))
.graphData(datosGrafo)
.nodeLabel('nombre')
.nodeOpacity(0.9)
.nodeAutoColorBy('grupo')
.linkDirectionalParticles(1)        // Más partículas de luz simultáneas
.linkDirectionalParticleSpeed(0.005) // Velocidad del rayo
.linkDirectionalParticleWidth(2);   // Rayo más grueso y visible


// 2. Nos conectamos al cerebro en Python
const conexionLocal = new WebSocket("ws://localhost:8765");

conexionLocal.onopen = () => {
logMensajes.innerHTML = ""; // Limpiamos el mensaje de "esperando"
imprimirConsola(`<span class="sistema">✅ Conexión segura establecida (127.0.0.1)</span>`);
};


// 3. El cerebro del sistema visual: ¿Qué hacer al recibir un evento?
conexionLocal.onmessage = function(evento) {
	const datos = JSON.parse(evento.data);
	if (datos.accion === "nuevo_nodo") {
		imprimirConsola(`[+] <b>Nuevo Agente en red:</b> ${datos.nombre}`);
		datosGrafo.nodes.push({ id: datos.id, nombre: datos.nombre, grupo: datos.grupo });
		Grafo.graphData(datosGrafo);
    } 
	else if (datos.accion === "nueva_conexion") {
		imprimirConsola(`[⚡] <b>Enlace establecido:</b> ${datos.origen} ➔ ${datos.destino}`);
		datosGrafo.links.push({ source: datos.origen, target: datos.destino });
		Grafo.graphData(datosGrafo);
	}
// ¡NUEVO EVENTO! Para cuando integres IA real y los agentes hablen
	else if (datos.accion === "mensaje") {
		imprimirConsola(`🗣️ <span class="agente-nombre">${datos.emisor}:</span> ${datos.texto}`);
    }
};

