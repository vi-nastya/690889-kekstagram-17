'use strict';
(function () {
  var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var NAMES = ['Артем', 'Вика', 'Ира', 'Кирилл', 'Кристина', 'Олег', 'Сергей', 'Юля'];
  var MAX_COMMENTS = 5;
  var NUMBER_OF_AVATARS = 6;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;

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

  window.makePicture = function (pictureNumber) {
    var picture = {};
    picture.url = 'photos/' + (pictureNumber + 1) + '.jpg';
    picture.likes = Math.floor(Math.random() * (MAX_LIKES - MIN_LIKES) + MIN_LIKES);
    picture.comments = generateCommentsForPicture();
    return picture;
  };
})();
