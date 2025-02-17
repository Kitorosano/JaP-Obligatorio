// let COTIZACION DOLAR = 'https://cotizaciones-brou.herokuapp.com/api/currency/latest';
let productosCarrito;
let currentCurrency = 'UYU';
let tipoEnvio = 0.05;
let totalCarrito = 0;
let currentPayment,
	datosPayment = {},
	modalValidated = false;

function mostrarTotales() {
	let DIV_SUBTOTAL = document.getElementById('precioSubtotal'),
		DIV_ENVIO = document.getElementById('precioEnvio'),
		DIV_TOTAL = document.getElementById('precioTotal');

	DIV_SUBTOTAL.innerHTML = `$${totalCarrito.toFixed(2).replace(/\./g, ',')}`;
	DIV_ENVIO.innerHTML = `(${tipoEnvio}%)\t $${(totalCarrito * tipoEnvio)
		.toFixed(2)
		.replace(/\./g, ',')}`;
	DIV_TOTAL.innerHTML = `$${(totalCarrito * (1 + tipoEnvio))
		.toFixed(2)
		.replace(/\./g, ',')}`;
}

function convertToCurrentCurrency(prodSubtotal, prodCurrency) {
	if (currentCurrency == 'USD' && prodCurrency == 'UYU')
		return prodSubtotal / 40;
	if (currentCurrency == 'UYU' && prodCurrency == 'USD')
		return prodSubtotal * 40;
	if (!(prodSubtotal && prodCurrency)) return 0;
	return prodSubtotal;
}

function calcularTotal() {
	// CALCULAR Y MOSTRAR EL TOTAL
	totalCarrito = 0;
	let subtotalesCarrito = document.getElementsByClassName('subtotal');
	for (let i = 0; i < subtotalesCarrito.length; i++) {
		let productIndex = subtotalesCarrito[i].id.replace('subtotal', '');
		let productSubtotal = parseFloat(
			document.getElementById(`subtotal${productIndex}`).innerHTML
		);

		totalCarrito += convertToCurrentCurrency(
			productSubtotal,
			productosCarrito[productIndex]?.currency
		);
	}

	mostrarTotales();
}

/**A LO QUE MI CANTIDAD NO ES UN INPUT, HE DE NECESITAR FUNCIONES PARA INCREMENTAR O DECREMENATAR LA CANTIDAD */
function incrementarCantidad(i) {
	let cantidad = parseFloat(document.getElementById(`count${i}`).innerText);
	document.getElementById(`count${i}`).innerText = cantidad + 1;
	calcularSubtotal(i);
}
function decrementarCantidad(i) {
	let cantidad = parseFloat(document.getElementById(`count${i}`).innerText);
	if (cantidad > 1)
		document.getElementById(`count${i}`).innerText = cantidad - 1;
	calcularSubtotal(i);
}
/** */

function calcularSubtotal(i) {
	elt = document.getElementById(`count${i}`);
	let precio = parseFloat(elt.dataset.unitCost);
	let cantidad = parseFloat(elt.innerHTML);

	let total = precio * cantidad;

	document.getElementById(`subtotal${i}`).innerHTML = total
		.toFixed(2)
		.replace(/\./g, ',');
	productosCarrito[i].count = cantidad; //GUARDO LA CANTIDAD EN MI ARR  AY DE CARRITO, PARA QUE CUANDO BORRE UN ELEMENTO Y VUELVA A MOSTRAR, CONSEVE LA CANTIDAD
	calcularTotal();
}

function mostrarInfoProducto() {
	if (!productosCarrito.length) return carritoVacio();

	let htmlBorrarTodo =
			' <div class="row justify-content-end"><h5 class="Cart-Header__Action " onclick="borrarCarrito()"> Borrar todo </h5></div>',
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
        <h3 class="Cart_Items__subtitle">${producto.currency}$${
			producto.unitCost
		}</h3>
      </div>
      <div class="Cart_Items__counter col-6 offset-md-1 col-md-4 offset-lg-0 col-lg-2 ">
        <div class="Cart_Items__btnCount" onclick="incrementarCantidad(${i})">+</div>
        <div class="Cart_Items__count" data-unit-cost="${
					producto.unitCost
				}" id="count${i}" onchange="calcularSubtotal(${i})">${
			producto.count
		}</div>
        <div class="Cart_Items__btnCount" onclick="decrementarCantidad(${i})">-</div>
      </div>
      <div class="Cart_Items__prices col-6 col-md-3 col-lg-3 text-right">
        <div class="Cart_Items__amount row justify-content-end mr-1">
          ${producto.currency}$
          <div class="subtotal" id="subtotal${i}">${(
			producto.unitCost * producto.count
		).toFixed(2)}</div>
        </div>
        <u onclick="borrarDelCarrito(${i})" class="Cart_Items__remove">Borrar</u>
      </div>
    </div>
    <br>
    `;
	}

	document.getElementById('listaCarrito').innerHTML =
		htmlBorrarTodo + htmlTexto;
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

function carritoVacio() {
	calcularTotal();
	document.getElementById('contenedor-carrito').innerHTML = `
    <div class="container text-center m-auto pb-5">
      <h4>Tu carrito está vacio...</h4>
      <button class="btn btn-secondary mt-2" onclick="location.href='./products.html'">Volver a productos</button> 
    </div>
  `;
}

function togglePayment() {
	const DIV_NRO_TARJETA = document.getElementById('payment__nroTarjeta'),
		DIV_COD_SEGURIDAD = document.getElementById('payment__codSeguridad'),
		DIV_VENCIMIENTO = document.getElementById('payment__vencimiento'),
		DIV_NRO_CUENTA = document.getElementById('payment__nroCuenta');

	switch (currentPayment) {
		case 1:
			DIV_NRO_TARJETA.toggleAttribute('readonly', false);
			DIV_COD_SEGURIDAD.toggleAttribute('readonly', false);
			DIV_VENCIMIENTO.toggleAttribute('readonly', false);
			DIV_NRO_CUENTA.toggleAttribute('readonly', true);
			break;
		case 2:
			DIV_NRO_TARJETA.toggleAttribute('readonly', true);
			DIV_COD_SEGURIDAD.toggleAttribute('readonly', true);
			DIV_VENCIMIENTO.toggleAttribute('readonly', true);
			DIV_NRO_CUENTA.toggleAttribute('readonly', false);
			break;
		default:
			DIV_NRO_TARJETA.toggleAttribute('readonly', true);
			DIV_COD_SEGURIDAD.toggleAttribute('readonly', true);
			DIV_VENCIMIENTO.toggleAttribute('readonly', true);
			DIV_NRO_CUENTA.toggleAttribute('readonly', true);
			break;
	}
}

document.addEventListener('DOMContentLoaded', function (e) {
	getJSONData(CART_URL_DESAFIANTE).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			productosCarrito = resultObj.data.articles;
			mostrarInfoProducto();
		}
	});

	/**RADIO DE TIPO DE ENVIO */
	document.getElementById('tipoEnvio').addEventListener('change', (e) => {
		tipoEnvio = parseFloat(e.target.value);
		calcularTotal();
	});

	/**RADIO DE CURRENCY */
	for (radio of document.getElementsByClassName('radio_currency')) {
		radio.addEventListener('click', function (e) {
			currentCurrency = e.target.dataset.value;
			calcularTotal();
		});
	}

	/**RADIO DE FORMA DE ENVIO */
	for (radio of document.getElementsByClassName('radio_payment')) {
		radio.addEventListener('click', function (e) {
			currentPayment = parseInt(e.target.id.slice(-1));
			togglePayment();
		});
	}

	/** FORMS VALIDATIONS */
	let forms = document.getElementsByClassName('needs-validation');
	Array.prototype.filter.call(forms, function (form) {
		form.addEventListener(
			'submit',
			function (event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');

				if (!modalValidated) {
					$('#paymentSelection').toggleClass('validateSpan-invalid', true);
					$('#paymentSelection').toggleClass('validateSpan-valid', false);
				} else {
					$('#paymentSelection').toggleClass('validateSpan-invalid', false);
					$('#paymentSelection').toggleClass('validateSpan-valid', true);
				}
			},
			false
		);
	});

	// EVENTO CLICK AL BOTON DEL MODAL DE FORMATO DE PAGO
	const FORM_PAYMENT = document.getElementById('paymentForm');
	FORM_PAYMENT.addEventListener('submit', (event) => {
		event.preventDefault();

		const HTML_NRO_TARJETA = document.getElementById(
				'payment__nroTarjeta'
			).value,
			HTML_COD_SEGURIDAD = document.getElementById(
				'payment__codSeguridad'
			).value,
			HTML_VENCIMIENTO = document.getElementById('payment__vencimiento').value,
			HTML_NRO_CUENTA = document.getElementById('payment__nroCuenta').value,
			DIV_SELECCION_PAYMENT = document.getElementById('paymentSelection');

		// DEPENDIENDO DEL FORMATO DE PAGO COMPRUEBO CAMPOS QUE NECESITO
		if (currentPayment == 1) {
			if (
				HTML_NRO_TARJETA == '' ||
				HTML_COD_SEGURIDAD == '' ||
				HTML_VENCIMIENTO == ''
			)
				return;

			// CREO EL OBJETO
			datosPayment.formaDePago = currentPayment;
			datosPayment.nroTarjeta = HTML_NRO_TARJETA;
			datosPayment.codSeguridad = HTML_COD_SEGURIDAD;
			datosPayment.vencimiento = HTML_VENCIMIENTO;

			// INDICAR LA SELECCION FUERA DEL MODAL
			DIV_SELECCION_PAYMENT.innerHTML = 'Tarjeta de credito';
		} else if (currentPayment == 2) {
			if (HTML_NRO_CUENTA == '') return;

			// CREO EL OBJETO
			datosPayment.formaDePago = currentPayment;
			datosPayment.nroCuenta = HTML_NRO_CUENTA;

			// INDICAR LA SELECCION FUERA DEL MODAL
			DIV_SELECCION_PAYMENT.innerHTML = 'Transferencia bancaria';
		} else return;

		// OCULTAR EL MODAL SI EL PAGO ESTA CORRECTO
		modalValidated = true;
		$('#paymentSelection').toggleClass('validateSpan-invalid', false);
		$('#paymentSelection').toggleClass('validateSpan-valid', true);
		$('#paymentModal').modal('hide');
	});

	// EVENTO CLICK AL BOTON DE COMPRAR
	const FORM_BUY = document.getElementById('buyForm');
	FORM_BUY.addEventListener('submit', (event) => {
		event.preventDefault();

    // VERIFICAR QUE EL CARRITO NO ESTE VACIO
		if (!productosCarrito.length) return showAlert('Asegurate de que tu carrito no este vacio', 'warning');

		const VALUE_CALLE = document.getElementById('direccionCalle').value,
			VALUE_NUMERO = document.getElementById('direccionNro').value,
			VALUE_ESQUINA = document.getElementById('direccionEsquina').value;
    
    // VERIFICAR CAMPOS DE DIRECCION
		if (VALUE_CALLE === '' || VALUE_NUMERO === '' || VALUE_ESQUINA === '') return;
    // VERIFICAR FORMULARIO DE FORMA DE PAGO
		if (!modalValidated) return showAlert('Porfavor, completa el formulario de formato de pago', 'danger');

		// CREAR OBJETO DE COMPRA
		let datosCompra = {
			carrito: productosCarrito,
			direccion: {
				calle: VALUE_CALLE,
				nro: VALUE_NUMERO,
				esquina: VALUE_ESQUINA,
			},
			subtotal: totalCarrito,
			envio:
				tipoEnvio == 0.05
					? 'STANDARD'
					: tipoEnvio == 0.07
					? 'EXPRESS'
					: tipoEnvio == 0.15
					? 'PREMIUM'
					: '',
			total: totalCarrito * (1 + tipoEnvio),
			pago: datosPayment,
      timestamp: new Date().getTime()
		};

		// ENVIAR OBJETO DE COMPRA
		fetch(BUY_ORDER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				datosCompra,
			}),
      redirect: 'error'
		})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // MOSTRAR MENSAJE DE COMPRA EXITOSA
      showAlert('Tu compra se ha realizado con exito!', 'success');
      console.log(data)
      // REDIRECCIONAR A UNA PAGINA DE COMPRA EXITOSA QUE TENGA UN TIMEOUT PARA EL HOME
      // location.href = 'home.html';
    })
    .catch((err) => {
      console.log(err);
    });
	});
});

function showAlert(msg, color) {
	// AGREGARLE COLOR Y MENSAJE COMO ARGUMENTOS, PARA HACERLA MAS UTIL EN OTROS LADOS
	let newAlert = `
  <div class="alert alert-${color} fade show" style="z-index: 1" role="alert">
    <span id="resultSpan">${msg}</span>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>
  `;

	document.getElementById('alertResult').innerHTML = newAlert;

	setTimeout(() => {
		$('.alert').alert('close');
	}, 3000);
}
