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
  window.galleryData = [];

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
        return window.galleryData;
      case 'new':
        return getArraySubset(window.galleryData, NEW_FILTER_SAMPLE_SIZE);
      case 'discussed': {
        // if numbers of comments are the same, sort based on URL
        return window.galleryData.slice(0).sort(function (image1, image2) {
          var rankDiff = image2.comments.length - image1.comments.length;
          rankDiff =
            rankDiff === 0 ? urlsComparator(image2.url - image1.url) : rankDiff;
          return rankDiff;
        });
      }
      default:
        return window.galleryData;
    }
  };

  var updateFilter = function (filterName) {
    var currentFilterButton = filterButtons[filterName];
    Object.values(filterButtons).forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    currentFilterButton.classList.add('img-filters__button--active');
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
    window.galleryData = loadedData;
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

  window.backend.load(successHandler, errorHandler);

  // track click on picture
  var findPictureDataByUrl = function (currentUrl) {
    return window.galleryData.filter(function (picture) {
      return picture.url === currentUrl;
    })[0];
  };

  var pictures = document.querySelector('.pictures');

  pictures.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      var currentUrl = evt.target.getAttribute('src');
      var pictureData = findPictureDataByUrl(currentUrl);
      window.renderBigPicture(pictureData);
    }
  });
})();
