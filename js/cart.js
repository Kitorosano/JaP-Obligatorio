let productosCarrito;
let currency = 'UYU';
let toggleChange = false;

/**TODO
 * CAMBIAR EL PASAR INDICES, POR USAR UN DATASET CON EL INDICE
 */

function toggleCurrency(curr) {
	let total = document.getElementById('precioTotal');
  if(!toggleChange) return;
  
  if (curr == 'USD') {
		total.innerHTML = `$${(parseFloat(total.innerHTML.slice(1)) / 40).toFixed(2)}`
	} else {
		total.innerHTML = `$${(parseFloat(total.innerHTML.slice(1)) * 40).toFixed(2)}`
	}
}

function calcularTotal() {
	// CALCULAR Y MOSTRAR EL TOTAL
	let sumaTotal = 0;
  let subtotalesCarrito = document.getElementsByClassName('subtotal');
	for (let i = 0; i < subtotalesCarrito.length; i++) {
    let index = subtotalesCarrito[i].dataset.index;
    console.log(index)
		let toSum = parseFloat(document.getElementById(`subtotal${index}`).innerHTML);
		if (productosCarrito[index].currency == 'USD') toSum *= 40;
		sumaTotal += toSum;
	}
  if(currency == 'USD') sumaTotal/=40;
	document.getElementById('precioTotal').innerHTML = `$${sumaTotal.toFixed(2)}`.replace(/\./g, ',');
}

function countUp(i) {
	let cantidad = parseFloat(document.getElementById(`count${i}`).innerText);
	document.getElementById(`count${i}`).innerText = cantidad + 1;
	calcularSubtotal(i);
}
function countDown(i) {
	let cantidad = parseFloat(document.getElementById(`count${i}`).innerText);
	if (cantidad > 1)
		document.getElementById(`count${i}`).innerText = cantidad - 1;
	calcularSubtotal(i);
}

function calcularSubtotal(i) {
	elt = document.getElementById(`count${i}`);
	let precio = parseFloat(elt.dataset.unitCost);
	let cantidad = parseFloat(elt.innerHTML);

	let total = precio * cantidad;

	document.getElementById(`subtotal${i}`).innerHTML = total.toFixed(2);
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

function mostrarInfoProducto() {
	htmlTexto = '';

	for (let i = 0; i < productosCarrito.length; i++) {
		const producto = productosCarrito[i];

		htmlTexto += `
    <div class="Cart_Items">
      <div class="Cart_Items__image-box col-3">
        <img src="${producto.src}" class="text-center" style="height: 120px;" />
      </div>
      <div class="Cart_Items__about col-4">
        <h1 class="Cart_Items__title">${producto.name}</h1>
        <h3 class="Cart_Items__subtitle">${producto.currency}$${
			producto.unitCost
		}</h3>
      </div>
      <div class="Cart_Items__counter col-2">
        <div class="Cart_Items__btnCount" onclick="countUp(${i})">+</div>
        <div class="Cart_Items__count" data-unit-cost="${producto.unitCost}" id="count${i}" onchange="calcularSubtotal(${i})">${
			producto.count
		}</div>
        <div class="Cart_Items__btnCount" onclick="countDown(${i})">-</div>
      </div>
      <div class="Cart_Items__prices col-3 text-right">
        <div class="Cart_Items__amount row justify-content-end mr-1">
          ${producto.currency}$
          <div data-index="${i}" class="subtotal" id="subtotal${i}">${(producto.unitCost * producto.count).toFixed(2)}</div>
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

document.addEventListener('DOMContentLoaded', function (e) {
	getJSONData(CART_INFO_URL_DESAFIANTE).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			productosCarrito = resultObj.data.articles;
			console.log(productosCarrito);
			mostrarInfoProducto();
		}
	});

	document.getElementById('toggleUSD').addEventListener('click', () => {
    toggleChange = (currency === 'UYU');
		currency = 'USD';
		toggleCurrency(currency);
	});

	document.getElementById('toggleUYU').addEventListener('click', () => {
    toggleChange = (currency === 'USD');
		currency = 'UYU';
		toggleCurrency(currency);
	});
});
