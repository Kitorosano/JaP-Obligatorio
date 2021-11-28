let comments = [];
let currentScore = null;

function showComments(){
  let htmlToAppend = '';

  for(let i = 0; i < comments.length; i++){
    const {dateTime, user, description: message, score} = comments[i]; // Desestructuracion de objeto,(para acceder mas facilmente a las propiedades del producto)
    let d = new Date(dateTime),
        commentDate = d.getDate().toString().padStart(2,'0') + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getFullYear().toString(),
        commentTime = [d.getHours(), d.getMinutes()].map((a)=>(a < 10 ? '0' + a : a)).join(':');

    const commentDateTime = `${commentDate} ${commentTime}`
    htmlToAppend += `
      <div class="container px-2">
        <b class="media-heading">${user}</b>
        <p style="font-size: 14px">${message}</p>
        <div class="row justify-content-between px-3">
          <div>
            <span class="fa fa-star ${score >= 1 ? 'checked' : ''}"></span>
            <span class="fa fa-star ${score >= 2 ? 'checked' : ''}"></span>
            <span class="fa fa-star ${score >= 3 ? 'checked' : ''}"></span>
            <span class="fa fa-star ${score >= 4 ? 'checked' : ''}"></span>
            <span class="fa fa-star ${score >= 5 ? 'checked' : ''}"></span>
          </div>
          <span style="color: gray"><i class="fa fa-calendar"></i> ${commentDateTime}</span>
        </div>
      </div>
      <hr>`;
  }

  document.getElementById('show-comments').innerHTML = htmlToAppend;
  document.getElementById('show-comments-count').innerHTML = comments.length + ' Comentarios';
}

function sortAndShowComments(commentsArray) {
  if(commentsArray != undefined){
      comments = commentsArray; //Establezco mi array de productos siempre y cuando no este vacio
  }

  comments = comments.sort(function (a, b) {
    var dateA = new Date(a.dateTime).getTime();
    var dateB = new Date(b.dateTime).getTime();
    return dateA < dateB ? 1 : -1;
  }); //Reordeno mis productos de acuerdo al criterio de ordenamiento establecido

  showComments();
}


function enviarComentario(){
  const user = localStorage.getItem('username')
  const description = document.getElementById('message').value;
  const score = currentScore;
  if(!user || description == '' || !score) return alert('Completa los campos!'); //Si alguno de los datos no esta o es null Cancelar en envio

  // Reset Formulario y estrellas
  document.getElementById('input-comment').reset();
  currentScore = null;
  
  // Creo mi comentario a enviar
  const comentario = {
    user, description, score, dateTime: new Date()
  }

  // Enviar mi comentario
  comments.push(comentario);
  sortAndShowComments();

  const allItems = [...document.getElementsByClassName('rating-item')];
  allItems.forEach(item => item.classList.remove('active')) //SACO TODO LOS ACTIVES

}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
    if (resultObj.status === "ok"){
      sortAndShowComments(resultObj.data);
    }
  });

  /* RATING SYSTEM*/
  const starContainer = document.getElementsByClassName('rating')[0];
  const allItems = [...document.getElementsByClassName('rating-item')];
  starContainer.addEventListener('click', function(e){ //CUANDO HAGO CLICK
    allItems.forEach(item => {
      item.classList.remove('active'); //SACO TODO LOS ACTIVES

      if(item.getAttribute('data-rate') <= e.target.getAttribute('data-rate')){ //SI EL NUMERO DE ESA ESTRELLA ES MENOR O IGUAL AL PUNTAJE CLICKEADO
        item.classList.add('active'); //LE PONGO EL ACTIVE
      }
    })    
    currentScore = e.target.getAttribute('data-rate'); //OBTENGO SU NUMERO DE ESTRELLA
  });
});
