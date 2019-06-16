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
