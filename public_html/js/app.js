//
function cargarArchivo(tagSelector, archivo) {
    const elemento = document.querySelector(tagSelector);
    if (!elemento) return;
    fetch(archivo)
        .then(rpta => rpta.text())
        .then(html => {
            elemento.innerHTML = html;
            if (archivo === "carrito.html") {
                mostrarProductosEnCarrito();
            }
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
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorHeader();
    alert("¡Añadido al carrito!");
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
                <div class="producto-card" style="display:flex; justify-content:space-between; align-items:center; background:white; padding:20px; border-radius:15px; margin-bottom:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                    <div>
                        <h3 style="margin:0;">${p.nombre}</h3>
                        <p class="precio" style="margin:5px 0; color:#e67e22; font-weight:bold;">${p.precio}</p>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})" style="background:#e74c3c; color:white; border:none; padding:10px 20px; border-radius:20px; cursor:pointer;">Eliminar</button>
                </div>`;
        });

        listaCarrito.innerHTML += `
            <div class="formulario-pago" style="background:white; padding:25px; border-radius:15px; margin-top:20px;">
                <h3 style="text-align:center;">Total a pagar: S/ ${total.toFixed(2)}</h3>
                <input type="text" placeholder="Nombres y Apellidos" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">
                <input type="text" placeholder="Número de Tarjeta" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">
                <input type="text" placeholder="Dirección de entrega" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">
                <button onclick="procesarPago()" style="width:100%; padding:15px; background:#27ae60; color:white; border:none; border-radius:5px; margin-top:10px; cursor:pointer; font-weight:bold;">Confirmar Pedido</button>
            </div>`;
    }
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    

    actualizarContadorHeader();
    mostrarProductosEnCarrito();
}

function procesarPago() {
    alert("¡Pago procesado con éxito!");
    localStorage.clear();
    location.reload();
}