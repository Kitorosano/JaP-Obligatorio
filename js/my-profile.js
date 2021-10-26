const FORM = document.getElementById('form-profile'),
      DIV_NOMBRE1 = document.getElementById('nombre1'),
      DIV_NOMBRE2 = document.getElementById('nombre2'),
      DIV_APELLIDO1 = document.getElementById('apellido1'),
      DIV_APELLIDO2 = document.getElementById('apellido2'),
      DIV_EMAIL = document.getElementById('email'),
      DIV_TELEFONO = document.getElementById('telefono'),
      DIV_EDAD = document.getElementById('edad');
      IMG_FOTO = document.getElementById('photo');
    
FORM.addEventListener('submit', event => {
  event.preventDefault();
  
  if(DIV_NOMBRE1.value == '' || DIV_APELLIDO1.value == '' || DIV_EMAIL.value == '' ) return;

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

  localStorage.setItem('datosPerfil', JSON.stringify(datosPerfil));
  showAlert();
})

function obtenerDatosPerfil(){
  const {nombre1, nombre2, apellido1, apellido2, email, telefono, edad, imagen} = JSON.parse(localStorage.getItem('datosPerfil'));
  
  DIV_NOMBRE1.value = nombre1;
  DIV_NOMBRE2.value = nombre2;
  DIV_APELLIDO1.value = apellido1;
  DIV_APELLIDO2.value = apellido2;
  DIV_EMAIL.value = email;
  DIV_TELEFONO.value = telefono;
  DIV_EDAD.value = edad;
  IMG_FOTO.src = imagen || "https://bootdey.com/img/Content/avatar/avatar7.png"
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
        IMG_FOTO.setAttribute('src', reader.result);
       });

       reader.readAsDataURL(choosedFile);
     }
   })
   /** */
});
