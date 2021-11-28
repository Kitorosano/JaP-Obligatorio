let currentProduct = null;
let allProducts = null;

function showProductImages(array) {
  let appendProductImage = "";
  let appendProductImageIndicator = "";
  let imagesDivs = document.getElementById('productImages');
  let imagesIndicator = document.getElementById('productRelatedImages');

	for (let i = 0; i < array.length; i++) {
		let imageSrc = array[i];


    appendProductImage += `
      <div class="carousel-item ${i == 0 ? 'active' : ''}">
        <img class="img-thumbnail" src="${imageSrc}" alt="Slide ${i}">
      </div>`
    
    appendProductImageIndicator += `
      <li data-target="#carouselIndicators" data-slide-to="${i}" ${i == 0 ? 'class="active"' : ''}></li>`
     
	}
    
  imagesIndicator.innerHTML = appendProductImageIndicator;
  imagesDivs.innerHTML = appendProductImage;
}

function showRelatedProduct(){  
  let htmlContentToAppend = "";

  for(let i of currentProduct.relatedProducts){ //Para cada producto de mi array de productos actuales
    let related = allProducts[i];
    
    htmlContentToAppend+=`
    <a href="product-info.html" style="text-decoration: none; color: black">
      <img src="./${related.imgSrc}" alt="${related.description}" class="img-thumbnail">
      <div class="m-2">
        <b class="mb-0">${related.name} </b><small class="text-muted"> (${currentProduct.category})</small>
        <p class="mb-0 text-muted" style="font-weight: 500">$${related.cost} ${related.currency}</p>
      </div><hr>
    </a>
    `;
  }
  document.getElementById("relatedProducts").innerHTML = htmlContentToAppend;
}


function showProductInfo() {
  if(!currentProduct) return;

	let productNameHTML = document.getElementById('productName');
	let productDescriptionHTML = document.getElementById('productDescription');
	let productSoldCountHTML = document.getElementById('productSoldCount');
	let productCriteriaHTML = document.getElementById('productCategory');
	let productPriceHTML = document.getElementById('productPrice');

	productNameHTML.innerHTML = currentProduct.name;
	productDescriptionHTML.innerHTML = currentProduct.description;
	productSoldCountHTML.innerHTML += currentProduct.soldCount;
	productPriceHTML.innerHTML += `$${currentProduct.cost} ${currentProduct.currency}`;
	productCriteriaHTML.innerHTML = currentProduct.category;

	showProductImages(currentProduct.images);//Muestro las imagenes en forma de galería
  showRelatedProduct();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener('DOMContentLoaded', function (e) {
  
  getJSONData(PRODUCTS_URL).then(function (resultArr){
    if(resultArr.status === 'ok'){
      allProducts = resultArr.data;

      getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === 'ok') {
          currentProduct = resultObj.data;

          showProductInfo();
        }
      })
		}
	});
});
