import {getPointLabel} from '../components/util.js';
import moment from 'moment';
import flatpickr from 'flatpickr';

const NEW_POINT_ID = -1;
const DECIMAL_NUMBER_SYSTEM = 10;
const PointMode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

const VALUE_IS_INT_CHECK = /^\d*$/;

const MenuButton = {
  TABLE: `Table`,
  STATS: `Stats`
};

const ElementStyle = {
  DISPLAY_BLOCK: `block`,
  DISPLAY_NONE: `none`,
  VISUALLY_HIDDEN: `visually-hidden`,
  MENU_BTN_ACTIVE: `trip-tabs__btn--active`

};

export default class EventsManager {
  constructor(controller) {
    this._controller = controller;
    this._onEscKeyDownEvt = this._onEscKeyDown.bind(this);
    this._currentPointElements = null;
    this._currentPointDestination = null;
    this._newEventBtn = null;
  }

  // Меню
  addMenuEventListeners() {
    const menuButtons = [...this._controller.menu];
    const controlsElement = document.querySelector(`.trip-controls`);
    const routeElement = document.querySelector(`.trip-events`);
    const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);

    menuButtons.forEach((button) => {
      button.getElement().addEventListener(`click`, (evt) => {
        const stats = document.querySelector(`.statistics`);
        if (evt.target.tagName !== `A`) {
          return;
        }
        switch (evt.target.id) {
          case MenuButton.TABLE:
            routeElement.classList.remove(ElementStyle.VISUALLY_HIDDEN);
            evt.target.classList.add(ElementStyle.MENU_BTN_ACTIVE);
            stats.classList.add(ElementStyle.VISUALLY_HIDDEN);
            controlsElement.querySelector(`#Stats`).classList.remove(ElementStyle.MENU_BTN_ACTIVE);
            newEventBtn.disabled = false;
            break;
          case MenuButton.STATS:
            routeElement.classList.add(ElementStyle.VISUALLY_HIDDEN);
            evt.target.classList.add(ElementStyle.MENU_BTN_ACTIVE);
            stats.classList.remove(ElementStyle.VISUALLY_HIDDEN);
            controlsElement.querySelector(`#Table`).classList.remove(ElementStyle.MENU_BTN_ACTIVE);
            newEventBtn.disabled = true;
            break;
          default:
            break;
        }
      });
    });
  }

  // Фильтрация
  addFiltersEventListener() {
    this._controller.filters.forEach((filterObj) => filterObj
      .getElement().addEventListener(`click`, this._onFilterButtonClick.bind(this)));
  }

  _onFilterButtonClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    // Обновляем тип фильттра и перерендериваем точки
    this._controller.currentFilter = evt.target.dataset.sortType;
    this._controller.updateRoute();
  }

  // Сортировка
  addSortingEventListener() {
    this._controller.sorting.forEach((sortingObj) => sortingObj
      .getElement().addEventListener(`click`, this._onSortButtonClick.bind(this)));
  }

  _onSortButtonClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    // Обновляем тип фильттра и перерендериваем точки
    this._controller.currentSorting = evt.target.dataset.sortType;
    this._controller.updateRoute();
  }

  // Точки машрута
  addPointsEventListeners() {
    this._controller.points.forEach((point) => {
      // Добавляем переключение режимов просмотра/редактирования точек
      const editModeButton = point.getElement().querySelector(`.event__rollup-btn`);
      editModeButton.addEventListener(`click`, (evt) => {
        this._onPointEditClick(evt, point);
      });

      // Добавляем сохранение изменений при редактировании
      const saveButton = point.getEditElement().querySelector(`.event__save-btn`);
      saveButton.addEventListener(`click`, (evt) => {
        this._onSaveButtonClick(evt, point);
      });

      // Удаление точки
      const deleteButton = point.getEditElement().querySelector(`.event__reset-btn`);
      deleteButton.addEventListener(`click`, (evt) => {
        this._onDeleteButtonClick(evt, point);
      });
      this._addPointsInnerListeners(point);
      // Подключаем flatpickr
      this._initFlatpickr(point);
    });
  }

  _onPointEditClick(evt, point) {
    evt.preventDefault();
    // Получаем тип текущей точки для отката значений если пользователь не сохраняет изменения
    this._controller.currentPoint = point;

    this._getEditFormElements(point);

    // Собираем данные для destination
    this._currentPointDestination = {
      description: point.description,
      pictures: point.photos
    };

    // Проверяем наличие открытых карточек и закрываем в случае необходимости
    this._onSelectAnotherChange(point);
    document.addEventListener(`keydown`, this._onEscKeyDownEvt);
  }

  _getEditFormElements(point) {
    this._currentPointElements = {
      toggleBtn: point.getEditElement().querySelector(`.event__type-toggle`),
      eventsList: point.getEditElement().querySelector(`.event__type-list`),
      eventIcon: point.getEditElement().querySelector(`.event__type-icon`),
      eventLabel: point.getEditElement().querySelector(`.event__type-output`),
    };
  }

  // Добавляем события для внутренних элементов точки (в режиме редактирования)
  _addPointsInnerListeners(point) {
    const pointForm = point.getEditElement();
    const toggleBtn = pointForm.querySelector(`.event__type-toggle`);
    const eventsList = pointForm.querySelector(`.event__type-list`);
    const cityInput = pointForm.querySelector(`.event__input--destination`);
    const priceInput = pointForm.querySelector(`.event__input--price`);

    // Получаем массив радиобаттонов с типами событий
    const typeInputs = [...point.getEditElement().querySelectorAll(`.event__type-input`)];

    toggleBtn.addEventListener(`click`, (evt) => {
      this._onToggleBtnClick(evt, eventsList);
    });
    typeInputs.forEach((input) => input.addEventListener(`change`, this._onEventTypeChange.bind(this)));

    // Вешаем событие на input с выбором города
    cityInput.addEventListener(`input`, this._onCityChange.bind(this));

    // Добавляем проверку на int для поля с ценой
    priceInput.addEventListener(`keypress`, this._onPriceInput);
  }

  _onPriceInput(evt) {
    if (!(VALUE_IS_INT_CHECK).test(evt.key)) {

      evt.preventDefault();
    }
  }

  _onToggleBtnClick(evt, eventsList) {
    eventsList.style.display = evt.target.checked ? ElementStyle.DISPLAY_BLOCK : ElementStyle.DISPLAY_NONE;
  }

  _onEventTypeChange(evt) {
    // Изменяем иконку и лейбл
    this._changePointInfo(evt.target.value);
    // Скрываем список после выбора
    this._hidePointElements();
    this._controller.loadOffers(evt.target.value);
  }

  _onCityChange(evt) {
    // Проверяем соответствует ли значение одному из доступных
    this._controller.citiesList.forEach((city) => {
      if (evt.target.value === city) {
        this._controller.loadDestination(evt.target.value);
      }
    });
  }

  // Изменяем иконку и лейбл
  _changePointInfo(type) {
    // Изменяем иконку выбранного события
    this._currentPointElements.eventIcon.src = `img/icons/${type}.png`;
    // Изменяем текст и плейсхолдер в лейбле
    this._currentPointElements.eventLabel.textContent = getPointLabel(type);
  }

  // Скрываем выпадающий список и переводим кнопку в дефолтное состояние
  _hidePointElements() {
    this._currentPointElements.eventsList.style.display = `none`;
    this._currentPointElements.toggleBtn.checked = false;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape`) {
      // Откатываем изменения и скрываем список
      this._changePointInfo(this._controller.currentPoint.type);
      this._hidePointElements();
      this._changePointMode(this._controller.editablePoint, PointMode.DEFAULT);
      // Откатываем изменения в destinations
      this._controller.updateDestination(this._currentPointDestination);
      this._controller.updateOffers(this._controller.currentPoint.offers);
      document.removeEventListener(`keydown`, this._onEscKeyDownEvt);
    }
  }

  // Переключение режима точек
  _changePointMode(point, mode) {
    if (mode === PointMode.EDIT) {
      point.getElement().replaceWith(point.getEditElement());
    } else if (mode === PointMode.DEFAULT) {
      point.getEditElement().replaceWith(point.getElement());
    }
  }

  // Перевод открытой карточки в режим просмотра
  _onSelectAnotherChange(point) {
    document.removeEventListener(`keydown`, this._onEscKeyDownEvt);
    if (this._controller.newPoint !== null) {
      this._controller.removeNewPoint();
    }

    if (this._controller.editablePoint === null) {
      this._controller.editablePoint = point;
      this._changePointMode(point, PointMode.EDIT);
    } else {
      // Откатываем изменения и скрываем список
      this._changePointInfo(this._controller.currentPoint.type);
      this._hidePointElements();

      // Откатываем изменения в destinations и offers
      this._controller.updateOffers(this._controller.currentPoint.offers);
      this._controller.updateDestination(this._currentPointDestination);

      // Переводим открытую каточку в режим просмотра, а текущую в режим редактирования
      this._changePointMode(this._controller.editablePoint, PointMode.DEFAULT);
      this._changePointMode(point, PointMode.EDIT);
      this._controller.editablePoint = point;
    }
  }

  // Сохранение изменений после редактирования
  _onSaveButtonClick(evt, point) {
    evt.preventDefault();

    // Отменяем отправку формы если не хватает данных
    const pointForm = point.getEditElement();
    const formInputs = {
      cityInput: pointForm.querySelector(`.event__input--destination`),
      startDateInput: pointForm.querySelector(`.event__input[name="event-start-time"]`),
      endtDateInput: pointForm.querySelector(`.event__input[name="event-end-time"]`),
      priceInput: pointForm.querySelector(`.event__input--price`),
    };

    for (let input in formInputs) {
      if (formInputs.hasOwnProperty(input) && formInputs[input].value.length === 0) {

        return;
      }
    }

    // Из за того что структура разметки новой точки и точки редактирования различаются делаем проверку
    let form = point.id !== NEW_POINT_ID ? point.getEditElement().querySelector(`.event--edit`) : point.getEditElement();

    const formData = new FormData(form);

    // Получаем текущее состояние офферов с формы
    const getCurrentOffersState = () => {

      const offerElements = [...point.getEditElement().querySelectorAll(`.event__offer-selector`)];
      const offersData = offerElements.map((offer) => {
        const checkboxElem = offer.querySelector(`.event__offer-checkbox`);
        const priceElem = offer.querySelector(`.event__offer-price`);
        const titleElem = offer.querySelector(`.event__offer-title`);

        return {
          title: titleElem.textContent,
          price: parseInt(priceElem.textContent, DECIMAL_NUMBER_SYSTEM),
          isChecked: checkboxElem.checked
        };
      });

      return offersData;
    };

    const getCurrentPhotos = () => {
      const newPhotos = [...point.getEditElement().querySelectorAll(`.event__photo`)];

      return newPhotos.map((photo) => ({src: photo.src, alt: photo.getAttribute(`alt`)}));
    };

    const entry = {
      id: point.id,
      type: formData.get(`event-type`),
      city: formData.get(`event-destination`),
      description: point.getEditElement().querySelector(`.event__destination-description`).textContent,
      photos: getCurrentPhotos(),
      startDate: moment(formData.get(`event-start-time`)).valueOf(),
      endDate: moment(formData.get(`event-end-time`)).valueOf(),
      ticketPrice: parseInt(formData.get(`event-price`), DECIMAL_NUMBER_SYSTEM),
      offers: getCurrentOffersState(),
      // Конвертируем в bool явно
      isFavorite: (formData.get(`event-favorite`) !== null ? true : false)
    };

    this._controller.onDataChange(point, entry);
  }

  _onDeleteButtonClick(evt, point) {
    evt.preventDefault();

    this._controller.onDataDelete(point);
  }

  // Инициализируем flatpickr
  _initFlatpickr(point) {
    const startDateInput = point.getEditElement().querySelector(`#event-start-time-1`);
    const fpStartDateInst = flatpickr(startDateInput, {
      enableTime: true,
      defaultDate: point.startDate,
      altInput: true,
      altFormat: `d.m.y H:i`,
    });

    const endDateInput = point.getEditElement().querySelector(`#event-end-time-1`);
    const fpEndDateInst = flatpickr(endDateInput, {
      enableTime: true,
      defaultDate: point.endDate,
      altInput: true,
      altFormat: `d.m.y H:i`,
      minDate: point.startDate
    });

    // Если это не карточка создания точки вставляем дату при открытии
    if (point.id !== NEW_POINT_ID) {
      point.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, (evt) => {
          // Очищаем форму здесь, иначе flatpickr не может нормально переинициализировать значение и не выводит его (ранее очищалось при переключении карточек)
          this._resetUnsavedForm(point);
          if (evt.target.classList.contains(`event__rollup-btn`)) {
            fpStartDateInst.setDate(point.startDate);
            fpEndDateInst.setDate(point.endDate);
          }
        });
    }
  }

  // Очистка формы
  _resetUnsavedForm(point) {
    point.getEditElement()
      .querySelector(`.event--edit`).reset();
  }

  // Кнопка создания нового поинта
  addNewPointEventListeners() {
    this._newEventBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._newEventBtn.addEventListener(`click`, (evt) => this._onNewEventBtnClick(evt));
  }

  _onNewEventBtnClick(evt) {
    evt.preventDefault();
    document.removeEventListener(`keydown`, this._onEscKeyDownEvt);
    // Закрываем открытые карточки
    if (this._controller.editablePoint !== null) {
      this._changePointMode(this._controller.editablePoint, PointMode.DEFAULT);
    }

    // Создаём форму
    this._controller.createNewPoint();
    this._controller.currentPoint = this._controller.newPoint;
    this._getEditFormElements(this._controller.newPoint);
    // Добавляем события для взаимодействия с элементами и flatpickr
    this._addPointsInnerListeners(this._controller.newPoint);
    this._initFlatpickr(this._controller.newPoint);
    this._newEventBtn.disabled = true;

    // Добавляем логику на кнопку сохранения
    const saveBtn = this._controller.newPoint.getEditElement().querySelector(`.event__save-btn`);

    saveBtn.addEventListener(`click`, (saveEvt) => {
      this._onSaveButtonClick(saveEvt, this._controller.newPoint);
    });

    const cancelBtn = this._controller.newPoint.getEditElement().querySelector(`.event__reset-btn`);

    cancelBtn.addEventListener(`click`, this._onCancelBtnClick.bind(this));
  }

  _onCancelBtnClick(evt) {
    evt.preventDefault();

    this._controller.removeNewPoint();
  }
}

