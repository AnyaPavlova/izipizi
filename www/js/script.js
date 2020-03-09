"use strict";

/*Валидация и отправка формы*/
var formInPage = document.querySelectorAll('form');

if (formInPage) {
  for (var formItem = 0; formItem < formInPage.length; formItem++) {
    formInPage[formItem].addEventListener('click', clickForm);
    formInPage[formItem].addEventListener('change', changeForm);
  }
}

function clickForm(event) {
  var eventTarget = event.target;

  if (eventTarget.classList.contains('submit-btn')) {
    validateForm(event);
  }
}

function changeForm(event) {
  var eventTarget = event.target;

  if (eventTarget.classList.contains('form__input--error')) {
    if (eventTarget.value !== "") {
      eventTarget.classList.remove("form__input--error");
    }
  }
}

function validateForm(event) {
  var eventTarget = event.target;
  var form = eventTarget.closest('form');
  var error = false;
  var requredItems = form.querySelectorAll('input[required]');

  for (var item = 0; item < requredItems.length; item++) {
    if (requredItems[item].value === "") {
      requredItems[item].classList.add('form__input--error');
      error = true;
    }
  }

  if (error === true) {
    /*если есть ошибка*/
    event.preventDefault();

    if (form.querySelector('.form__message--error')) {
      form.querySelector('.form__message--error').classList.add('form__message--error--visible');
    }

    if (form.querySelector('.form__message--ok') && form.querySelector('.form__message--ok').classList.contains('form__message--ok--visible')) {
      form.querySelector('.form__message--ok').classList.remove('form__message--ok--visible');
    }
  } else {
    /*если нет ошибки - отправляем форму*/
    event.preventDefault();

    if (form.querySelector('.form__message--ok')) {
      form.querySelector('.form__message--ok').classList.add('form__message--ok--visible');
    }

    if (form.querySelector('.form__message--error') && form.querySelector('.form__message--error').classList.contains('form__message--error--visible')) {
      form.querySelector('.form__message--error').classList.remove('form__message--error--visible');
    }

    sendAjaxForm(form); //отправка формы
  }
}

function sendAjaxForm(dataForm) {
  $.ajax({
    url: dataForm.action,
    //url страницы jquery-mailer.php
    type: "POST",
    //метод отправки
    data: $(dataForm).serialize(),
    // Сеарилизуем объект
    success: function success(response) {
      //Данные отправлены успешно
      console.log('ok');
      $(dataForm)[0].reset();
    },
    error: function error(response) {
      // Данные не отправлены          
      console.log('error');
      $(dataForm)[0].reset();
    }
  });
}

$(document).ready(function () {
  //Открытие поиска по клику на кнопку
  function searchOpen() {
    $('#search-form').addClass('search__form--open');
  }

  $("#btn-open-search").on("click", searchOpen);

  function searchClose() {
    $('#search-form').removeClass('search__form--open');
  }

  var search = $('#search-form');
  $(document).mouseup(function (element) {
    if (!search.is(element.target) // если клик был не по нашему блоку
    && search.has(element.target).length === 0) {
      // и не по его дочерним элементам
      searchClose(); // скрываем его
    }
  }); // Авторизация

  function authorizationShow(e) {
    e.preventDefault();
    var linkautorization = $(this).attr('href'); //значение ссылки

    $(this).addClass('authorization-link--active');
    $(linkautorization).addClass('authorization-popup--open');
  }

  function authorizationHide() {
    $('.authorization-link').removeClass('authorization-link--active');
    $(".authorization-popup").removeClass('authorization-popup--open');
  }

  authorizationHide();
  $(".authorization-link").on("click", authorizationShow);
  $('.authorization-popup__close').on("click", authorizationHide);
  var authorizationPopup = $('.authorization-popup');
  $('body').mouseup(function (element) {
    if (!authorizationPopup.is(element.target) // если клик был не по нашему блоку
    && authorizationPopup.has(element.target).length === 0) {
      // и не по его дочерним элементам
      authorizationHide(); // скрываем его
    }
  });
  /*Бургер*/

  function MobBurger(e) {
    e.preventDefault();
    $('#burger').toggleClass('burger--open');
    $('#top-menu').toggleClass('top-menu__menu--open');
    $('.body').toggleClass('on-popup');
  }

  $("#burger").on("click", MobBurger); // Проверка версии

  var isMobile;

  function DeviceFunction() {
    // проверка на размер экрана
    if ($(window).width() <= 960) {
      isMobile = true;
    } else {
      isMobile = false;
    }
  }

  DeviceFunction(); // установим обработчик события resize

  $(window).resize(function () {
    DeviceFunction();
  });

  if (isMobile === true) {
    var submenuClick = function submenuClick(event) {
      var hasSubmenu = $(this).parent().find('.submenu__list');

      if (event.target.tagName === "I") {
        if (hasSubmenu.length != 0) {
          event.preventDefault();
          hasSubmenu.toggleClass('submenu__list--open');
          $(this).parent().toggleClass('submenu__main--open');
        }
      } else if (event.target.tagName === "SPAN") {
        if (hasSubmenu.length != 0) {
          if (!hasSubmenu.hasClass('submenu__list--open')) {
            event.preventDefault();
            hasSubmenu.addClass('submenu__list--open');
            $(this).parent().addClass('submenu__main--open');
          } else {
            hasSubmenu.removeClass('submenu__list--open');
            $(this).parent().removeClass('submenu__main--open');
          }
        }
      } else {
        event.preventDefault();
      }
    }; //Открытие подменюшек в подвале для моб. версии


    var submenuFooterOpen = function submenuFooterOpen(event) {
      event.preventDefault();
      var subMenu = $(this).parent().find('.menu-footer__list');
      $(this).toggleClass('menu-footer__name--open');
      subMenu.toggleClass('menu-footer__list--open');
    };

    // Открытие подменюшек для моб.версии
    $(".submenu__main").on("click", submenuClick);
    $(".menu-footer__name").on("click", submenuFooterOpen);
  } //promo-slider


  $('.promo-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    responsive: [{
      breakpoint: 680,
      settings: {
        arrows: false,
        dots: true
      }
    }]
  }); //Слайдер товаров

  $('.slider-products').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{
      breakpoint: 1260,
      settings: {
        slidesToShow: 4
      }
    }, {
      breakpoint: 960,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        arrows: false
      }
    }]
  }); //Слайдер новостей

  $('.slider-news').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{
      breakpoint: 1260,
      settings: {
        slidesToShow: 4
      }
    }, {
      breakpoint: 960,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        arrows: false
      }
    }]
  }); //Слайдер фотогалереи

  $('.photogallery').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{
      breakpoint: 1260,
      settings: {
        slidesToShow: 4
      }
    }, {
      breakpoint: 960,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 680,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        arrows: false
      }
    }]
  }); //Модальное окошко фото

  $(".photo-modal").fancybox({
    autoDimensions: false,
    fitToView: false,
    autoSize: false,
    closeClick: false,
    openEffect: 'none',
    closeEffect: 'none',
    padding: '0',
    scrolling: 'no',
    maxWidth: '90%',
    maxHeight: '90%',
    wrapCSS: 'fansybox-photo-modal'
  });
  $('#scroll-top').on("click", function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 1100);
  });
});
/*Полифилы для ie*/

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}