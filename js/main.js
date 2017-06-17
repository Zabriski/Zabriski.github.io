$(document).ready(function() {

  var toggle = $('.mobile-nav-toggle'),
      nav = $('.mobile-nav');

  toggle.on('click', function() {
    $(this).add(toggle.find('span')).add(nav).toggleClass("is-open");
  })

  $('.main-nav a').on('click', function() {
    if(!$(this).hasClass("active")) {
      $(this).addClass("active")
        .parent().siblings().children().removeClass("active");
    }
  })
})
