$(function() {
    'use strict';

    /* navbar sticky when scroll down */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) { 
            $('header').addClass("sticky");
        }
        if ($(this).scrollTop() <= 0) {
            $('header').removeClass("sticky");
        }
    });

    /* scroll-to-top button */
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollToTopContainer').fadeIn();
        
        } else if ($(this).scrollTop() == 0) {
            $('.scrollToTopContainer').fadeOut();
        }
    });	
    
    /* Click event of scroll to top */
    $('.scrollToTopContainer').click(function(){
        $('html, body').animate({scrollTop : 0} ,500);
        $('.jumpToContent').focus();
        return false;
    });

    /* Hamburger click event */
    $(".custom-toggle").click(function(){
        if($(".custom-toggle").attr("aria-expanded") == "true"){
            $(this).addClass("active");
            $('header').addClass('opened');
            $('#mainNavbar .nav-item').addClass('animated');
        }
        else{
            $(this).removeClass("active");
            $('header').removeClass('opened');
            $('#mainNavbar .nav-item').removeClass('animated');
        }
    });

    /* hide the element $('hide-after-footer') after footer exist */
    $(window).on('scroll', function () {
        var element = document.querySelector('footer'),
	        position = element.getBoundingClientRect();
        if($('.hide-after-footer').length){   //if exist on page
            if (position.top < window.innerHeight && position.bottom >= 0){ //if element is partially visible on page
                $('.hide-after-footer').addClass('hidden');
            }
            else{
                $('.hide-after-footer').removeClass('hidden');
            }
        }
    }); 

    //Simple lightbox init
    const lightbox = document.querySelectorAll('.lightbox');
    for (var i = 0; i < lightbox.length; i++){
        lightbox[i].classList.add('lightbox-' + i);
        $('.lightbox-' + i + ' a').simpleLightbox();
    }
  
  
    var swiperLogo = new Swiper('.swiper-container-logo', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },
      slidesPerView: 10,
      spaceBetween: 30,
      autoplay: true,
      breakpoints: {
        1200: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        },
        500: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }
    });
  
  
  $(".btn-closeAD").click(function(){
    $(".float-banner").css('display','none');
  });

  
});

jQuery(document).ready(function($){
	var contentSections = $('.cd-section'),
		navigationItems = $('#cd-vertical-nav a');

	updateNavigation();
	$(window).on('scroll', function(){
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });
    //smooth scroll to second section
    $('.cd-scroll-down').on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $('.touch .cd-nav-trigger').on('click', function(){
    	$('.touch #cd-vertical-nav').toggleClass('open');
  
    });
    //close navigation on touch devices when selectin an elemnt from the list
    $('.touch #cd-vertical-nav a').on('click', function(){
    	$('.touch #cd-vertical-nav').removeClass('open');
    });

	function updateNavigation() {
		contentSections.each(function(){
			$this = $(this);
			var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
				navigationItems.eq(activeSection).addClass('is-selected');
			}else {
				navigationItems.eq(activeSection).removeClass('is-selected');
			}
		});
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	600
        );
	}
  
  
  new WOW().init();
});


$(".changelangEn").click(function(){
    changelang('en');
});
$(".changelangTc").click(function(){
    changelang('tc');
});
$(".changelangSc").click(function(){
    changelang('sc');
});

$(".back-page").click(function(){
    window.history.back();
});