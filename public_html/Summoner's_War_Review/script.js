// create variables for the slide index, the timer, and the slideshow container

var index = 1;
var timer;
var slideshowContainer;

// add an event listener on load that creates the timer, the slide show container, and calls the show slides function, starting at 
// slide 1; the timer is set to change slides every 2 seconds

window.addEventListener("load",function() {
  showSlides(index);
  timer = setInterval(function(){changeSlides(1)}, 2000);
  slideshowContainer = document.getElementsByClassName('slideshow')[0];
})

// function that changes the slides

function changeSlides(n){

  // reset the timer

  clearInterval(timer);

  // if n is negative, then call showslides for index - 1, and if n isn't negative, call showslides for index + 1

  if (n < 0){
    showSlides(index -= 1);
  } else {
   showSlides(index += 1); 
  }

  // if n is -1, then call change slides for n+2 and set to timer, otherwise call change slides for n+1 and set to timer

  if (n == -1){
    timer = setInterval(function(){changeSlides(n + 2)}, 2000);
  } else {
    timer = setInterval(function(){changeSlides(n + 1)}, 2000);
  }
}

// function to show slides

function showSlides(n){
  var i;
  var slides = document.getElementsByClassName("slides");

  // if the index is greater than the length, then wrap back to the first slide

  if (n > slides.length) {index = 1}

  // if the index is less than 1, then wrap around to the last slide

  if (n < 1) {index = slides.length}

  // hide all of the slides, then show the slide at index-1, since the slides array starts at 0

  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[index-1].style.display = "block";
}
