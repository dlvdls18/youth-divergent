firebase.initializeApp({
  apiKey: "AIzaSyADxhnTRh5Y5qsIQ3xZYBCsvsXK_O7IMh8",
  authDomain: "youth-divergent.firebaseapp.com",
  projectId: "youth-divergent",
  storageBucket: "youth-divergent.appspot.com",
  messagingSenderId: "262827845500",
  appId: "1:262827845500:web:9b5285bffecfb30b7ce6f9",
  measurementId: "G-FM60JVGZFQ"
});
firebase.analytics();
var db = firebase.database();
var storage = firebase.storage();

var overviewIndex = -1;
var overviewData = [{
  file: "img/mod/mod-rj.png",
  name: "RJ Araw",
  text: "Director of<br>Youth Divergent & AdvoKada"
}, {
  file: "img/mod/mod-ruth.png",
  name: "Ruth Araw",
  text: "Adviser of<br>TGBTG Mabuhay Outreach"
}, {
  file: "img/mod/mod-onieth.png",
  name: "Onieth Araw",
  text: "Head Pastor of<br>TGBTG Mabuhay Outreach"
}, {
  file: "img/mod/mod-sy.png",
  name: "Paul Symon Fruto",
  text: "Chairperson of<br>AdvoKada"
}];
var overviewInterval = setInterval(function() {
  nextHead(1);
}, 5000);

function nextHead(i) {
  if(i !== 1 && overviewInterval != null) {
    clearInterval(overviewInterval);
    overviewInterval = null;
  }
  overviewIndex++;
  if(overviewIndex == overviewData.length) {
    overviewIndex = 0;
  }
  var overview = overviewData[overviewIndex];
  $("#overview-img").fadeOut(300, function() {
    $("#overview-img")[0].src = overview.file;
    $("#overview-img").fadeIn(300);
  });
  $("#overview-name").fadeOut(300, function() {
    $("#overview-name").text(overview.name);
    $("#overview-name").fadeIn(300);
  });
  $("#overview-text").fadeOut(300, function() {
    $("#overview-text").html(overview.text);
    $("#overview-text").fadeIn(300);
  });
}

function prevHead() {
  overviewIndex--;
  if(overviewIndex == -1) {
    overviewIndex = overviewData.length - 1;
  }
  var overview = overviewData[overviewIndex];
  $("#overview-img").fadeOut(300, function() {
    $("#overview-img")[0].src = overview.file;
    $("#overview-img").fadeIn(300);
  });
  $("#overview-name").fadeOut(300, function() {
    $("#overview-name").text(overview.name);
    $("#overview-name").fadeIn(300);
  });
  $("#overview-text").fadeOut(300, function() {
    $("#overview-text").html(overview.text);
    $("#overview-text").fadeIn(300);
  });
}

nextHead(1);

var lastOverviewIndex = 1;

function showOverview(event, index) {
  var target = $(`#overview-${index == 1 ? "yd" : "ako"}`);
  var target_alt = $(`#overview-${index == 2 ? "yd" : "ako"}`);
  if(lastOverviewIndex == index) return;
  lastOverviewIndex = index;
  $(".active").removeClass("active");
  $(event.target).addClass("active");
  target.toggleClass("active");
  target_alt.fadeOut(300, function() {
    target.fadeIn(300);
  });
}

var tracks = [];
var isPlayerOpened = false;
var trackIndex = -1;
var trackEl = null;
var isPlaying = false;

db.ref("tracks").get().then(function(data) {
  (data.val() || []).forEach(async function(track) {
    var obj = new Object(track);
    var aud = await storage.ref(`tracks/audio/${track.audio}`).getDownloadURL();
    var cov = await storage.ref(`tracks/cover/${track.cover}`).getDownloadURL();
    obj.audio = aud;
    obj.cover = cov;
    tracks.push(obj);
  });
});

function openPlayer() {
  if(!isPlaying) playNextTrack();
  $("#player").css("display", "flex");
  if(isPlayerOpened == false) {
    new bootstrap.Offcanvas("#offcanvas-player").show();
    isPlayerOpened = true;
  } else {
    new bootstrap.Offcanvas("#offcanvas-player").show();
  }
}

function playNextTrack(index) {
  if(tracks.length == 0 || trackIndex == index) return;
  if(trackEl != null) trackEl.remove();
  trackIndex++;
  if(trackIndex == tracks.length) trackIndex = 0;
  if(index != null) trackIndex = index;
  var t = tracks[trackIndex];
  trackEl = document.createElement("audio");
  trackEl.src = t.audio;
  trackEl.play();
  $("#track-cover")[0].src = t.cover;
  $("#track-title").text(t.name);
  isPlaying = true;
  $("#player-control").removeClass("fa-play");
  $("#player-control").addClass("fa-pause");
  document.body.append(trackEl);
  var h = "";
  tracks.forEach(function(t, i) {
    h += `<div class="container-fluid d-flex align-items-center p-2 px-4 rounded ${i == trackIndex ? "track-item" : ""}">`;
    h += `<img src="${t.cover}" class="player-cover rounded">`;
    h += `<div class="mx-2 flex-grow-1">`;
    h += `<p class="player-title">${t.name}</p>`;
    h += `<p class="player-subtitle">Youth Divergent</p>`;
    h += `</div>`;
    h += `<div onclick="playNextTrack(${i})">`;
    h += `<i class="fas fa-play"></i>`;
    h += `</div>`;
    h += `</div>`;
  });
  $("#playlist").html(h);
}

function controlTrack() {
  isPlaying = !isPlaying;
  if(isPlaying == true) {
    trackEl.play();
    $("#player-control").removeClass("fa-play");
    $("#player-control").addClass("fa-pause");
  } else {
    trackEl.pause();
    $("#player-control").removeClass("fa-pause");
    $("#player-control").addClass("fa-play");
  }
}

function playerClose() {
  isPlaying = false;
  $("#player").css("display", "none");
  trackEl.pause();
}

function openProduct() {
  var a = document.createElement("a");
  a.href = "https://shopee.ph/Youth-DIvergent";
  a.target = "_blank";
  a.click();
}

function openLive() {
  var a = document.createElement("a");
  a.href = "https://facebook.com/YouthDivergent/videos";
  a.target = "_blank";
  a.click();
}

async function openEvents() {
  $("#event-list").html("");
  var e = await db.ref("events").get();
  (e.val() || []).forEach(async function(i) {
    var h = "";
    var url = await storage.ref(`events/${i.image}`).getDownloadURL();
    var d = new Date(i.date).getTime();
    var n = Date.now();
    if(d > n) {
      h += `<li class="list-group-item p-3 d-flex flex-column justify-content-center align-items-center">`;
      h += `<img src="${url}" class="events-img rounded"><br>`;
      h += `<p class="fs-5 fw-bold">${i.name}</p>`;
      h += `<p class="text-success">${i.date}</p>`;
      h += `</li>`
    } else {
      h += `<li class="list-group-item p-3 d-flex flex-column justify-content-center align-items-center">`;
      h += `<img src="${url}" class="events-img rounded"><br>`;
      h += `<p class="fs-5 fw-bold">${i.name}</p>`;
      h += `<p class="text-danger">${i.date}</p>`;
      h += `</li>`
    }
    $("#event-list").html($("#event-list").html() + h);
  });
  new bootstrap.Offcanvas("#offcanvas-events").show();
}

function openProductSect() {
  var a = document.createElement("a");
  a.href = "#products";
  a.click();
}

function openInfoSect() {
  var a = document.createElement("a");
  a.href = "#section-info";
  a.click();
}