// Datos globales
const datosGrafo = { nodes: [], links: [] };
let contadorNodos = 0;
let Grafo = null;

// Funciones de la interfaz
function inicio() {
	const portada = document.getElementById('Portada');
	portada.style.transform = "translateX(-100vw)";
	txtPU(`<span class="sistema">Entorno 3D activo</span>`);
}

function txtPU(texto) {
	const logMensajes = document.getElementById('DisplayPanel');
	if (logMensajes) {
		logMensajes.innerHTML += `<div class="log-entrada">${texto}</div>`;
		logMensajes.scrollTop = logMensajes.scrollHeight;
	}
}

// Nodos 3D
function crearEsfera() {
	contadorNodos++;
	const idNodo = `nodo_${contadorNodos}`;
	const nombreNodo = `Agente ${contadorNodos}`;
	const grupoNodo = (contadorNodos % 3) + 1; // Alterna grupos (1, 2, 3)

	// Insertar la nueva esfera al arreglo de datos
	datosGrafo.nodes.push({id: idNodo, nombre: nombreNodo, grupo: grupoNodo});

	// Si ya existe otra esfera, crea un enlace con la anterior
	if (datosGrafo.nodes.length > 1) {
		const idNodoAnterior = datosGrafo.nodes[datosGrafo.nodes.length - 2].id;
		datosGrafo.links.push({ source: idNodoAnterior, target: idNodo});
		txtPU(`<span class="sistema">[⚡] <b>Enlace establecido:</b> ${idNodoAnterior} ➔ ${idNodo}</span>`);
	}

	// Forzar el redibujado de la escena pasando referencias renovadas
	if (Grafo) {
		Grafo.graphData({nodes: [...datosGrafo.nodes], links: [...datosGrafo.links]});
	}
	txtPU(`<span class="sistema">[+] <b>Nueva esfera creada:</b> ${nombreNodo}</span>`);
}

// 4. Inicialización segura cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('espacio-3d');
    
    if (contenedor) {
        Grafo = ForceGraph3D()(contenedor)
            .graphData(datosGrafo)
            .nodeLabel('nombre')
            .nodeOpacity(0.9)
            .nodeAutoColorBy('grupo')
            .linkDirectionalParticles(1)
            .linkDirectionalParticleSpeed(0.005)
            .linkDirectionalParticleWidth(2);
    } else {
        console.error("No se encontró el contenedor #espacio-3d en el HTML");
    }
});
