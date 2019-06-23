'use strict';
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAMES = ['Артем', 'Вика', 'Ира', 'Кирилл', 'Кристина', 'Олег', 'Сергей', 'Юля'];
var MAX_COMMENTS = 5;
var NUMBER_OF_AVATARS = 6;
var NUMBER_OF_PHOTOS = 25;

var generateComment = function () {
  var comment = {};
  comment.avatar = 'img/avatar-' + Math.ceil(Math.random() * NUMBER_OF_AVATARS) + '.svg';

  var commentIndex = Math.floor(Math.random() * COMMENTS.length);
  comment.message = COMMENTS[commentIndex];

  var nameIndex = Math.floor(Math.random() * NAMES.length);
  comment.name = NAMES[nameIndex];
  return comment;
};

var generateCommentsForPicture = function () {
  var numberOfComments = Math.ceil(Math.random() * MAX_COMMENTS);
  var comments = [];
  for (var i = 0; i < numberOfComments; i++) {
    comments.push(generateComment());
  }
  return comments;
};

var makePicture = function (pictureNumber) {
  var picture = {};
  picture.url = 'photos/' + (pictureNumber + 1) + '.jpg';
  picture.likes = Math.floor(Math.random() * 185 + 15);
  picture.comments = generateCommentsForPicture();
  return picture;
};

var generatedPictures = [];
for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
  generatedPictures.push(makePicture(i));
}

// create html elements for pictures
var pictureTemplate = document.querySelector('#picture').content.querySelector('a');

var fragment = document.createDocumentFragment();

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  var image = pictureElement.querySelector('img');
  image.src = picture.url;

  var likes = pictureElement.querySelector('.picture__likes');
  likes.textContent = picture.likes;

  var comments = pictureElement.querySelector('.picture__comments');
  comments.textContent = picture.comments.length;
  return pictureElement;
};

for (i = 0; i < NUMBER_OF_PHOTOS; i++) {
  fragment.appendChild(renderPicture(generatedPictures[i]));
}

// insert to .pictures
var pictures = document.querySelector('.pictures');
pictures.appendChild(fragment);


// file upload
var fileUpload = document.querySelector('#upload-file');
var cancelUpload = document.querySelector('#upload-cancel');
var editImage = document.querySelector('.img-upload__overlay');
var image = document.querySelector('.img-upload__preview');
var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelSlider = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');

fileUpload.addEventListener('change', function () {
  editImage.classList.remove('hidden');
});

cancelUpload.addEventListener('click', function () {
  editImage.classList.add('hidden');
});

var removeFilters = function () {
  image.className = 'img-upload__preview';
};

// применить нужный эффект при изменении значения .effects__radio:checked
// для этого нужно добавить класс изображению .img-upload__preview (и удалить старый класс с эффектом)

// отслеживаем CHANGE для каждой radio
var EFFECTS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
// effects__preview--none

var effectInputs = [];
for (i = 0; i < EFFECTS.length; i++) {
  effectInputs.push(document.querySelector('#effect-' + EFFECTS[i]));
}

for (i = 0; i < effectInputs.length; i++) {
  var createListener = function (effectIndex) {
    var listener = function () {
      removeFilters();
      image.classList.add('effects__preview--' + EFFECTS[effectIndex]);

      // скрыть ползунок для эффекта, когда эффект none

      // TODO: как скрыть его в самом начале?
      if (EFFECTS[effectIndex] === 'none') {
        effectLevel.classList.add('hidden');
      } else {
        if (effectLevel.classList.contains('hidden')) {
          effectLevel.classList.remove('hidden');
        }
      }
    };

    return listener;
  };
  effectInputs[i].addEventListener('change', createListener(i));
}


// При изменении уровня интенсивности эффекта, CSS-стили элемента .img-upload__preview обновляются следующим образом:
// Для эффекта «Хром» — filter: grayscale(0..1);
// Для эффекта «Сепия» — filter: sepia(0..1);
// Для эффекта «Марвин» — filter: invert(0..100%);
// Для эффекта «Фобос» — filter: blur(0..3px);
// Для эффекта «Зной» — filter: brightness(1..3).
