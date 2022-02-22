
// on ready state
$(document).ready(function () {
	'use strict';
	$(window).on("scroll", function () {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 100) {
      $("#mainnavigationBar").addClass("sticky-nav");
    } else {
      $("#mainnavigationBar").removeClass("sticky-nav");
    }
  });
  $('.navbar-toggler').on( 'click', function() {
    var navbar = $('#mainnavigationBar');
    navbar.toggleClass('bg-nav');
  });
	// dropdown height fix
	function dropdownHeightFix() {
		var width = $(window).width();
		if (width > 1200) {
			$('.navbar-nav').find('.dropdown-menu').each(function (idx, item) {
				$(this).height($(this).height());
			});
		}
		if (width < 1200) {
			$('.navbar-nav').find('.dropdown-menu').each(function (idx, item) {
				$(this).css('height', 'auto');
			});
		}
	}
	dropdownHeightFix();
	$(window).resize(function() {
		dropdownHeightFix();
	});

	// menuHumBurger icon toggle Init
	function menuHumBurgerIcon() {
		$('.navbar-toggler').on('click', function () {
			$(this).children('i').toggleClass('d-inline d-none');
		});
	}
	menuHumBurgerIcon();


	
	// counterUp
	if($('.counter').length !== 0) {
		var a = 0;
		$(window).scroll(function () {
			var oTop = $('.counter').offset().top - window.innerHeight;
			if (a == 0 && $(window).scrollTop() > oTop) {
				$('.counter').each(function () {
					var $this = $(this),
						countTo = $this.attr('data-count');
					$({
						countNum: $this.text()
					}).animate({
							countNum: countTo
						}, {
							duration: 850,
							easing: 'swing',
							step: function () {
								$this.text(
									Math.ceil(this.countNum).toLocaleString('en')
								);
							},
							complete: function () {
								$this.text(
									Math.ceil(this.countNum).toLocaleString('en')
								);
							}
						}
					);
				});
				a = 1;
			}
		});
	}



	// tab
	$('.tab-content').find('.tab-pane').each(function (idx, item) {
		var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
			title = $(this).attr('title');
		navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
	});

	$('.code-tabs ul.nav-tabs').each(function () {
		$(this).find("li:first").addClass('active');
	})

	$('.code-tabs .tab-content').each(function () {
		$(this).find("div:first").addClass('active');
	});

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		var tab = $(this).parent(),
			tabIndex = tab.index(),
			tabPanel = $(this).closest('.code-tabs'),
			tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
		tabPanel.find('.active').removeClass('active');
		tab.addClass('active');
		tabPane.addClass('active');
	});

});