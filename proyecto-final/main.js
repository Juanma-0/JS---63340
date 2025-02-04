fetch('https://fakestoreapi.com/products')
    .then((response) => response.json())
    .then((json) => console.log(json));

    

document.addEventListener("DOMContentLoaded", () => {

    const Producto = function(id, imagen, nombre, precio, stock) {
        this.id = id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    };


    let productos = [
        new Producto(1, './assets/Whisky/Red-label.jpeg', "Whisky Johnnie Walker Red label", 31586, 7),
        new Producto(2, './assets/Whisky/Jack-daniel.jpeg', "Whisky Jack Daniel's", 57900, 20),
        new Producto(3, './assets/Vodka/Absolut.jpeg', "Vodka Absolut", 11300, 35),
        new Producto(4, './assets/Vodka/Sky.jpeg', "Vodka Skyy", 9560, 37),
        new Producto(5, './assets/Vodka/Smirnoff.jpeg', "Vodka Smirnoff", 7999, 32),
        new Producto(6, './assets/Ron/Captain-morgan.jpeg', "Ron Capitan Morgan", 34900, 24),
        new Producto(7, './assets/Ron/Havana-club.jpeg', "Ron Havan Club", 12846, 30),
        new Producto(8, './assets/Ron/Santa-teresa.jpeg', "Ron Santa Teresa", 33688, 18),
        new Producto(9, './assets/Cerveza/Amstel.jpeg', "Cerveza Amstel", 3163, 70),
        new Producto(10, './assets/Cerveza/Budweiser.jpeg', "Cerveza Budweiser", 4092, 62),
        new Producto(11, './assets/Cerveza/Duff.jpeg', "Cerveza Duff", 5780, 15),
        new Producto(12, './assets/Cerveza/Heineken.jpeg', "Cerveza Heineken", 4329, 53)
    ];

    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(productos));
    } else {
        productos = JSON.parse(localStorage.getItem("productos"));
    }


    function renderizarProductos(productos) {
        const contenedor = document.getElementById("contenedor-productos");
        contenedor.innerHTML = "";

        productos.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("product-container");
            productoDiv.innerHTML = `
                <h3>ID: ${producto.id}</h3>
                <h1>${producto.nombre}</h1>
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100px; height:auto;">
                <b>Precio: $${producto.precio.toLocaleString()}</b>
                <b>Stock: ${producto.stock}</b>
                <button class="comprar-btn" data-id="${producto.id}">Comprar</button>
            `;
            contenedor.appendChild(productoDiv);
        });
    }

    renderizarProductos(productos);


    document.getElementById("contenedor-productos").addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("comprar-btn")) {
            let productoId = parseInt(e.target.dataset.id);
            agregarAlCarrito(productoId);
        }
    });


    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function agregarAlCarrito(productoId) {
        let producto = productos.find((prod) => prod.id === productoId);

        if (producto.stock > 0) {
            let productoEnCarrito = carrito.find((prod) => prod.id === productoId);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            producto.stock--;
            localStorage.setItem("productos", JSON.stringify(productos));
            localStorage.setItem("carrito", JSON.stringify(carrito));

            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: `Se ha agregado "${producto.nombre}" al carrito.`,
            });

            renderizarProductos(productos);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No hay stock',
                text: `Lo sentimos, "${producto.nombre}" está agotado.`,
            });
        }
    }


    function mostrarCarrito() {
        if (carrito.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: 'No tienes productos en tu carrito.',
            });
            return;
        }

        let htmlCarrito = `
            <table style="width:100%; text-align:left;">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${carrito.map((producto) => `
                        <tr>
                            <td>${producto.nombre}</td>
                            <td>${producto.cantidad}</td>
                            <td>$${producto.precio.toLocaleString()}</td>
                            <td>$${(producto.precio * producto.cantidad).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <b>Total: $${carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toLocaleString()}</b>
        `;
        
        Swal.fire({
            title: 'Tu Carrito',
            html: htmlCarrito,
            confirmButtonText: 'Finalizar compra',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                finalizarCompra();
            }
        });
    }


    function finalizarCompra() {
        carrito.forEach((producto) => {
            let productoEnStock = productos.find((prod) => prod.id === producto.id);
            productoEnStock.stock -= producto.cantidad;
        });

        localStorage.setItem("productos", JSON.stringify(productos));
        localStorage.removeItem("carrito");

        Swal.fire({
            icon: 'success',
            title: 'Compra realizada',
            text: '¡Gracias por tu compra!',
        });

        carrito = [];
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
                    Date.now(),
                    './assets/default.jpg',
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

                renderizarProductos(productos);
            }
        });
    }


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
                                    <th> </th>
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


    document.getElementById("agregar").addEventListener("click", agregarProducto);
    document.getElementById("filtrar").addEventListener("click", filtrarProducto);
    document.getElementById("limpiar-storage").addEventListener("click", () => {
        localStorage.clear();
        Swal.fire({
            icon: 'success',
            title: 'LocalStorage Limpio',
            text: 'El localStorage ha sido limpiado.',
        });
    });

    document.getElementById("ver-carrito").addEventListener("click", mostrarCarrito);

});