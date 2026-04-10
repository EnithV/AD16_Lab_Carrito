// Inicializo los contadores del carrito
let cantidadItems = 0;
let totalAcumulado = 0;

// Selecciono los elementos del DOM que voy a manipular
const listaCarrito = document.getElementById('lista-carrito');
const contador = document.getElementById('badge');
const totalSpan = document.getElementById('total');
const btnVaciar = document.getElementById('btn-vaciar');
const msgVacio = document.getElementById('msg-vacio');

// Formateo el precio con el símbolo $ y dos decimales usando toLocaleString
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CR', { minimumFractionDigits: 2 });
}

// Actualizo el contador del navbar con la cantidad actual
function actualizarContador() {
    contador.textContent = cantidadItems;
}

// Actualizo el total mostrado en el carrito
function actualizarTotal() {
    totalSpan.textContent = formatearPrecio(totalAcumulado);
}

// Verifico si el carrito está vacío para mostrar u ocultar el mensaje
// Uso querySelectorAll para buscar todos los items con clase carrito-item
function verificarCarritoVacio() {
    const items = document.querySelectorAll('#lista-carrito .carrito-item');
    if (items.length === 0) {
        msgVacio.style.display = 'flex';  // Muestro el mensaje
    } else {
        msgVacio.style.display = 'none';  // Oculta el mensaje
    }
}

// Elimino un item específico del carrito
// Recibe el elemento li y su precio para restarlo del total
function eliminarItem(liElement, precioItem) {
    liElement.remove();               // Elimino el li del DOM
    totalAcumulado -= precioItem;     // Resto el precio del total
    cantidadItems -= 1;               // Disminuyo el contador en 1
    
    // Evito valores negativos por si acaso
    if (totalAcumulado < 0) totalAcumulado = 0;
    if (cantidadItems < 0) cantidadItems = 0;
    
    actualizarTotal();      // Actualizo el total en pantalla
    actualizarContador();   // Actualizo el contador del navbar
    verificarCarritoVacio();  // Verifico si hay que mostrar el mensaje
}

// Agrego un producto al carrito creando un nuevo elemento en la lista
function agregarAlCarrito(nombre, precio) {
    const precioNum = parseFloat(precio);  // Convierto el precio a número
    
    // Creo un nuevo elemento li con createElement
    const li = document.createElement('li');
    li.className = 'carrito-item';
    
    // Uso innerHTML para poner el contenido del li
    li.innerHTML = `
        <div class="info-item">
            <span class="nombre-item">${nombre}</span>
            <span class="precio-item">${formatearPrecio(precioNum)}</span>
        </div>
        <button class="btn-eliminar">✖</button>
    `;
    
    // Selecciono el botón eliminar dentro del li
    const btnEliminar = li.querySelector('.btn-eliminar');
    // Le agrego el evento click para eliminar este item
    btnEliminar.addEventListener('click', () => {
        eliminarItem(li, precioNum);
    });
    
    // Si el mensaje de vacío está visible, lo oculto
    if (msgVacio.style.display !== 'none') {
        msgVacio.style.display = 'none';
    }
    
    // Agrego el nuevo li a la lista del carrito con appendChild
    listaCarrito.appendChild(li);
    
    // Actualizo los contadores
    cantidadItems += 1;
    totalAcumulado += precioNum;
    
    // Actualizo la interfaz
    actualizarContador();
    actualizarTotal();
    verificarCarritoVacio();
}

// Selecciono todos los botones de agregar con querySelectorAll
// y les asigno el evento click con forEach
function inicializarBotones() {
    const botones = document.querySelectorAll('.btn-agregar');
    
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Leo los atributos data-nombre y data-precio del botón con getAttribute
            const nombre = boton.getAttribute('data-nombre');
            const precio = boton.getAttribute('data-precio');
            
            // Si ambos datos existen, agrego el producto al carrito
            if (nombre && precio) {
                agregarAlCarrito(nombre, precio);
            }
        });
    });
}

// Vacío todo el carrito de una vez
function vaciarCarrito() {
    // Selecciono todos los items con querySelectorAll
    const items = document.querySelectorAll('#lista-carrito .carrito-item');
    // Recorro cada uno con forEach y lo elimino con remove()
    items.forEach(item => item.remove());
    
    // Reinicio los contadores
    totalAcumulado = 0;
    cantidadItems = 0;
    
    // Actualizo la interfaz
    actualizarTotal();
    actualizarContador();
    verificarCarritoVacio();
}

// Le asigno el evento click al botón de vaciar carrito
btnVaciar.addEventListener('click', vaciarCarrito);

// Cuando toda la página termina de cargar, ejecuto las funciones de inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarBotones();     // Activo los botones de agregar
    actualizarContador();     // Pongo el contador en 0
    actualizarTotal();        // Pongo el total en $0.00
    verificarCarritoVacio();  // Muestro el mensaje de carrito vacío
});