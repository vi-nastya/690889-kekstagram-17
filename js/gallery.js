'use strict';
(function () {
  var NUMBER_OF_PHOTOS = 25;

  var generatedPictures = [];
  for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
    generatedPictures.push(window.makePicture(i));
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
})();
