'use strict';

(function () {
  var NEW_FILTER_SAMPLE_SIZE = 10;
  var filters = document.querySelector('.img-filters');

  var filterButtons = {
    popular: document.querySelector('#filter-popular'),
    new: document.querySelector('#filter-new'),
    discussed: document.querySelector('#filter-discussed')
  };

  var currentFilter = 'popular';
  var data = [];


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

  var applyFilterToData = function () {
    switch (currentFilter) {
      case 'popular':
        return data;
      case 'new':
        return getArraySubset(data, NEW_FILTER_SAMPLE_SIZE);
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

  var updateFilter = function (filterName) {
    var currentfilterButton = filterButtons[filterName];
    Object.values(filterButtons).forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    currentfilterButton.classList.add('img-filters__button--active');
    currentFilter = filterName;
  };

  var onFilterChange = window.debounce(function (filterName) {
    updateFilter(filterName);
    window.render(applyFilterToData());
  });

  var generateButtonEventListener = function (filterName, filterButton) {
    filterButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      onFilterChange(filterName);

    });
  };

  var successHandler = function (loadedData) {
    data = loadedData;
    window.render(applyFilterToData());
    filters.classList.remove('img-filters--inactive');

    Object.entries(filterButtons).forEach(function (keyValuePair) {
      var filterName = keyValuePair[0];
      var filterButton = keyValuePair[1];
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
})();
