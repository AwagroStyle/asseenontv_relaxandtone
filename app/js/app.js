$(function() {
  console.log(
    "%c > Development: https://awagro.by/",
    "background: #fc342a; padding:7px 7px 7px 0; font-size: 12px; color: #ffffff"
  );

 // Variables
 const orderBtn = document.querySelectorAll('.btn');
 const orderAddBtn = document.querySelectorAll('.see-also__card-btn');
 const popup = document.querySelector('.page__popup');
 const formWrapper = document.querySelector('.popup__wrapper');
 const orderForm = document.querySelector('.form');
 const closePopupBtn = document.querySelector('.popup__close');
 const productNameInput = document.querySelector('.form__input_product_name');
 const addProductName = document.querySelectorAll('.see-also__card-title');

  // slider
  $(".see-also__slider").slick({
    slidesToShow: 4,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 920,
        settings: {
          arrows: true,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          arrows: true,
          slidesToShow: 1
        }
      }
    ]
  });

  // tabs
  $(".info-block__tab-panel-item").click(function() {
    var id = $(this).attr("data-tab"), // 1
      content = $('.info-block__tab-content[data-tab="' + id + '"]'); // 2

    $(
      ".info-block__tab-panel-item.info-block__tab-panel-item_active"
    ).removeClass("info-block__tab-panel-item_active"); // 1
    $(this).addClass("info-block__tab-panel-item_active"); // 2

    $(".info-block__tab-content.info-block__tab-content_active").removeClass(
      "info-block__tab-content_active"
    ); // 3
    content.addClass("info-block__tab-content_active"); // 4
  });

  // menu
  $(".header__burger").click(function() {
	$(".header-menu").toggleClass('header-menu_visible');
	$(".burger").toggleClass('burger_close');
  });

  // Show popup with main order buttons
  const showPopup = (btn, popupItem) => {
    btn.addEventListener('click', () => {
      productNameInput.value = 'Массажер Relax Tone (Релакс энд Тон)';
      document.addEventListener('mouseup', hidePopup);
      popupItem.classList.add('page__popup_active');
      orderForm.classList.toggle('form_active');
    });
  };
  // Show popup width add order buttons
  const showPopupHandler = (btn, popupItem, product) => {
    btn.addEventListener('click', () => {
      const productNameValue = product.textContent;
      productNameInput.value = productNameValue;
      document.addEventListener('mouseup', hidePopup);
      popupItem.classList.add('page__popup_active');
      orderForm.classList.toggle('form_active');
    });
  };

  // Hide popup with document click
  const hidePopup = (evt) => {
    if (formWrapper.contains(evt.target)) {
      evt.stopPropagation();
    } else {
      popup.classList.remove('page__popup_active');
      orderForm.classList.remove('form_active');
      $('.done').css('display', 'none');
      document.removeEventListener('mouseup', hidePopup);
    }
  };

  // Hide popup with close button
  closePopupBtn.addEventListener('click', (evt) => {
    evt.stopPropagation();
    popup.classList.remove('page__popup_active');
    orderForm.classList.remove('form_active');
    $('.done').css('display', 'none');
    document.removeEventListener('mouseup', hidePopup);
  });

  // Functions call

  for (let k = 0; k < orderAddBtn.length; k++) {
    const currentAddBtn = orderAddBtn[k];
    const currentProductName = addProductName[k];
    showPopupHandler(currentAddBtn, popup, currentProductName);
  }

  for (let j = 0; j < orderBtn.length; j++) {
    const currentBtn = orderBtn[j];
    showPopup(currentBtn, popup);
  }

  // Form handler
  $('.form').submit(function () {
    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: $(this).serialize(),
    }).done(function () {
      $(this).find('input').val();
	  dataLayer.push({ event: 'formsend' });
	  $('.form').trigger('reset');
      $('.form').removeClass('form_active');
      $('.done').css('display', 'block');
      
    });
    return false;
  });

 // close popup
 window.addEventListener('mousemove', function(e) {
  if (!getCookie('exitPopupShowed')) {
    if (e.clientY < 20) {
      $('.close-popup').fadeIn(500);
      setCookieExitPopup();
    } 
  } 
});

document.querySelector('.close-popup__overlay').addEventListener('click', function () {
  $('.close-popup').fadeOut(500);
});
document.querySelector('.close-popup__cls-btn').addEventListener('click', function () {
  $('.close-popup').fadeOut(500);
});

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

function setCookieExitPopup() {
  // +1 день от текущей даты -> let date = new Date(Date.now() + 86400e3);
    let date = new Date(Date.now() + 86400e3/3);
    date = date.toUTCString();
    document.cookie = "exitPopupShowed=true; expires=" + date;
};



})();
