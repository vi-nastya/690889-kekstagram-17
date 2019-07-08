'use strict';
(function () {
  // create html elements for pictures

  var renderPicture = function (picture) {
    var pictureTemplate = document.querySelector('#picture').content.querySelector('a');
    var pictureElement = pictureTemplate.cloneNode(true);
    var image = pictureElement.querySelector('img');
    image.src = picture.url;

    var likes = pictureElement.querySelector('.picture__likes');
    likes.textContent = picture.likes;

    var comments = pictureElement.querySelector('.picture__comments');
    comments.textContent = picture.comments.length;
    return pictureElement;
  };

  var cleanGallery = function () {
    var pictures = document.querySelector('.pictures');
    var images = pictures.querySelectorAll('.picture');
    Array.from(images).forEach(function (node) {
      pictures.removeChild(node);
    });
  };

  window.render = function (picturesData) {
    cleanGallery();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < picturesData.length; i++) {
      fragment.appendChild(renderPicture(picturesData[i]));
    }
    // insert to .pictures
    var pictures = document.querySelector('.pictures');
    pictures.appendChild(fragment);

  };

})();
