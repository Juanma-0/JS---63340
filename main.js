

let nombre = prompt("Ingrese su nombre")

function saludar(){
    alert ("hola " + nombre + ", esta es una calculadora de impuestos para comprar un auto ")
}

saludar()


const iva = 1.21
const ganancias = 1.2
const iibb = 1.1
const sellos = 1.03
const otros = 1.016


function calcularImpuesto (importe){
    if(parseFloat(importe)){
        if(importe>8400000){
            importe*ganancias
        }
        let resultado = importe*iva*iibb*sellos*otros
        alert("el importe más los impuestos es: "+ resultado)
    }
}

function calcularPrecioFinal(){
    let precioDelProducto = parseFloat(prompt("Ingrese el precio en pesos: "))
    calcularImpuesto(precioDelProducto)
}

calcularPrecioFinal()