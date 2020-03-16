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
    if (requredItems[item].type === "checkbox") {
      if (!requredItems[item].checked) {
        requredItems[item].classList.add('form__input--error');
        error = true;
      }
    } else if (requredItems[item].value === "") {
      requredItems[item].classList.add('form__input--error');
      error = true;
    }
  }
  if (error === true) { /*если есть ошибка*/
    event.preventDefault();
    if (form.querySelector('.form__message--error')) { form.querySelector('.form__message--error').classList.add('form__message--error--visible'); }
    if (form.querySelector('.form__message--ok') && form.querySelector('.form__message--ok').classList.contains('form__message--ok--visible')) {
      form.querySelector('.form__message--ok').classList.remove('form__message--ok--visible');
    }
  }
  else { /*если нет ошибки - отправляем форму*/
    event.preventDefault();
    if (form.querySelector('.form__message--ok')) { form.querySelector('.form__message--ok').classList.add('form__message--ok--visible'); }
    if (form.querySelector('.form__message--error') && form.querySelector('.form__message--error').classList.contains('form__message--error--visible')) {
      form.querySelector('.form__message--error').classList.remove('form__message--error--visible');
    }
    sendAjaxForm(form); //отправка формы
  }
}

function sendAjaxForm(dataForm) {
  $.ajax({
    url: dataForm.action, //url страницы jquery-mailer.php
    type: "POST", //метод отправки
    data: $(dataForm).serialize(),  // Сеарилизуем объект
    success: function (response) { //Данные отправлены успешно
      console.log('ok');
      $(dataForm)[0].reset();
    },
    error: function (response) { // Данные не отправлены          
      console.log('error');
      $(dataForm)[0].reset();
    }
  });
}

//Изменение кол-ва единиц в input по клику на +/-
var fieldsNum = document.querySelectorAll('.form-num__block');
if (fieldsNum) {
  for (var item = 0; item < fieldsNum.length; item++) {
    fieldsNum[item].addEventListener('click', changeValueInputByButton);
    fieldsNum[item].addEventListener('change', changeValueInput);
  }
}
function changeValueInputByButton(event) {
  let eventTarget = event.target;
  let parent = eventTarget.closest('.form-num__block');
  let fieldNum = parent.querySelector('.form-num__input');
  let change = 0; //изменение
  let step = +fieldNum.step || 1; //шаг
  if (eventTarget.classList.contains('form-num__btn-minus')) {
    change = -step;
  } else if (eventTarget.classList.contains('form-num__btn-plus')) {
    change = +step;
  }
  let newCount = +fieldNum.value + change;
  fieldNum.value = newCount;

  //создаем событие изменения значения form-num__input - чтобы не дублировать условия изменения input
  var numInputChange = new Event('change', { bubbles: true, cancelable: true });
  fieldNum.dispatchEvent(numInputChange); //вызываем событие
}
//Изменение кол-ва единиц в input по заполнению
function changeValueInput(event) {
  let eventTarget = event.target
  let minNum = +eventTarget.min || 1; //минимальное значение
  let maxNum = +eventTarget.max || Infinity; //максимальное значение
  let valueInput = +(eventTarget.value);
  if (valueInput < minNum) {
    eventTarget.value = minNum;
    alert(`Количество не может быть меньше ${minNum}`);
  }
  else if (valueInput > maxNum) {
    eventTarget.value = maxNum;
    alert(`Количество не может быть больше ${maxNum}`);
  }

  var inputNumberChangeEvent = new Event('input-number-change', { bubbles: true, cancelable: true }); //создаем событие 'input-number-change'
  eventTarget.dispatchEvent(inputNumberChangeEvent); //вызываем срабатывание события
}

//Сумма заказа
if (document.querySelector('.basket-block')) {

  //price - цена
  //amount - количество
  //cost - стоимость
  //orderPrice - сумма заказа

  function costItem(card) {
    var price = card.querySelector('.price').innerText;
    price = parseFloat(price.replace(",", ".").replace(/[^0-9.]/gim, ""));
    var amout = +card.querySelector('.amount').value;
    var cost = (price * amout).toLocaleString();
    card.querySelector('.cost').innerHTML = cost + ' ₽';
  }
  function costAllItems() {
    var cardItem = document.querySelectorAll('.card');
    for (var i = 0; i < cardItem.length; i++) {
      costItem(cardItem[i]);
    }
  }
  costAllItems();  
  
  function orderPrice() {    
    var cardItem = document.querySelectorAll('.card');
    var summ = 0;
    for (var i = 0; i < cardItem.length; i++) {
      var cost = cardItem[i].querySelector('.cost').innerText;      
      cost = parseFloat(cost.replace(",", ".").replace(/[^0-9.]/gim, ""));
      summ = summ + cost;
    }
    var orderPriceArr = document.querySelectorAll('.orderPrice');
    for (var j = 0; j < orderPriceArr.length; j++) {
      orderPriceArr[j].innerHTML = summ.toLocaleString() + ' ₽';
    }
  }
  orderPrice();

  document.addEventListener('input-number-change', changeCost);
  function changeCost(event) {
    var eventTarget = event.target;
    var card = eventTarget.closest('.card');
    costItem(card);
    orderPrice();
  }

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
      && (search.has(element.target).length === 0)) { // и не по его дочерним элементам
      searchClose(); // скрываем его
    }
  })

  // Авторизация
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
      && (authorizationPopup.has(element.target).length === 0)) { // и не по его дочерним элементам
      authorizationHide(); // скрываем его
    }
  })

  /*Бургер*/
  function MobBurger(e) {
    e.preventDefault();
    $('#burger').toggleClass('burger--open');
    $('#top-menu').toggleClass('top-menu__menu--open');
    $('.body').toggleClass('on-popup');
  }
  $("#burger").on("click", MobBurger);

  // Проверка версии
  var isMobile;
  var isIpad;
  function DeviceFunction() {
    // проверка на размер экрана
    if ($(window).width() <= 960) {
      isMobile = true;
      if ($(window).width() > 670) {
        isIpad = true;
      } else {
        isIpad = false;
      }
    }
    else {
      isMobile = false;
      isIpad = false;
    }
  }
  DeviceFunction();
  // установим обработчик события resize
  $(window).resize(function () {
    DeviceFunction();
  });

  if (isMobile === true) {

    // Открытие подменюшек для моб.версии
    $(".submenu__main").on("click", submenuClick);
    function submenuClick(event) {
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
          }
          else {
            hasSubmenu.removeClass('submenu__list--open');
            $(this).parent().removeClass('submenu__main--open');
          }
        }
      } else {
        event.preventDefault();
      }
    }

    //Открытие подменюшек в подвале для моб. версии
    $(".menu-footer__name").on("click", submenuFooterOpen);
    function submenuFooterOpen(event) {
      event.preventDefault();
      var subMenu = $(this).parent().find('.menu-footer__list');
      $(this).toggleClass('menu-footer__name--open');
      subMenu.toggleClass('menu-footer__list--open');
    }

    //Открытие фильтров на моб. версии
    $('.products-filters__toggle-filters').on('click', toggleFiltersProducts);
    function toggleFiltersProducts(event) {
      event.preventDefault();
      $('.products-filters__filter-block').slideToggle(300);
    }

  }

  //promo-slider
  $('.promo-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,

    responsive: [
      {
        breakpoint: 680,
        settings: {
          arrows: false,
          dots: true,
        }
      }
    ]
  });

  //Слайдер товаров
  $('.slider-products').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          arrows: false
        }
      }
    ]
  });

  //Слайдер новостей
  $('.slider-news').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          arrows: false
        }
      }
    ]
  });

  //Слайдер фотогалереи
  $('.photogallery').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          arrows: false
        }
      }
    ]
  });

  //Модальное окошко фото
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

  //Модальное окошко фото товара
  $(".photoGoods-modal").fancybox({
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
    wrapCSS: 'fansybox-photoGoods-modal'
  });

  //Scroll Top
  $('#scroll-top').on("click", function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 1100);
  });

  //Select2
  var haveSelect = $(".products-select");
  if (haveSelect.length != 0) {
    $('.products-select select').select2({
      theme: 'theme-products-select'
    });
  };
  //sorting
  $(".products-sorting").on("click", sortingOpen);
  function sortingOpen(event) {
    event.preventDefault();
    $(this).toggleClass('products-sorting--active');
  }

  //Слайдер фотогалереи в карточке товара
  $('#goods-photo-slider').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    vertical: true,
    infinite: false,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          arrows: false,
          vertical: false,
          infinite: true,
          dots: true
        }
      }
    ]
  });
  function GoodsGalleryClick(e) {
    e.preventDefault();
    var mylink = $(this).attr('href');
    $("#goods-photo-main-photo").attr('src', mylink);
    $('#goods-photo-main-link').attr('href', mylink);
  };
  if ((isMobile === true) && (isIpad === false)) {
    $(".goods-photo__link").fancybox({
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
      wrapCSS: 'fansybox-photoGoods-modal'
    });
  } else {
    $(".goods-photo__link").on("click", GoodsGalleryClick);
  }

  $(".goods-description__more-info").on("click", goodsDescriptionOpen);
  function goodsDescriptionOpen(event) {
    event.preventDefault();
    console.log("sdfsf");
    $(this).parent().find('.goods-description__text').toggleClass('goods-description__text--open');
    $(this).toggleClass('goods-description__more-info--open');
  }

  // Popup
  function PopUpShow(e) {
    e.preventDefault();
    if ($('.body').hasClass('on-popup')) { PopUpHide(); }; //если вызов popup из другого popup
    var linkpopup = $(this).attr('href'); //значение ссылки
    $(linkpopup).fadeIn(300);
    $('.body').addClass('on-popup');

    var container = $('.popup__container');
    $('.popup').mouseup(function (element) {
      if (!container.is(element.target) // если клик был не по нашему блоку
        && (container.has(element.target).length === 0)) { // и не по его дочерним элементам
        PopUpHide(); // скрываем его
      };
    });
  };
  function PopUpHide() {
    $(".popup").fadeOut(300);
    $('.body').removeClass('on-popup');
  };
  PopUpHide();
  $(document).keydown(function (eventObject) {
    if (eventObject.which == 27) {
      PopUpHide();
    }
  });
  $(".call-popup").on("click", PopUpShow);
  $('.popup__close').on("click", PopUpHide);

  //Маска на телефон
  $(function () {
    $(".phone-mask").mask("+7 (999) 999-99-99");
  });

});

/*Полифилы для ie*/
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
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