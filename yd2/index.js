var lastOverviewIndex = 1;

function showOverview(event, index) {
  var target = $(`#section-${index == 1 ? "yd" : "ako"}`);
  var target_alt = $(`#section-${index == 2 ? "yd" : "ako"}`);
  if(lastOverviewIndex == index) return;
  lastOverviewIndex = index;
  $(".tab-btn").removeClass("active");
  $(event.target).addClass("active");
  target.toggleClass("active");
  target_alt.fadeOut(300, function() {
    target.fadeIn(300);
  });
}