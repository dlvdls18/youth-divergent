var poster = document.getElementById("poster");
var audio = document.getElementById("audio");
var label = document.getElementById("label");
var player = document.getElementById("player");
var isPlaying = false;
var pulseInterval = setInterval(onPulse, 1500);

// SET THE VOLUME TO 30%
audio.volume = 0.3;

// LOOP THE AUDIO
audio.loop = true;

// PULSE EFFECT FOR POSTER
function onPulse() {
  poster.style.opacity = 0.5;
  setTimeout(function() {
    poster.style.opacity = 1;
  }, 800);
}

// SHOW PLAYER
poster.onclick = function() {
  isPlaying = true;
  player.style.display = "flex";
  audio.play();
}

// CLOSE PLAYER 
function closeAudio() {
  isPlaying = false;
  audio.pause();
  player.style.display = "none";
}

var lightbox = document.getElementById("lightbox");

// LOOP FOR EVERY PREVIEW
document.querySelectorAll(".let-preview").forEach(function(el) {
  // ON IMAGE CLICK
  el.onclick = function(e) {
    // SET THE IMAGE
    lightbox.querySelector("img").src = e.target.src;
    // SHOW LIGHTBOX
    lightbox.style.display = "block";
  }
});

// CLOSE THE LIGHTBOX 
function closeLightbox() {
  lightbox.style.display = "none";
}