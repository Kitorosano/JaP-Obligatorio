let currentProduct = {};

function showProductImages(array) {
  let appendProductImage = "";
  let appendProductImageIndicator = "";
  let imagesDivs = document.getElementById('productImages');
  let imagesIndicator = document.getElementById('productRelatedImages');

	for (let i = 0; i < array.length; i++) {
		let imageSrc = array[i];


    appendProductImage += `
      <div class="carousel-item ${i == 0 ? 'active' : ''}" class="d-block w-100">
        <img class="img-thumbnail" src="${imageSrc}" alt="Slide ${i}">
      </div>`
    
    appendProductImageIndicator += `
      <li data-target="#carouselIndicators" data-slide-to="${i}" ${i == 0 ? 'class="active"' : ''}></li>`
     
	}
    
  imagesIndicator.innerHTML = appendProductImageIndicator;
  imagesDivs.innerHTML = appendProductImage;
}

function showProduct() {
	let productNameHTML = document.getElementById('productName');
	let productDescriptionHTML = document.getElementById('productDescription');
	let productSoldCountHTML = document.getElementById('productSoldCount');
	let productCriteriaHTML = document.getElementById('productCategory');
	let productPriceHTML = document.getElementById('productPrice');
	// let productsRelatedHTML = document.getElementById("relatedProducts");

	productNameHTML.innerHTML = currentProduct.name;
	productDescriptionHTML.innerHTML = currentProduct.description;
	productSoldCountHTML.innerHTML = currentProduct.soldCount;
	productPriceHTML.innerHTML = `$${currentProduct.cost} ${currentProduct.currency}`;
	productCriteriaHTML.innerHTML = currentProduct.category;
	// productsRelatedHTML.innerHTML = currentProduct.relatedProducts;

	//Muestro las imagenes en forma de galería
	showProductImages(currentProduct.images);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener('DOMContentLoaded', function (e) {
	getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			currentProduct = resultObj.data;
			showProduct();
		}
	});
});
