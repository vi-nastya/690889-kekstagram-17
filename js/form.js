'use strict';
(function () {
  var imageUploadForm = document.querySelector('.img-upload__form');
  var fileUpload = document.querySelector('#upload-file');
  var cancelUpload = document.querySelector('#upload-cancel');
  var editImage = document.querySelector('.img-upload__overlay');
  var image = document.querySelector('.img-upload__preview');
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var effectLine = document.querySelector('.effect-level__line');
  var effectLevelSlider = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var comment = document.querySelector('.text__description');
  var tagInputField = document.querySelector('.text__hashtags');

  var currentEffect = 'none';

  var closeImageEditForm = function () {
    editImage.classList.add('hidden');
  };

  var clearFormData = function () {
    imageUploadForm.reset();
  };

  // показать форму редактирования изображения
  fileUpload.addEventListener('change', function () {
    editImage.classList.remove('hidden');

    currentEffect = 'none';
    // скрываем слайдер (фильтр не выбран)
    effectLevel.classList.add('hidden');
  });

  // закрыть форму и сбросить значение #upload-file
  cancelUpload.addEventListener('click', function () {
    clearFormData();
    closeImageEditForm();
  });

  // закрыть форму при нажатии на Esc
  window.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27 && evt.target !== comment && evt.target !== tagInputField) {
      clearFormData();
      closeImageEditForm();
    }
  });

  // валидация
  comment.addEventListener('invalid', function () {
    if (comment.validity.tooLong) {
      comment.setCustomValidity('Длина комментария не должна превышать 140 символов');
    } else {
      comment.setCustomValidity('');
    }
    comment.value = '';
  });


  var removeDuplicates = function (array) {

    return array.filter(function (item, index) {
      return (array.indexOf(item) === index);
    });
  };

  // валидация тегов
  // TODO: проверить, что теги разделяются пробелами
  tagInputField.addEventListener('input', function () {
    var tags = tagInputField.value.toLowerCase().split(' ');

    // проверки на количество тегов
    if (tags.length > 5) {
      tagInputField.setCustomValidity('Количество тегов не должно быть больше 5');
    } else if (tags.length > removeDuplicates(tags).length) {
      tagInputField.setCustomValidity('Теги не должны повторяться');
    } else {
      tagInputField.setCustomValidity('');
    }

    // проверки для каждого тега
    tags.forEach(function (tag) {
      if (tag[0] !== '#') {
        tagInputField.setCustomValidity('Тег должен начинаться с символа #');
      } else if (tag.length < 2) {
        tagInputField.setCustomValidity('Тег не может состоять только из символа #');
      } else if (tag.length > 20) {
        tagInputField.setCustomValidity('Длина тега не может быть больше 20 символов');
      }
    });
  });

  var EFFECT_MAX_VALUE = 100;
  var EFFECTS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var effectFunctions = {
    'chrome': function (effectValue) {
      return 'filter: grayscale(' + effectValue / 100 + ')';
    },
    'sepia': function (effectValue) {
      return 'filter: sepia(' + effectValue / 100 + ')';
    },
    'marvin': function (effectValue) {
      return 'filter: invert(' + effectValue + '%)';
    },
    'phobos': function (effectValue) {
      return 'filter: blur(' + effectValue / 100 * 3 + 'px)';
    },
    'heat': function (effectValue) {
      return 'filter: brightness(' + (1 + effectValue / 100 * 2) + ')';
    }
  };

  var changeSliderPosition = function () {
    effectLevelDepth.style.width = effectLevelValue.value + '%';
    effectLevelSlider.style.left = effectLevelValue.value + '%';
  };

  var getEffectValue = function () {
    // длина слайдера
    var lineWidth = effectLine.getBoundingClientRect().width;
    // положение центра пина на слайдере относительно начала слайдера
    var pinCenter = effectLevelSlider.getBoundingClientRect().x + effectLevelSlider.getBoundingClientRect().width / 2 - effectLine.getBoundingClientRect().x;
    var newEffectValue = Math.round(pinCenter * EFFECT_MAX_VALUE / lineWidth);
    return newEffectValue;
  };

  var applyEffect = function () {
    image.style = effectFunctions[currentEffect](getEffectValue());
  };

  var removeEffects = function () {
    image.className = 'img-upload__preview';
    image.style.filter = '';
  };

  var effectInputs = [];
  for (var i = 0; i < EFFECTS.length; i++) {
    effectInputs.push(document.querySelector('#effect-' + EFFECTS[i]));
  }


  var onEffectChange = function (effectIndex) {
    var listener = function () {
      removeEffects();
      currentEffect = EFFECTS[effectIndex];
      image.classList.add('effects__preview--' + currentEffect);

      // скрыть ползунок для эффекта, когда эффект none
      if (currentEffect === 'none') {
        effectLevel.classList.add('hidden');
      } else {
        if (effectLevel.classList.contains('hidden')) {
          effectLevel.classList.remove('hidden');
        }
        // сбрасываем значение ползунка
        effectLevelValue.value = EFFECT_MAX_VALUE;
        changeSliderPosition();
        applyEffect(EFFECT_MAX_VALUE);
      }
    };
    return listener;
  };

  for (i = 0; i < effectInputs.length; i++) {
    effectInputs[i].addEventListener('change', onEffectChange(i));
  }

  var minSliderX;
  var maxSliderX;

  effectLevelSlider.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (currentEffect !== 'none') {
      minSliderX = effectLine.getBoundingClientRect().x;
      maxSliderX = effectLine.getBoundingClientRect().x + effectLine.getBoundingClientRect().width;
    }

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var newCoord;

      // не даем выйти за пределы слайдера
      if (moveEvt.clientX < minSliderX) {
        newCoord = minSliderX;
      } else {
        if (moveEvt.clientX > maxSliderX) {
          newCoord = maxSliderX;
        } else {
          newCoord = moveEvt.clientX;
        }
      }

      var shift = {
        x: newCoord - startCoords.x
      };

      // обновляем координаты
      startCoords = {
        x: newCoord
      };

      // длина слайдера
      var lineWidth = effectLine.getBoundingClientRect().width;
      // положение центра пина на слайдере относительно начала слайдера
      var pinCenterOld = effectLevelSlider.getBoundingClientRect().x + effectLevelSlider.getBoundingClientRect().width / 2 - effectLine.getBoundingClientRect().x;
      // новое положение центра пина
      var pinCenterNew = pinCenterOld + shift.x;

      // пересчитать новое значение эффекта
      var newEffectValue = Math.round(pinCenterNew * EFFECT_MAX_VALUE / lineWidth);
      effectLevelValue.value = newEffectValue;

      // отрисовать слайдер и полоску
      changeSliderPosition();

      // применить эффект к изображению
      applyEffect();

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  var successTemplate = document.querySelector('#success');
  var successElement = successTemplate.content.cloneNode(true);
  var successMessage = successElement.querySelector('.success');
  var successMessageInner = successElement.querySelector('.success__inner');
  var successButton = successElement.querySelector('.success__button');
  successMessage.classList.add('visually-hidden');
  document.querySelector('main').appendChild(successElement);

  var errorTemplate = document.querySelector('#error');
  var errorElement = errorTemplate.content.cloneNode(true);
  var errorMessage = errorElement.querySelector('.error');
  var errorMessageInner = errorElement.querySelector('.error__inner');
  var errorButtons = errorElement.querySelector('.error__buttons');
  errorMessage.classList.add('visually-hidden');
  document.querySelector('main').appendChild(errorElement);

  var closeSuccessMessage = function () {
    if (!successMessage.classList.contains('visually-hidden')) {
      successMessage.classList.add('visually-hidden');

      document.removeEventListener('click', onScreenClick);
      document.removeEventListener('keydown', onEsc);
    }
  };

  var closeErrorMessage = function () {
    if (!errorMessage.classList.contains('visually-hidden')) {
      errorMessage.classList.add('visually-hidden');

      document.removeEventListener('click', onScreenClick);
      document.removeEventListener('keydown', onEsc);
    }
  };

  // закрываем сообщения об успешной загрузке или ошибке при клике на кнопку
  successButton.addEventListener('click', function () {
    closeSuccessMessage();
  });

  successButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 13) {
      closeSuccessMessage();
    }
  });

  errorButtons.addEventListener('click', function (evt) {
    window.backend.save(new FormData(imageUploadForm), showSuccessMessage, showErrorMessage);

    if (evt.target.textContent === 'Попробовать снова') {
      closeErrorMessage();
    }
  });

  errorButtons.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 13) {
      closeErrorMessage();
      if (evt.target.textContent === 'Попробовать снова') {
        window.backend.save(new FormData(imageUploadForm), showSuccessMessage, showErrorMessage);
      } else {
        clearFormData();
      }
    }
  });

  // закрываем сообщение при нажатии на клавишу Esc
  var onEsc = function (evt) {
    if (evt.keyCode === 27) {
      closeSuccessMessage();
      closeErrorMessage();
    }
  };

  // закрываем сообщение по клику на произвольную область экрана
  var onScreenClick = function (evt) {
    if (evt.tagret !== successMessageInner && evt.target !== errorMessageInner) {
      closeSuccessMessage();
      closeErrorMessage();
    }
  };

  var showSuccessMessage = function () {
    if (successMessage.classList.contains('visually-hidden')) {
      successMessage.classList.remove('visually-hidden');

      // когда показываем сообщение, добавлям обработчики событий
      document.addEventListener('click', onScreenClick);
      document.addEventListener('keydown', onEsc);
    }
  };

  var showErrorMessage = function () {
    if (errorMessage.classList.contains('visually-hidden')) {
      errorMessage.classList.remove('visually-hidden');

      // когда показываем сообщение, добавлям обработчики событий
      document.addEventListener('click', onScreenClick);
      document.addEventListener('keydown', onEsc);
    }
  };


  var onSuccess = function () {
    closeImageEditForm();
    clearFormData();
    showSuccessMessage();
  };

  var onError = function () {
    closeImageEditForm();
    showErrorMessage();
  };

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(imageUploadForm), onSuccess, onError);
  });
})();
