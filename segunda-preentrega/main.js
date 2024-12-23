

const Producto = function(nombre, precio, stock){
    this.nombre= nombre
    this.precio = precio
    this.stock = stock
}


let producto1  = new Producto("Whisky Johnnie Walker",65715,7)
let producto2  = new Producto("Gin Bombay Sapphire",36557,20)
let producto3  = new Producto("Vodka Sernova",8747,35)
let producto4  = new Producto("Ron Havan Club",18930,26)



let lista = [producto1,producto2,producto3,producto4]

function filtrarProducto(){
    let palabraClave = prompt("ingresa el producto que buscas")
    let resultado = lista.filter( (x)=> x.nombre.toUpperCase().includes(palabraClave) )

    if(resultado.length >0){
        console.table(resultado)
    }else{
        alert("no se encontro")
    }
}


function agregarProducto(){
let nombre= prompt("ingresa el nombre del producto")
let precio = prompt("ingresa el precio del producto")
let stock = prompt("ingresa el stock del producto")



if(isNaN(precio) || isNaN(stock) || nombre == ""){
    alert("por favor ingrese valores validos")
    return
}


let producto = new Producto (nombre,precio,stock)
lista.push(producto)
console.table(lista)
}