'use strict';

(function () {
// show big picture
  setTimeout(function () {
    var bigPicture = document.querySelector('.big-picture');
    var pictureToShow = window.galleryData[0];
    // add url
    bigPicture.querySelector('.big-picture__img img').setAttribute('src', pictureToShow.url);
    // add likes
    bigPicture.querySelector('.likes-count').textContent = pictureToShow.likes;
    // add comments counter
    bigPicture.querySelector('.comments-count').textContent = pictureToShow.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureToShow.description;

    // add comments
    var fragment = document.createDocumentFragment();

    pictureToShow.comments.forEach(function (currentComment) {
      var comment = document.createElement('li');
      comment.classList.add('social__comment');

      var avatar = document.createElement('img');
      avatar.classList.add('social__picture');
      avatar.setAttribute('src', currentComment.avatar);
      avatar.setAttribute('alt', 'Аватар комментатора фотографии');
      avatar.setAttribute('width', '35');
      avatar.setAttribute('height', '35');

      var commentText = document.createElement('p');
      commentText.textContent = currentComment.message;
      commentText.classList.add('social__text');

      comment.appendChild(avatar);
      comment.appendChild(commentText);

      fragment.appendChild(comment);

    });

    bigPicture.querySelector('.social__comments').appendChild(fragment);


    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
    bigPicture.classList.remove('hidden');
  }, 1000);
})();
