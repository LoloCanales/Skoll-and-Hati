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
function nodo() {
	contadorNodos++;
	crearEsfera(contadorNodos);
	AddPEST(contadorNodos);
}

const ColourGroup = {
	"Básico": "#888888",
	"Intermedio": "#3399ff",
	"Importante": "#ff3333",
	"Especial": "#ffcc00"
};
const SizeGroup = {
	"Básico": 1,        // Tamaño por defecto
	"Intermedio": 3,    // Un poco más grande
	"Importante": 8,    // Bastante más grande
	"Especial": 12      // Muy grande
};

function crearEsfera(id) {
	const idNodo = `Nodo_${id}`;
	const nombreNodo = `Agente ${id}`;
	const grupoNodo = "Básico";
		
	//grupoNodo = (id % 3) + 1; // Alterna grupos (1, 2, 3)

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

function AddPEST(id) {
	const PEST = document.getElementById('PanelUsuario');
	const SelLinkA = document.getElementById('NodHA');
	const SelLinkB = document.getElementById('NodHB');
	if (PEST){
		PEST.innerHTML += `<div id="PESTNodo${id}" class="PESTNodo"></div>`;
		SelLinkA.innerHTML += `<option value="Nodo_${id}">Nodo_${id}</option>`;
		SelLinkB.innerHTML += `<option value="Nodo_${id}">Nodo_${id}</option>`;
	}
}

function AddLink() {
	const NodoJA = document.getElementById("NodHA").value;
	const NodoJB = document.getElementById("NodHB").value;
	datosGrafo.links.push({ source: NodoJA, target: NodoJB});
	// datosGrafo.nodes.push({id: idNodo, nombre: nombreNodo, grupo: grupoNodo});
	Grafo.graphData({nodes: [...datosGrafo.nodes], links: [...datosGrafo.links]});
}

function SHOWNodo(nodo) {
	const idNumero = nodo.id ? nodo.id.replace('Nodo_', '') : nodo;
	
	const PEST = document.getElementById(`PESTNodo${idNumero}`);
	PEST.style.transform = "translateX(100%)";
	txtPU(`<span class="sistema">Entorno 3D activo</span>`);
}



// 4. Inicialización segura cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('espacio-3d');
    
    if (contenedor) {
        Grafo = ForceGraph3D()(contenedor)
			.graphData(datosGrafo)
			.nodeLabel('nombre')
			.nodeOpacity(0.9)
			.nodeColor(nodo => ColourGroup[nodo.grupo] || "#ffffff")
			.nodeVal(nodo => SizeGroup[nodo.grupo] || 4)
			.linkDirectionalParticles(1)
			.linkDirectionalParticleSpeed(0.005)
			.linkDirectionalParticleWidth(2)
			.onNodeClick((nodo, evento) => {
				txtPU(`<span class="sistema">[🔍] <b>click:</b> ${nodo.nombre}</span>`);
				// 1. Zoom
				const distancia = 80;
				const hipotenusa = Math.hypot(nodo.x || 0, nodo.y || 0, nodo.z || 0) || 1;
				const distRatio = 1 + distancia / hipotenusa;
				Grafo.cameraPosition({ x: (nodo.x || 0) * distRatio, y: (nodo.y || 0) * distRatio, z: (nodo.z || 0) * distRatio }, nodo, 2000);
				// 2. Mover pestañas hacia la derecha
				SHOWNodo(nodo);
			})
	} else {
        console.error("No se encontró el contenedor #espacio-3d en el HTML");
    }
});
