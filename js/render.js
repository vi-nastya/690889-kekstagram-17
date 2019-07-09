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


  var getCommentsToRender = function (comments, numShown) {
    var numCommentsToRender = 0;
    if (numShown < comments.length) {
      if (comments.length - numShown < 5) {
        numCommentsToRender = comments.length - numShown;
      } else {
        numCommentsToRender = 5;
      }
      return comments.slice(numShown, numShown + numCommentsToRender);
    } else {
      return null;
    }
  };

  var renderComments = function (comments) {
    var fragment = document.createDocumentFragment();
    comments.forEach(function (currentComment) {
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
    return fragment;
  };

  window.renderBigPicture = function (pictureToShow) {
    var bigPicture = document.querySelector('.big-picture');
    // add url
    bigPicture.querySelector('.big-picture__img img').setAttribute('src', pictureToShow.url);
    // add likes
    bigPicture.querySelector('.likes-count').textContent = pictureToShow.likes;
    // add comments counter
    bigPicture.querySelector('.comments-count').textContent = pictureToShow.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureToShow.description;

    var commentsSection = bigPicture.querySelector('.social__comments');
    var showMoreCommentsButton = bigPicture.querySelector('.comments-loader');
    showMoreCommentsButton.classList.remove('visually-hidden');
    var shownCommentsCounter = bigPicture.querySelector('.comments-count-shown');

    // add comments
    var hideMoreCommentsButton = function () {
      showMoreCommentsButton.classList.add('visually-hidden');
    };

    var shownComments = 0;
    var renderedComments = null;
    if (pictureToShow.comments.length <= 5) {
      renderedComments = renderComments(pictureToShow.comments);
      shownComments = pictureToShow.comments.length;
      hideMoreCommentsButton();
    } else {
      renderedComments = renderComments(pictureToShow.comments.slice(0, 5));
      shownComments = 5;
    }
    shownCommentsCounter.textContent = shownComments;
    commentsSection.appendChild(renderedComments);

    // показать следующие 5 комментариев
    var onMoreCommentsClick = function () {
      var newCommentsToRender = getCommentsToRender(pictureToShow.comments, shownComments);
      if (newCommentsToRender) {
        renderedComments = renderComments(newCommentsToRender);
        shownComments += newCommentsToRender.length;
        commentsSection.appendChild(renderedComments);
        shownCommentsCounter.textContent = Number(shownCommentsCounter.textContent) + newCommentsToRender.length;
        if (shownComments === pictureToShow.comments.length) {
          hideMoreCommentsButton();
        }
      }
    };

    showMoreCommentsButton.addEventListener('click', onMoreCommentsClick);


    bigPicture.classList.remove('hidden');

    var closePicture = bigPicture.querySelector('.big-picture__cancel');
    closePicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      bigPicture.classList.add('hidden');
      commentsSection.innerHTML = '';
    });
  };

})();
