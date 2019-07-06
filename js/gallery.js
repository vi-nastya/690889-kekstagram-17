'use strict';

//(function () {
  var filters = document.querySelector('.img-filters');

  var filterButtons = {
    popular: document.querySelector('#filter-popular'),
    new: document.querySelector('#filter-new'),
    discussed: document.querySelector('#filter-discussed')
  };

  var currentFilter = 'popular';

  var data = [];
  // sorting functions
  // popular - ничего не менять
  // new - 10 случайных неповторяющихся
  // discussed - по комментариям


  var getArraySubset = function (array, size) {
    var results = [];
    var subsetInd = {};
    while (results.length < size && results.length < array.length) {
      var index = Math.trunc(Math.random() * array.length);
      if (!subsetInd[index]) {
        results.push(array[index]);
        subsetInd[index] = true;
      }
    }
    return results;
  };


  var urlsComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  var updateGalleryData = function () {
    switch (currentFilter) {
      case 'popular':
        return data;
      case 'new':
        return getArraySubset(data, 10);
      case 'discussed': {
        // if numbers of comments are the same, sort based on URL
        return data.slice(0).sort(function (image1, image2) {
          var rankDiff = image2.comments.length - image1.comments.length;
          if (rankDiff === 0) {
            rankDiff = urlsComparator(image2.url - image1.url);
          }
          return rankDiff;
        });
      }
      default:
        return data;
    }
  };

  var generateButtonEventListener = function (filterName, filterButton) {
    filterButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      Object.values(filterButtons).forEach(function (button) {
        button.classList.remove('img-filters__button--active');
      });
      filterButton.classList.add('img-filters__button--active');
      currentFilter = filterName;
      window.render(updateGalleryData());
    });
  };

  var successHandler = function (loadedData) {
    data = loadedData;
    window.render(updateGalleryData(data));
    filters.classList.remove('img-filters--inactive');

    Object.entries(filterButtons).forEach(function ([filterName, filterButton]) {
      generateButtonEventListener(filterName, filterButton);
    });
  };


  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style =
      'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(successHandler, errorHandler);
//})();
