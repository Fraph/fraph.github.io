let datosOriginales = [];
let datosFiltrados = [];
let paginaActual = 1;
const elementosPorPagina = 5;

async function cargarDatos() {
    const archivoJSON = document.getElementById('data-selector').value;
    try {
        const response = await fetch(archivoJSON);
        datosOriginales = await response.json();
        filtrarDatos(); // Aplica búsqueda al cargar
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

function filtrarDatos() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    datosFiltrados = datosOriginales.filter(item =>
        item.nombre.toLowerCase().includes(textoBusqueda) ||
        item.valor.toLowerCase().includes(textoBusqueda)
    );
    paginaActual = 1;
    mostrarPagina();
}

function mostrarPagina() {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const datosPagina = datosFiltrados.slice(inicio, fin);

    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';

    datosPagina.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${item.nombre}</td><td>${item.valor}</td>`;
        tbody.appendChild(fila);
    });

    actualizarControlesPaginacion();
}

function actualizarControlesPaginacion() {
    const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);
    const paginacionContainer = document.querySelector('.pagination');
    paginacionContainer.innerHTML = ''; // Limpiar controles

    // Botón Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => cambiarPagina(-1);
    paginacionContainer.appendChild(btnAnterior);

    // Botones numerados
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        if (i === paginaActual) {
            btnPagina.style.backgroundColor = '#8000ff';
            btnPagina.style.color = 'white';
        }
        btnPagina.onclick = () => {
            paginaActual = i;
            mostrarPagina();
        };
        paginacionContainer.appendChild(btnPagina);
    }

    // Botón Siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => cambiarPagina(1);
    paginacionContainer.appendChild(btnSiguiente);
}

function cambiarPagina(direccion) {
    paginaActual += direccion;
    mostrarPagina();
}

window.onload = cargarDatos;
