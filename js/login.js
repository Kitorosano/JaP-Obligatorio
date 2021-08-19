//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

  let form = document.getElementById('myForm');

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // Obtener los datos para hacer un post

    location.replace('./home.html');
  })

});