const FORM = document.getElementById('form-profile'),
      DIV_NOMBRE1 = document.getElementById('nombre1'),
      DIV_NOMBRE2 = document.getElementById('nombre2'),
      DIV_APELLIDO1 = document.getElementById('apellido1'),
      DIV_APELLIDO2 = document.getElementById('apellido2'),
      DIV_EMAIL = document.getElementById('email'),
      DIV_TELEFONO = document.getElementById('telefono'),
      DIV_EDAD = document.getElementById('edad'),
      IMG_FOTO = document.getElementById('photo');
    
FORM.addEventListener('submit', event => {
  event.preventDefault(); //PREVENGO EL REDIRECCIONAMIENTO
  
  // COMPRUEBO CAMPOS OBLIGATORIOS
  if(DIV_NOMBRE1.value == '' || DIV_APELLIDO1.value == '' || DIV_EMAIL.value == '' ) return;

  // CREO MI OBJETO
  const datosPerfil = {
    "nombre1" : DIV_NOMBRE1.value,
    "nombre2": DIV_NOMBRE2.value,
    "apellido1": DIV_APELLIDO1.value,
    "apellido2": DIV_APELLIDO2.value,
    "email": DIV_EMAIL.value,
    "telefono": DIV_TELEFONO.value,
    "edad": DIV_EDAD.value,
    "imagen": IMG_FOTO.src
  }

  //GUARDO EN EL LOCAL STORAGE
  localStorage.setItem('datosPerfil', JSON.stringify(datosPerfil)); 
  showAlert(); // ALERTA 'CAMBIOS GUARDADOS'
  showUnsavedChanges(true); //OCULTO EL 'CAMBIOS SIN GUARDAR'
})

function obtenerDatosPerfil(){
  const {nombre1, nombre2, apellido1, apellido2, email, telefono, edad, imagen} = JSON.parse(localStorage.getItem('datosPerfil'));
  
  // LE COLOCO A CADA INPUT SU VALOR DEL LOCALSTORAGE
  DIV_NOMBRE1.value = nombre1;
  DIV_NOMBRE2.value = nombre2;
  DIV_APELLIDO1.value = apellido1;
  DIV_APELLIDO2.value = apellido2;
  DIV_EMAIL.value = email;
  DIV_TELEFONO.value = telefono;
  DIV_EDAD.value = edad;
  IMG_FOTO.src = imagen || "img/avatar4.png" //IMAGEN POR DEFECTO
}

function showAlert(){
  let newAlert = `
  <div class="alert alert-success fade show position-relative mb-0" style="top: 0%" role="alert">
    <span id="resultSpan">La informacion se ha guardado exitosamente!</span>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
  </div>
  `;

  document.getElementById('alertResult').innerHTML = newAlert;

  setTimeout(() => {
    $('.alert').alert('close');
  }, 3000)
}

function changeAvatar(i){
  let previous = IMG_FOTO.getAttribute('src');
  IMG_FOTO.setAttribute('src', `img/avatar${i}.png`);
  showUnsavedChanges( IMG_FOTO.getAttribute('src') === previous);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  obtenerDatosPerfil();

  /**CSS UPLOAD PHOTO */
  const imgDiv = document.querySelector('.user-profile');
  const file = document.querySelector('#file');
  const btn = document.querySelector('#uploadBtn')

  imgDiv.addEventListener('mouseenter', () => {
    btn.style.display = 'block'
  })
  imgDiv.addEventListener('mouseleave', () => {
    btn.style.display = 'none'
  });

  file.addEventListener('change', (e) => {
    const choosedFile = e.target.files[0];

    if(choosedFile){
      const reader = new FileReader();
      
      reader.addEventListener('load', () => {
        showUnsavedChanges(reader.result === IMG_FOTO.getAttribute('src'));
        IMG_FOTO.setAttribute('src', reader.result);
      });

      reader.readAsDataURL(choosedFile);
    }
  })
  /** */


  /**AVATARS POR DEFAULT */
  document.getElementById('avatars').innerHTML = `
    <img src="img/avatar1.png" style="width: 23%;" onclick="changeAvatar(1)">
    <img src="img/avatar2.png" style="width: 23%;" onclick="changeAvatar(2)">
    <img src="img/avatar3.png" style="width: 23%;" onclick="changeAvatar(3)">
    <img src="img/avatar4.png" style="width: 23%;" onclick="changeAvatar(4)">
    <img src="img/avatar5.png" style="width: 23%;" onclick="changeAvatar(5)">
    <img src="img/avatar6.png" style="width: 23%;" onclick="changeAvatar(6)">
    <img src="img/avatar7.png" style="width: 23%;" onclick="changeAvatar(7)">
    <img src="img/avatar8.png" style="width: 23%;" onclick="changeAvatar(8)">
  `;

  /**VERIFICA CONSTANTEMENTE SI HAY CAMBIOS SIN GUARDAR */
  for (let input of document.getElementsByClassName('form-control')) { //PARA CADA INPUT DEL FORM
    input.addEventListener('keyup', e => { //AGREGO UN EVENTO DE ESCUCHA CUANDO DEJARON DE TIPEAR
      // COMPARO LO QUE ACABAN DE MODIFICAR EN EL INPUT CON EL DATO CORRESPONDIENTE DEL LOCALSTORAGE, Y DETERMINO SI MOSTRAR 'CAMBIOS SIN GUARDAR'
      showUnsavedChanges( e.target.value === JSON.parse(localStorage.getItem('datosPerfil'))[e.target.id] )
    })
  }
});

function showUnsavedChanges(mostrar){
  $('#unsaved').toggleClass('d-none', mostrar);
}