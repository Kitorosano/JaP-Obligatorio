let productosCarrito;
let currency = 'UYU';
let totalCarrito = 0;

/**TODO
 * CAMBIAR EL PASAR INDICES, POR USAR UN DATASET CON EL INDICE
 */

function toggleCurrency() {
	let divTotal = document.getElementById('precioTotal');
  
  if (currency == 'USD') {
		divTotal.innerHTML = `$${(totalCarrito / 40).toFixed(2).replace(/\./g, ',')}`;
	} else if(currency == 'UYU') {
		divTotal.innerHTML = `$${(totalCarrito).toFixed(2).replace(/\./g, ',')}`;
	}
}

function calcularTotal() {
	// CALCULAR EL TOTAL EN BASE A LOS SUBTOTALES DE LOS PRODUCTOS
	totalCarrito = 0;
  let subtotalesCarrito = document.getElementsByClassName('subtotal');
	for (let i = 0; i < subtotalesCarrito.length; i++) {
    let index = subtotalesCarrito[i].id.replace('subtotal','');
		let subtotalProducto = parseFloat(document.getElementById(`subtotal${index}`).innerHTML);
		if (productosCarrito[index].currency == 'USD') subtotalProducto *= 40;
		totalCarrito += subtotalProducto;
	}
  // MOSTRAR EL TOTAL DEPENDIENDO DE LA CURRENCY ELEGIDA
  toggleCurrency();
}

function calcularSubtotal(i) {
	elt = document.getElementById(`count${i}`);
	let precio = parseFloat(elt.dataset.unitCost);
	let cantidad = parseFloat(elt.innerHTML);

	let total = precio * cantidad;

	document.getElementById(`subtotal${i}`).innerHTML = total.toFixed(2).replace(/\./g, ',');
  productosCarrito[i].count = cantidad; //GUARDO LA CANTIDAD EN MI ARRAY DE CARRITO, PARA QUE CUANDO BORRE UN ELEMENTO Y VUELVA A MOSTRAR, CONSERVE LA CANTIDAD
	calcularTotal();
}


function mostrarInfoProducto() {
  if(!productosCarrito.length) return carritoVacio();
  
	htmlTexto = '';
	for (let i = 0; i < productosCarrito.length; i++) {
		const producto = productosCarrito[i];

		htmlTexto += `
    <div class="Cart_Items row justify-content-between align-items-center">
      <div class="Cart_Items__image-box col-12 col-sm-6 col-lg-3">
        <img src="${producto.src}" class="text-center" style="height: 120px;" />
      </div>
      <div class="Cart_Items__about col-12 col-sm-6 col-lg-4">
        <h1 class="Cart_Items__title">${producto.name}</h1>
        <h3 class="Cart_Items__subtitle">${producto.currency}$${ producto.unitCost }</h3>
      </div>
      <div class="Cart_Items__counter col-6 offset-md-1 col-md-4 offset-lg-0 col-lg-2 ">
        <div class="Cart_Items__btnCount" onclick="incrementarCantidad(${i})">+</div>
        <div class="Cart_Items__count" data-unit-cost="${producto.unitCost}" id="count${i}" onchange="calcularSubtotal(${i})">${producto.count}</div>
        <div class="Cart_Items__btnCount" onclick="decrementarCantidad(${i})">-</div>
      </div>
      <div class="Cart_Items__prices col-6 col-md-3 col-lg-3 text-right">
        <div class="Cart_Items__amount row justify-content-end mr-1">
          ${producto.currency}$
          <div class="subtotal" id="subtotal${i}">${(producto.unitCost * producto.count).toFixed(2)}</div>
        </div>
        <u onclick="borrarDelCarrito(${i})" class="Cart_Items__remove">Borrar</u>
      </div>
    </div>
    <br>
    `;
	}

	document.getElementById('listaCarrito').innerHTML = htmlTexto;
	document.getElementById(
		'cantidadTotal'
	).innerHTML = `(${productosCarrito.length} elementos)`;
	calcularTotal();
}

function borrarDelCarrito(index) {
	productosCarrito.splice(index, 1);
	mostrarInfoProducto();
}

function borrarCarrito() {
	productosCarrito = [];
	mostrarInfoProducto();
}


function carritoVacio(){
	document.getElementById('contenedor-carrito').innerHTML = `
    <div class="container">
      <h1>Carrito Vacio</h1>
      <button class="btn btn-secondary mt-2" onclick="location.href='./products.html'">Volver a productos</button>
    </div> 
  `;
}


document.addEventListener('DOMContentLoaded', function (e) {
	getJSONData(CART_INFO_URL_DESAFIANTE).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			productosCarrito = resultObj.data.articles;
			mostrarInfoProducto();
		}
	});

  /**RADIO DE CURRENCY */
	for(radio of document.getElementsByClassName('radio_currency')){
    radio.addEventListener('click', function(e){
      currency = e.target.dataset.value;
      toggleCurrency();
    })
  };
});


