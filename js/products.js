const ORDER_ASC_BY_PRICE = "Price+",
      ORDER_DESC_BY_PRICE = "Price-",
      ORDER_BY_RELEVANCY = "Relevancy",
      LAYOUT_GRID = "Grid",
      LAYOUT_LIST = "List";
let currentProductsArray = [],
    currentSortCriteria = undefined,
    minPrice = undefined,
    maxPrice = undefined,
    filterText = '';

function sortProducts(criteria, array){
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ) return -1;
            if ( a.cost > b.cost ) return 1;
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ) return -1;
            if ( a.cost < b.cost ) return 1;
            return 0;
        });
    }else if (criteria === ORDER_BY_RELEVANCY){
        result = array.sort(function(a, b) {
          let aSold = parseInt(a.soldCount);
          let bSold = parseInt(b.soldCount);

          if ( aSold > bSold ) return -1;
          if ( aSold < bSold ) return 1;
            return 0;
        });
    }

  return result;
}


function showProductsList(layout = LAYOUT_GRID){
  let htmlContentToAppend = "";

  for(product of currentProductsArray){ //Para cada producto de mi array de productos actuales
    const {cost, imgSrc, description, soldCount, name, currency} = product; // Desestructuracion de objeto,(para acceder mas facilmente a las propiedades del producto)
    
    if (((minPrice == undefined) || (minPrice != undefined && parseInt(cost) >= minPrice)) && //Voy a mostrar el producto siempre y cuando:
        ((maxPrice == undefined) || (maxPrice != undefined && parseInt(cost) <= maxPrice)) &&
        ((name.toUpperCase().indexOf(filterText) > -1) || (description.toUpperCase().indexOf(filterText) > -1))){  //No haya un filtro puesto, o si el producto esta dentro de los rangos establecidos

          
        if(layout == LAYOUT_GRID){ // MOSTRAR GRILLA
          htmlContentToAppend += `
            <div class="card-column col-lg-4 col-md-6 col-12">
              <div class="card mb-4" style="cursor: pointer" onclick="location.href = 'product-info.html';">
                <img src="./${imgSrc}" alt="${description}" class="card-img-top">
                <div class="card-body">
                  <h5 class="card-title font-weight-bold">${name}</h5>
                  <p class="card-text">${description}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                  <small class="text-muted card_soldCount">${soldCount} vendidos</small>
                  <p class="card_currency mb-0"> ${currency}$${cost}</p>
                </div>
              </div>
            </div>
          `
        } else { //MOSTRAR LISTA
          htmlContentToAppend += `
          <a href="product-info.html" class="list-group-item list-group-item-action mb-2">
            <div class="row">
              <div class="col-3">
                <img src="./${imgSrc}" alt="${description}" class="img-thumbnail">
              </div>
              <div class="col">
                <div class="row h-100 mx-0">
                  <div class="d-flex w-100 justify-content-between overflow-auto  ">
                    <h4 class="mb-1 font-weight-bold">${name}</h4>
                    <small class="text-muted">${soldCount} vendidos</small>
                  </div>
                  <p class="mb-1">${description}</p>
                  <div class="d-flex w-100 justify-content-end" style="min-height: 50%;align-items: flex-end;">
                    <p class="">$${cost} ${currency}</p>
                  </div>
                </div>
              </div>
          </div>
          </a>
          `
        }
      }
      document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; //Inserto los htmls de mis productos en en div padre para mostrar.
  }
}

function sortAndShowProducts(sortCriteria, productsArray){
  currentSortCriteria = sortCriteria; //Establezco mi criterio de ordenamiento

  currentProductsArray = productsArray || []; //Establezco mi array de productos siempre y cuando no este vacio

  currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray); //Reordeno mis productos de acuerdo al criterio de ordenamiento establecido
  showProductsList(); //Muestro los productos ordenados
}


//Función que se ejecuta una vez que se haya lanzado el evento de que el documento se encuentra cargado, 
// es decir, se encuentran todos los elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then(function(resultObj){
    if (resultObj.status === "ok"){
      sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
    }
  });
  
  document.getElementById("sortAscPrice").addEventListener("click", () => {
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });

  document.getElementById("sortDescPrice").addEventListener("click", () => {
      sortAndShowProducts(ORDER_DESC_BY_PRICE);
  });

  document.getElementById("sortBySoldCount").addEventListener("click", () => {
      sortAndShowProducts(ORDER_BY_RELEVANCY);
  });

  let msg = document.getElementById('txtBuscar');
  msg.addEventListener("keyup", (event) => {
    filterText = msg.value.trim().toUpperCase();
    showProductsList()
  });

  document.getElementById("rangeFilterPrice").addEventListener("click", () => {
    //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
    minPrice = document.getElementById("rangeFilterPriceMin").value;
    maxPrice = document.getElementById("rangeFilterPriceMax").value;

      if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0)
          minPrice = parseInt(minPrice);
      else
          minPrice = undefined;

      if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0)
          maxPrice = parseInt(maxPrice);
      else
          maxPrice = undefined;
      
      showProductsList();
  });
  

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minPrice = undefined;
    maxPrice = undefined;

    showProductsList();
  });

  
  document.getElementById("layoutGrid").addEventListener("click", () => {
    showProductsList(LAYOUT_GRID);
  });

  document.getElementById("layoutList").addEventListener("click", () => {
    showProductsList(LAYOUT_LIST);
  });
});

/**
 * PREVIOUS LAYOUT
 * 
 * <a href="product-info.html" class="list-group-item list-group-item-action">
    <div class="row">
      <div class="col-3">
        <img src="./${imgSrc}" alt="${description}" class="img-thumbnail">
      </div>
      <div class="col">
        <div class="row h-100 mx-0">
          <div class="d-flex w-100 justify-content-between overflow-auto  ">
            <h4 class="mb-1">${name}</h4>
            <small class="text-muted">${soldCount} vendidos</small>
          </div>
          <p class="mb-1">${description}</p>
          <div class="d-flex w-100 justify-content-end" style="min-height: 50%;align-items: flex-end;">
            <p class="">$${cost} ${currency}</p>
          </div>
        </div>
      </div>
    </div>
    </a>
 */