let materiales = [];

fetch("./js/materiales.js")
    .then(response => response.json())
    .then(data => {
        materiales = data;
        cargarMateriales(materiales);
    })


const contenedorMateriales = document.querySelector("#contenedor-materiales");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".material-agregar");
const tot = document.querySelector("#tot");


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarMateriales(materialesElegidos) {

    contenedorMateriales.innerHTML = "";

    materialesElegidos.forEach(material => {

        const div = document.createElement("div");
        div.classList.add("material");
        div.innerHTML = `
            <img class="material-imagen" src="${material.imagen}" alt="${material.titulo}">
            <div class="material-detalles">
                <h3 class="material-titulo">${material.titulo}</h3>
                <p class="material-precio">$${material.precio}</p>
                <button class="material-agregar" id="${material.id}">Agregar</button>
            </div>
        `;

        contenedorMateriales.append(div);
    })

    actualizarBotonesAgregar();
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const materialCategoria = materiales.find(material => material.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = materialCategoria.categoria.nombre;
            const materialesBoton = materiales.filter(material => material.categoria.id === e.currentTarget.id);
            cargarMateriales(materialesBoton);
        } else {
            tituloPrincipal.innerText = "Todos los materiales";
            cargarMateriales(materiales);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".material-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let materialesEnCarrito;

let materialesEnCarritoLS = localStorage.getItem("materiales-en-carrito");

if (materialesEnCarritoLS) {
    materialesEnCarrito = JSON.parse(materialesEnCarritoLS);
    actualizarTot();
} else {
    materialesEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Agregado al carrito",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "green",
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
    const materialAgregado = materiales.find(material => material.id === idBoton);

    if(materialesEnCarrito.some(material => material.id === idBoton)) {
        const index = materialesEnCarrito.findIndex(material => material.id === idBoton);
        materialesEnCarrito[index].cantidad++;
    } else {
        materialAgregado.cantidad = 1;
        materialesEnCarrito.push(materialAgregado);
    }

    actualizarTot();

    localStorage.setItem("materiales-en-carrito", JSON.stringify(materialesEnCarrito));
}

function actualizarTot() {
    let nuevoTot = materialesEnCarrito.reduce((acc, material) => acc + material.cantidad, 0);
    tot.innerText = nuevoTot;
}