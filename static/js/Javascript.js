 
    // // Get the modal
    // var modal = document.getElementById('id01');

    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
	   //  if (event.target == modal) {
	   //  modal.style.display = "none"; }
    // }

// // Get the modal
// var modal= document.getElementById('myModal');

// // Get the image and insert it inside the modal - use its "alt" text as a caption
// var img = document.getElementById('myImg');
// console.log(img)
// var modalImg = document.getElementById("img01");
// var captionText = document.getElementById("caption");
// img.onclick = function(){
//     modal.style.display = "block";
//     modalImg.src = this.src;
//     modalImg.alt = this.alt;
//     captionText.innerHTML = this.alt;
// }
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none"; }
// }




// This is another way of going about it, but it does mean that it will only work when you click the X.

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("closebutton")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() { 
//     modal.style.display = "none";
// }

  $(document).ready(function() {
  var $lightbox = $('#lightbox');
  $('[data-target="#lightbox"]').on('click', function(event) {
  var $img = $(this).find('img'),
  src = $img.attr('src'),
  alt = $img.attr('alt'),
  css = {
  'maxWidth': $(window).width() - 100,
  'maxHeight': $(window).height() - 100
  };
  $lightbox.find('img').attr('src', src);
  $lightbox.find('img').attr('alt', alt);
  $lightbox.find('img').css(css);
  });
  $lightbox.on('shown.bs.modal', function (e) {
  var $img = $lightbox.find('img');
  $lightbox.find('.modal-dialog').css({'width': $img.width()});
  $lightbox.find('.close').removeClass('hidden');
  });
  });



  // 

  // When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}