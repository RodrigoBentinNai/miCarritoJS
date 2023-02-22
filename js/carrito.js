let materialesEnCarrito = localStorage.getItem("materiales-en-carrito");
materialesEnCarrito = JSON.parse(materialesEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoMateriales = document.querySelector("#carrito-materiales");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-material-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarMaterialesCarrito() {
    if (materialesEnCarrito && materialesEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoMateriales.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoMateriales.innerHTML = "";
    
        materialesEnCarrito.forEach(material => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-material");
            div.innerHTML = `
                <img class="carrito-material-imagen" src="${material.imagen}" alt="${material.titulo}">
                <div class="carrito-material-titulo">
                    <small>Título</small>
                    <h3>${material.titulo}</h3>
                </div>
                <div class="carrito-material-cantidad">
                    <small>Cantidad</small>
                    <p>${material.cantidad}</p>
                </div>
                <div class="carrito-material-precio">
                    <small>Precio</small>
                    <p>$${material.precio}</p>
                </div>
                <div class="carrito-material-subtotal">
                    <small>Subtotal</small>
                    <p>$${material.precio * material.cantidad}</p>
                </div>
                <button class="carrito-material-eliminar" id="${material.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoMateriales.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoMateriales.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarMaterialesCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-material-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Eliminado del carrito",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "red",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "1.2rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = materialesEnCarrito.findIndex(material => material.id === idBoton);
    
    materialesEnCarrito.splice(index, 1);
    cargarMaterialesCarrito();

    localStorage.setItem("materiales-en-carrito", JSON.stringify(materialesEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${materialesEnCarrito.reduce((acc, material) => acc + material.cantidad, 0)} material.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            materialesEnCarrito.length = 0;
            localStorage.setItem("materiales-en-carrito", JSON.stringify(materialesEnCarrito));
            cargarMaterialesCarrito();
        }
    })
}


function actualizarTotal() {
    const totalCalculado = materialesEnCarrito.reduce((acc, material) => acc + (material.precio * material.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    materialesEnCarrito.length = 0;
    localStorage.setItem("materiales-en-carrito", JSON.stringify(materialesEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoMateriales.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}