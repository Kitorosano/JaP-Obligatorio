var currentProductsArray = [];

function showProductsList(){
  let htmlContentToAppend = "";
  for(let i = 0; i < currentProductsArray.length; i++){
      let product = currentProductsArray[i];

      htmlContentToAppend += `
      <a href="product-info.html" class="list-group-item list-group-item-action">
          <div class="row">
              <div class="col-3">
                  <img src="./${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
              </div>
              <div class="col">
                <div class="row h-100 mx-0">
                    <div class="d-flex w-100 justify-content-between overflow-auto  ">
                        <h4 class="mb-1">${product.name}</h4>
                        <small class="text-muted">${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">${product.description}</p>
                    <div class="d-flex w-100 justify-content-end" style="min-height: 50%;align-items: flex-end;">
                      <p class="">$${product.cost} ${product.currency}</p>
                    </div>
                  </div>
              </div>
          </div>
      </a>
      `
      document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
  }
}

function ShowProducts(productsArray){
  if(productsArray != undefined){
      currentProductsArray = productsArray;
  }
  //Muestro los productos
  showProductsList();
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then(function(resultObj){
    if (resultObj.status === "ok"){
      ShowProducts(resultObj.data);
    }
  });
  
});