
function redirect(username){
  localStorage.setItem('username', username);
  location.replace('./home.html'); //Redireccione al home.html
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  redirect(profile.getName().split(',')[0]);  //Takes only FirstName 
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  let yaIngresado = localStorage.getItem('username');
  if(yaIngresado) return redirect(yaIngresado);

  let form = document.getElementById('myForm');

  form.addEventListener('submit', function(e){
    e.preventDefault(); //Evita el redireccionamiento por default

    // Obtener los datos del input del nombre de usuario
    redirect(document.getElementById('username').value);
  })
});
