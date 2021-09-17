const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  let usuario = localStorage.getItem('username'); //Obtengo la variable username del LocalStorage 

  if(!usuario) return signOut();

  document.getElementsByTagName('nav')[0]
  .innerHTML = `
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="btn-group" id="btnUsuario">
      <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${usuario ? usuario : ''}
      </button>
      <div class="dropdown-menu dropdown-menu-right">
        <a class="dropdown-item" href="#" onclick="signOut()">Sign out</a>
        <a class="dropdown-item" href="#">Something else here</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#">Separated link</a>
      </div>
    </div>
    <div class="collapse navbar-collapse" id="navbarToggler"> 
      <ul class="navbar-nav container justify-content-around text-center"> 
        <li class="nav-item">
          <a class="nav-link" href="home.html">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="categories.html">Categorías</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="products.html">Productos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="sell.html">Vender</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="cart.html">Mi carrito</a>
        </li>
      </ul>
    </div>`
});

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('username');
  });
}
