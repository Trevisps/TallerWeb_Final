function cargarArchivo(tagSelector, archivo) {
    const elemento = document.querySelector(tagSelector);
    if (!elemento) return;
    fetch(archivo)
        .then(rpta => rpta.text())
        .then(html => {
            elemento.innerHTML = html;
            if (archivo === "carrito.html") mostrarProductosEnCarrito();
            if (archivo === "menu.html") renderizarMenu(); // <--- ESTO ES LO NUEVO
        });
}


document.addEventListener('DOMContentLoaded', () => {
    fetch("header.html")
            .then(rpta => rpta.text())
            .then(html => {
                document.querySelector("header").innerHTML = html;
                cargarArchivo("#main", "inicio.html");
                cargarArchivo("#footer", "footer.html");
                actualizarContadorHeader();

                document.querySelector("nav ul").addEventListener("click", (e) => {
                    const link = e.target.closest("a");
                    if (link && link.dataset.page) {
                        cargarArchivo("#main", link.dataset.page);
                        document.getElementById("menuAntojoWeb").checked = false;
                    }
                });
            });

// frenar recarga de formularios de sugerencias y reclamos)
document.body.addEventListener('submit', (e) => {
    e.preventDefault(); // evita el pantallazo blanco
    mostrarNotificacion("¡Enviado con éxito! 🚀");
    e.target.reset(); // limpia los campos de texto
});

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const card = e.target.closest('.producto-card');
            const nombre = card.querySelector('h3').innerText;
            const precio = card.querySelector('.precio').innerText;
            agregarAlCarrito(nombre, precio);
        }
    });
});


function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({nombre, precio});
    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContadorHeader();

    const btnCarrito = document.querySelector('.btn-carrito');
    if (btnCarrito) {
        btnCarrito.classList.add('carrito-animado');
        setTimeout(() => btnCarrito.classList.remove('carrito-animado'), 300);
    }

    // llamamos a la funcion maestra
    mostrarNotificacion("¡Añadido al carrito con éxito! 🍔");
}

function actualizarContadorHeader() {
    const contador = document.getElementById('contador');
    if (contador) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        contador.innerText = carrito.length;
    }
}

function mostrarProductosEnCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    if (!listaCarrito) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p style='text-align:center;'>Tu carrito está vacío.</p>";
    } else {
        listaCarrito.innerHTML = "";
        carrito.forEach((p, index) => {
            const precioNum = parseFloat(p.precio.replace('S/ ', ''));
            total += precioNum;
            listaCarrito.innerHTML += `
                <div class="producto-card" style="display:flex; justify-content:space-between; align-items:center; padding:20px; border-radius:15px; margin-bottom:15px; background: rgba(20,20,20,0.8); border: 1px solid #ff9f43;">
                    <div>
                        <h3 style="margin:0; color:#ff9f43;">${p.nombre}</h3>
                        <p class="precio" style="margin:5px 0; color:#fff; font-weight:bold;">${p.precio}</p>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </div>`;
        });

        listaCarrito.innerHTML += `
            <div style="text-align:center; margin-top: 30px;">
                <h3 style="margin-bottom:15px; font-size: 1.5em; color: #ff9f43;">Total: S/ ${total.toFixed(2)}</h3>
                <button onclick="abrirModalPago()" class="btn-confirmar-pedido">Proceder al Pago</button>
            </div>
            <div id="modal-pago" class="modal-overlay">
                <div class="modal-contenido">
                    <h2>Detalles de Pago</h2>
                    <h3>Total: S/ ${total.toFixed(2)}</h3>
                    <input type="text" placeholder="Nombres y Apellidos">
                    <input type="text" placeholder="Número de Tarjeta">
                    <button onclick="procesarPago()" class="btn-confirmar-pedido">Confirmar Pedido</button>
                    <button onclick="cerrarModalPago()" class="btn-cerrar-modal">Cancelar</button>
                </div>
            </div>
        `;
    }
}

// funciones para controlar el modal
function abrirModalPago() {
    const modal = document.getElementById('modal-pago');
    if (modal)
        modal.classList.add('activo');
}

function cerrarModalPago() {
    const modal = document.getElementById('modal-pago');
    if (modal)
        modal.classList.remove('activo');
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));


    actualizarContadorHeader();
    mostrarProductosEnCarrito();
}

function procesarPago() {
    // ocultamos el modal de pago
    cerrarModalPago();

    // mostramos el mensaje de exito
    mostrarNotificacion("¡Pago procesado con éxito! 🛵");

    // esperamos 2.5 segundos para que el usuario lea el mensaje antes de recargar
    setTimeout(() => {
        localStorage.removeItem('carrito'); // mejor que el clear
        location.reload();
    }, 2500);
}

function mostrarNotificacion(mensaje) {
    const toast = document.getElementById("toast-notificacion");
    if (toast) {
        toast.innerText = mensaje; // cambia el texto dinamicamente
        toast.classList.add("mostrar");
        setTimeout(() => toast.classList.remove("mostrar"), 2500);
    }
}

const inventario = {
    hamburguesas: [
        { nombre: "Burger Clásica", precio: "S/ 18.00", img: "imagen/burger clasica.jpg", desc: "Carne de res, lechuga, tomate, salsa especial" },
        { nombre: "Doble BBQ", precio: "S/ 24.00", img: "imagen/doble bbq.jpeg", desc: "Doble carne, bacon crujiente, salsa BBQ" },
        { nombre: "Veggie Burger", precio: "S/ 20.00", img: "imagen/veggie burger.jpeg", desc: "Frijoles negros, cebolla, lechuga, tomate, mayonesa" },
        { nombre: "Hamburguesa Picante", precio: "S/ 22.00", img: "imagen/hamburgesa picante.jpeg", desc: "Carne de res, jalapeños, salsa picante" }
    ],
    pizza: [
        { nombre: "Pizza Americana", precio: "S/ 36.00", img: "imagen/pizza americana.jpg", desc: "Pepperoni, carne, salsa de tomate, queso" },
        { nombre: "Pizza Hawaiana", precio: "S/ 40.00", img: "imagen/pizza hawayana.jpg", desc: "Carne, queso, piña, salsa de tomate" },
        { nombre: "Pizza Alemana", precio: "S/ 45.00", img: "imagen/pizza alemana.jpg", desc: "Chorizo, pepperoni, tomate, queso" },
        { nombre: "Pizza Brava", precio: "S/ 22.00", img: "imagen/pizza brava.jpeg", desc: "Carne de res, jalapeños, salsa picante" }
    ],
    ensalada: [
        { nombre: "Ensalada César", precio: "S/ 23.00", img: "imagen/ensalada cesar.jpeg", desc: "Lechuga, pollo, queso parmesano, crutones" },
        { nombre: "Ensalada Griega", precio: "S/ 20.00", img: "imagen/ensalada griega.jpeg", desc: "Lechuga, tomate, pepino, aceitunas" },
        { nombre: "Ensalada Andina", precio: "S/ 18.00", img: "imagen/ensalada andina.jpeg", desc: "Quinua, lechuga, choclo, zanahoria" },
        { nombre: "Ensalada Tropical", precio: "S/ 22.00", img: "imagen/ensalada tropical.jpg", desc: "Lechuga, piña, queso, pecanas, pollo" }
    ],
    bebidas: [
        { nombre: "Limonada de Hierbaluisa", precio: "S/ 12.00", img: "imagen/limonada de hirvaluisa.jpeg", desc: "Limón, hierbaluisa, azúcar, agua mineral" },
        { nombre: "Fresa Frozen", precio: "S/ 15.00", img: "imagen/fresa frosen.jpeg", desc: "Fresa, leche evaporada, azúcar, hielo" },
        { nombre: "Refresco de Frutos Rojos", precio: "S/ 18.00", img: "imagen/frutos rojos.jpeg", desc: "Fresa, arándanos, frambuesa, agua mineral" },
        { nombre: "Smoothie Tropical", precio: "S/ 20.00", img: "imagen/smoothi tropical.jpeg", desc: "Mango, piña, yogurt, miel, hielo" }
    ],
    combos: [
        { nombre: "Rey Parrillero", precio: "S/ 47.90", img: "imagen/rey parrillero.jpeg", desc: "Burger Clásica + Pizza Americana + Ensalada César + Limonada" },
        { nombre: "Fuego Supremo", precio: "S/ 51.90", img: "imagen/fuego supremo.jpeg", desc: "Hamburguesa Picante + Pizza Brava + Refresco de Frutos Rojos" },
        { nombre: "Mega Cheese BBQ", precio: "S/ 76.90", img: "imagen/mega cheese.jpeg", desc: "Doble BBQ + Pizza Alemana + Ensalada Griega + Fresa Frozen" },
        { nombre: "Sabor Tropical", precio: "S/ 20.00", img: "imagen/sabor tropical.jpeg", desc: "Veggie Burger + Pizza Hawaiana + Ensalada Tropical + Smoothie" }
    ]
};

function renderizarMenu() {
    for (const categoria in inventario) {
        const contenedor = document.getElementById(`grid-${categoria}`);
        if (!contenedor) continue;

        contenedor.innerHTML = inventario[categoria].map(item => `
            <div class="producto-card">
                <div class="producto-info">
                    <h3>${item.nombre}</h3>
                    <p>${item.desc}</p>
                    <span class="precio">${item.precio}</span>
                </div>
                <img src="${item.img}" alt="${item.nombre}"/>
                <button class="btn-agregar">Agregar</button>
            </div>
        `).join('');
    }
}