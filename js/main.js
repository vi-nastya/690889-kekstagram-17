'use strict';
var fileUpload = document.querySelector('#upload-file');
var cancelUpload = document.querySelector('#upload-cancel');
var editImage = document.querySelector('.img-upload__overlay');
var image = document.querySelector('.img-upload__preview');
var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLine = document.querySelector('.effect-level__line');
var effectLevelSlider = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');

var closeImageEditForm = function () {
  editImage.classList.add('hidden');
};

// показать форму редактирования изображения
// TODO: change не сработает, если вы попробуете загрузить ту же фотографию.
fileUpload.addEventListener('change', function () {
  editImage.classList.remove('hidden');
});

// закрыть форму и сбросить значение #upload-file
cancelUpload.addEventListener('click', function () {
  fileUpload.value = '';
  closeImageEditForm();
});

// закрыть форму при нажатии на Esc
window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    fileUpload.value = '';
    closeImageEditForm();
  }
});

var EFFECT_MIN_VALUE = 0;
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

var removeEffects = function () {
  image.className = 'img-upload__preview';
};

var effectInputs = [];
for (var i = 0; i < EFFECTS.length; i++) {
  effectInputs.push(document.querySelector('#effect-' + EFFECTS[i]));
}

var currentEffect = 'none';

var onEffectChange = function (effectIndex) {
  var listener = function () {
    removeEffects();
    currentEffect = EFFECTS[effectIndex];
    image.classList.add('effects__preview--' + currentEffect);

    // скрыть ползунок для эффекта, когда эффект none
    // TODO: как скрыть его в самом начале?
    if (currentEffect === 'none') {
      effectLevel.classList.add('hidden');
    } else {
      if (effectLevel.classList.contains('hidden')) {
        effectLevel.classList.remove('hidden');
      }
    }
  };
  return listener;
};

for (i = 0; i < effectInputs.length; i++) {
  effectInputs[i].addEventListener('change', onEffectChange(i));
}

var getEffectValue = function () {
  // длина слайдера
  var lineWidth = effectLine.getBoundingClientRect().width;
  // положение центра пина на слайдере относительно начала слайдера
  var pinCenter = effectLevelSlider.getBoundingClientRect().x + effectLevelSlider.getBoundingClientRect().width / 2 - effectLine.getBoundingClientRect().x;
  var newEffectValue = Math.round(pinCenter * EFFECT_MAX_VALUE / lineWidth);
  return newEffectValue;
};

// изменяем уровень насыщенности фильтра
effectLevelSlider.addEventListener('mouseup', function () {
  effectLevelValue.value = getEffectValue();
  image.style = effectFunctions[currentEffect](effectLevelValue.value);
});

// При переключении фильтра, уровень эффекта должен сразу cбрасываться до начального состояния,
// т.е. логика по определению уровня насыщенности должна срабатывать не только при «перемещении» слайдера,
// но и при переключении фильтров.

