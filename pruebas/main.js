document.addEventListener("DOMContentLoaded", () => {
    const Producto = function(id, imagen, nombre, precio, stock) {
        this.id = id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    };

    let producto1 = new Producto(1, './assets/Whisky/Red-label.jpeg', "Whisky Johnnie Walker Red label", 31586, 7);
    let producto2 = new Producto(2, './assets/Whisky/Jack-daniel.jpeg', "Whisky Jack Daniel's", 57900, 20);
    let producto3 = new Producto(3, './assets/Vodka/Absolut.jpeg', "Vodka Absolut", 11300, 35);
    let producto4 = new Producto(4, './assets/Vodka/Sky.jpeg', "Vodka Skyy", 9560, 37);
    let producto5 = new Producto(5, './assets/Vodka/Smirnoff.jpeg', "Vodka Smirnoff", 7999, 32);
    let producto6 = new Producto(6, './assets/Ron/Captain-morgan.jpeg', "Ron Capitan Morgan", 34900, 24);
    let producto7 = new Producto(7, './assets/Ron/Havana-club.jpeg', "Ron Havan Club", 12846, 30);
    let producto8 = new Producto(8, './assets/Ron/Santa-teresa.jpeg', "Ron Santa Teresa", 33688, 18);
    let producto9 = new Producto(9, './assets/Cerveza/Amstel.jpeg', "Cerveza Amstel", 3163, 70);
    let producto10 = new Producto(10, './assets/Cerveza/Budweiser.jpeg', "Cerveza Budwiser", 4092, 62);
    let producto11 = new Producto(11, './assets/Cerveza/Duff.jpeg', "Cerveza Duff", 5780, 15);
    let producto12 = new Producto(12, './assets/Cerveza/Heineken.jpeg', "Cerveza Heineken", 4329, 53);

    let productos = [producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8, producto9, producto10, producto11, producto12];

    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(productos));
    } else {
        productos = JSON.parse(localStorage.getItem("productos"));
    }

    for (const x of productos) {
        let contenedor = document.createElement("div");
        contenedor.classList.add("product-container"); // Clase para estilos
        contenedor.innerHTML = `
            <h3>ID: ${x.id}</h3>
            <h1>Producto: ${x.nombre}</h1>
            <img src="${x.imagen}" alt="${x.nombre}">
            <b>Precio: $${x.precio.toLocaleString()}</b>
            <b>Stock: ${x.stock}</b>
        `;
        document.body.appendChild(contenedor);
    }
});


function filtrarProducto() {
    Swal.fire({
        title: 'Ingresa el producto que deseas buscar',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Buscar',
        showLoaderOnConfirm: true,
        preConfirm: (palabraClave) => {
            palabraClave = palabraClave.trim().toUpperCase();
            let productos = JSON.parse(localStorage.getItem("productos")) || [];
            let resultado = productos.filter((producto) =>
                producto.nombre.toUpperCase().includes(palabraClave)
            );

            if (resultado.length > 0) {
                let htmlResultado = `
                    <table style="width:100%; text-align:left;">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Imagen</th>
                                <th>Precio</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resultado.map((producto) => `
                                <tr>
                                    <td>${producto.nombre}</td>
                                    <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width:50px; height:auto;"></td>
                                    <td>${producto.precio.toLocaleString()}</td>
                                    <td>${producto.stock}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

                Swal.fire({
                    title: 'Resultado de tu búsqueda',
                    html: htmlResultado,
                    confirmButtonText: 'Ok',
                });
            } else {
                Swal.fire({
                    title: 'No se encontraron coincidencias',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            }
        },
    });
}


function agregarProducto() {
    Swal.fire({
        title: 'Agregar Producto',
        html: `
            <label>Nombre:</label> <input id="nombre-input" class="swal2-input" type="text" autofocus>
            <label>Precio:</label><input id="precio-input" class="swal2-input" type="number" step="0.01">
            <label>Stock:</label><input id="stock-input" class="swal2-input" type="number" step="1">
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let nombre = document.getElementById("nombre-input").value.trim();
            let precio = parseFloat(document.getElementById("precio-input").value.trim());
            let stock = parseInt(document.getElementById("stock-input").value.trim());

            if (isNaN(precio) || isNaN(stock) || nombre === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingresa valores válidos.',
                });
                return;
            }

            let productos = JSON.parse(localStorage.getItem("productos")) || [];
            if (productos.some((producto) => producto.nombre.toUpperCase() === nombre.toUpperCase())) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'El producto ya existe en la lista.',
                });
                return;
            }

            let nuevoProducto = new Producto(
                Date.now(), // ID único
                './assets/default.jpg', // Imagen por defecto
                nombre,
                precio,
                stock
            );

            productos.push(nuevoProducto);
            localStorage.setItem("productos", JSON.stringify(productos));

            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: `Se agregó el producto "${nombre}" a la lista.`,
                timer: 3000,
            });

            console.table(productos);
        }
    });
}


let agregar = document.getElementById("agregar");
agregar.addEventListener("click", agregarProducto);

let filtrar = document.getElementById("filtrar");
filtrar.addEventListener("click", filtrarProducto);







