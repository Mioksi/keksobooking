'use strict';

var ADS_AMOUNT = 8;
var MAX_PRICE = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3, 100];
var GUESTS = [0, 1, 2, 3];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LEFT_BUTTON_MOUSE = 1;
var ENTER_KEY = 'Enter';

var Pin = {
  WIDTH: 50,
  HEIGHT: 70,
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};
var PinMain = {
  WIDTH: 62,
  HEIGHT: 62,
  X: 570,
  Y: 375
};
// var typesTranslate = {
//   flat: 'Квартира',
//   bungalo: 'Бунгало',
//   house: 'Дом',
//   palace: 'Дворец'
// };
var numberOfGuests = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};
var ads = [];

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = mapPins.querySelector('.map__pin--main');
var mapFilters = map.querySelector('.map__filters-container');
var mapFiltersElements = mapFilters.querySelectorAll('.map__filter');
var mapFilterFeatures = mapFilters.querySelector('.map__features');

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddress = adForm.querySelector('input[name=address]');
var selectRooms = adForm.querySelector('select[name=rooms]');
var selectCapacity = adForm.querySelector('select[name=capacity]');
var capacityOptions = selectCapacity.querySelectorAll('option');

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomLengthArray = function (array) {
  var randomIndex = Math.floor(Math.random() * array.length + 1);

  return array.slice(0, randomIndex);
};

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getAvatarSrc = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

var createAdsArray = function (adsAmount) {
  for (var i = 0; i < adsAmount; i++) {
    var locationX = getRandomInteger(Pin.MIN_X, Pin.MAX_X);
    var locationY = getRandomInteger(Pin.MIN_Y, Pin.MAX_Y);

    var ad = {
      author: {
        avatar: getAvatarSrc(i)
      },

      offer: {
        title: '',
        address: locationX + ', ' + locationY,
        price: getRandomInteger(0, MAX_PRICE),
        type: getRandomElement(TYPES),
        rooms: getRandomElement(ROOMS),
        guests: getRandomElement(GUESTS),
        checkin: getRandomElement(TIMES),
        checkout: getRandomElement(TIMES),
        features: getRandomLengthArray(FEATURES),
        description: '',
        photos: getRandomLengthArray(PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };

    ads.push(ad);
  }
};

var generatePin = function (ad) {
  var adElement = pinTemplate.cloneNode(true);

  adElement.style.left = ad.location.x - Pin.WIDTH / 2 + 'px';
  adElement.style.top = ad.location.y - Pin.HEIGHT + 'px';
  adElement.querySelector('img').src = ad.author.avatar;
  adElement.querySelector('img').alt = ad.offer.title;

  return adElement;
};

var renderAllPins = function (adsAmount) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adsAmount; i++) {
    fragment.appendChild(generatePin(ads[i]));
  }

  mapPins.appendChild(fragment);
};

// var generateFeatures = function (features, cardElement) {
//   var popupFeatures = cardElement.querySelector('.popup__features');
//   var popupFeature = popupFeatures.querySelector('.popup__feature');

//   popupFeatures.innerHTML = '';

//   for (var i = 0; i < features.length; i++) {
//     var featureElement = popupFeature.cloneNode(true);

//     featureElement.className = 'popup__feature popup__feature--' + features[i];

//     popupFeatures.appendChild(featureElement);
//   }
// };

// var generatePhotos = function (photos, cardElement) {
//   var popupPhotos = cardElement.querySelector('.popup__photos');
//   var popupPhoto = popupPhotos.querySelector('.popup__photo');

//   popupPhotos.innerHTML = '';

//   for (var i = 0; i < photos.length; i++) {
//     var photoElement = popupPhoto.cloneNode(true);

//     photoElement.src = photos[i];

//     popupPhotos.appendChild(photoElement);
//   }
// };

// var generateCard = function (card) {
//   var cardElement = cardTemplate.cloneNode(true);

//   cardElement.querySelector('.popup__title').textContent = card.offer.title;
//   cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
//   cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
//   cardElement.querySelector('.popup__type').textContent = typesTranslate[card.offer.type];
//   cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
//   cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
//   cardElement.querySelector('.popup__description').textContent = card.offer.description;
//   cardElement.querySelector('.popup__avatar').src = card.author.avatar;

//   generateFeatures(card.offer.features, cardElement);
//   generatePhotos(card.offer.photos, cardElement);

//   return cardElement;
// };

// var renderCard = function (adsAmount) {
//   mapFilters.insertAdjacentElement('beforebegin', generateCard(adsAmount));
// };

var toggleDisabledElements = function (elements, boolean) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = boolean;
  }
};

var activateMap = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  mapFilterFeatures.disabled = false;

  createAdsArray(ADS_AMOUNT);
  renderAllPins(ADS_AMOUNT);
  // renderCard(ads[0]);
  toggleDisabledElements(adFormFieldsets, false);
  toggleDisabledElements(mapFiltersElements, false);
  getAddressValue();
  validateRooms();

  selectRooms.addEventListener('change', onRoomNumberChange);
};

var getPinCoordinates = function () {
  var x = map.classList.contains('map--faded') ? PinMain.X + PinMain.WIDTH / 2 : PinMain.X + Pin.WIDTH / 2;
  var y = map.classList.contains('map--faded') ? PinMain.Y + PinMain.HEIGHT / 2 : PinMain.Y + Pin.HEIGHT;

  return x + ', ' + y;
};

var getAddressValue = function () {
  adFormAddress.value = getPinCoordinates();
};

var validateRooms = function () {
  var roomValue = selectRooms.value;

  for (var i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = !numberOfGuests[roomValue].includes(capacityOptions[i].value);
  }

  if (selectRooms.value === '100') {
    selectCapacity.value = '0';
  } else {
    selectCapacity.value = '1';
  }
};

var onRoomNumberChange = function () {
  validateRooms();
};

var onPinClick = function (evt) {
  if (evt.which === LEFT_BUTTON_MOUSE) {
    activateMap();
  }
};

var onPinEnterPress = function (evt) {
  if (evt.key === ENTER_KEY) {
    activateMap();
  }
};

mapFilterFeatures.disabled = true;
selectCapacity.value = '1';

toggleDisabledElements(adFormFieldsets, true);
toggleDisabledElements(mapFiltersElements, true);
getAddressValue();

mapPinMain.addEventListener('mousedown', onPinClick);
mapPinMain.addEventListener('keydown', onPinEnterPress);
