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

  window.render = function (picturesData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < picturesData.length; i++) {
      fragment.appendChild(renderPicture(picturesData[i]));
    }
    // insert to .pictures
    var pictures = document.querySelector('.pictures');
    pictures.appendChild(fragment);

  };

})();
