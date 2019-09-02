import FiltersContainer from '../components/card-filters-container.js';
import Filter from '../components/card-filters.js';
import TripDays from '../components/trip-days.js';
import TripDay from '../components/trip-day.js';
import DayInfo from '../components/day-info.js';
import TripList from '../components/trip-list.js';
import TripCard from '../components/card.js';
import TripCardEdit from '../components/card-edit.js';
import NoCards from '../components/no-cards.js';
import {render, unrender} from '../components/util.js';

export default class TripController {
  constructor(container, filters, dayInfos, cards) {
    this._container = container;
    this._filtersContainer = new FiltersContainer();
    this._filters = filters;
    this._tripDays = new TripDays();
    this._tripDay = new TripDay();
    this._dayInfos = dayInfos;
    this._tripList = new TripList();
    this._cards = cards;
    this._noCards = new NoCards();
    this._generatedFiltersData = [];
    this._generatedDayInfoData = [];
    this._generatedCardsData = [];
    this._generatedEditCardsData = [];
  }

  init() {
    // Фильтры точек маршрута
    this._filters.forEach((filter) => this._generateFilter(filter));
    this._renderFilter();

    // Информация о глобальной точке маршрута
    this._dayInfos.forEach((dayInfo) => this._generateDayInfo(dayInfo));
    this._renderDayInfo();

    // Точки маршрута
    this._cards.forEach((card) => this._generateCard(card));
    this._renderCards();

    // Заполнение контейнеров и рендер
    render(this._container, this._filtersContainer.getElement());
    render(this._tripDay.getElement(), this._tripList.getElement());
    render(this._tripDays.getElement(), this._tripDay.getElement());
    render(this._container, this._tripDays.getElement());
  }

  _generateFilter(filter) {
    const filterComponent = new Filter(filter);

    const onSortLinkClick = (evt) => {

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      switch (evt.target.dataset.sortType) {
        case `price`:
          const sortedByPrice = this._generatedCardsData.slice().sort((a, b) => a.instance._ticketPrice - b.instance._ticketPrice);
          this._renderCards(sortedByPrice);
          break;
        case `time`:
          const sortedByTime = this._generatedCardsData.slice().sort((a, b) => a.instance._startDate - b.instance._startDate);
          this._renderCards(sortedByTime);
          break;
        case `default`:
          this._renderCards();
          break;
      }
    };
    filterComponent.getElement().addEventListener(`click`, onSortLinkClick);

    this._createDataStore(this._generatedFiltersData, filterComponent);
  }

  _renderFilter() {
    const filterOffers = this._filtersContainer.getElement()
      .querySelector(`.trip-sort__item--offers`);

    filterOffers.before(...this._generatedFiltersData.map((instance) => instance.element));
  }

  _generateDayInfo(info) {
    const dayInfoComponent = new DayInfo(info);

    this._createDataStore(this._generatedDayInfoData, dayInfoComponent);
  }

  _renderDayInfo() {
    this._tripDay.getElement().append(...this._generatedDayInfoData.map((instance) => instance.element));
  }

  // Удаление объекта из массива сгенерированных данных
  _removeGeneratedComponent(generatedArray, component) {
    const elementIndex = generatedArray.findIndex((currentElement) => currentElement.instance === component);
    generatedArray.splice(elementIndex, 1);
  }

  _generateCard(card) {
    const cardComponent = new TripCard(card);
    const cardEditComponent = new TripCardEdit(card);

    const enableCardMode = () => cardEditComponent.getElement().replaceWith(cardComponent.getElement());
    const enablecardEditMode = () => cardComponent.getElement().replaceWith(cardEditComponent.getElement());

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        enableCardMode();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onDeleteButtonClick = () => {
      this._removeGeneratedComponent(this._generatedCardsData, cardComponent);
      this._removeGeneratedComponent(this._generatedEditCardsData, cardEditComponent);

      unrender(cardEditComponent.getElement());
      unrender(cardComponent.getElement());
      cardEditComponent.removeElement();
      cardComponent.removeElement();

      cardEditComponent.getElement().querySelector(`.event__reset-btn`)
        .removeEventListener(`click`, onDeleteButtonClick);

      if (!this._checkPointsCount()) {
        this._clearTripRoute();
      }
    };

    cardComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        enablecardEditMode();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    cardEditComponent.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(cardEditComponent.getElement().querySelector(`.event--edit`));
        const formOffers = formData.getAll(`event-offer`);

        const updateOffers = () => {
          let updatedOffers = [];

          cardEditComponent.getOffers().forEach((offer) => {
            offer.isChecked = false;
            if (formOffers.length > 0) {
              formOffers.forEach((formOffer) => {
                if (offer.name === formOffer) {
                  offer.isChecked = true;
                }
              });
            }
            updatedOffers.push(offer);

            return updatedOffers;
          });
        };

        const entry = {
          type: formData.get(`event-type`),
          city: formData.get(`event-destination`),
          startDate: formData.get(`event-start-time`),
          endDate: formData.get(`event-end-time`),
          ticketPrice: formData.get(`event-price`),
          offers: updateOffers()
        };

        enableCardMode();
      });

    cardEditComponent.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onDeleteButtonClick);

    this._createDataStore(this._generatedCardsData, cardComponent);
    this._createDataStore(this._generatedEditCardsData, cardEditComponent);
  }

  _renderCards(cardsData = this._generatedCardsData) {
    this._tripList.getElement().append(...cardsData.map((instance) => instance.element));
  }

  _checkPointsCount() {
    const tripEventsList = document.querySelector(`.trip-events__list`);

    return tripEventsList.childElementCount;
  }

  _clearTripRoute() {
    const cardFilters = document.querySelector(`.trip-events__trip-sort`);
    const tripDaysElement = document.querySelector(`.trip-days`);

    unrender(cardFilters);
    unrender(tripDaysElement);
    this._clearData(this._generatedFiltersData);
    this._clearData(this._generatedDayInfoData);
    this._clearData(this._generatedCardsData);
    this._clearData(this._generatedEditCardsData);

    this._renderNoCards();
  }

  _clearData(data) {
    data.forEach(function (obj) {
      obj.instance.removeElement();
      obj.element = ``;
    });
  }

  _createDataStore(arr, component) {
    return arr.push({'instance': component, 'element': component.getElement()});
  }

  _renderNoCards() {
    render(this._container, this._noCards.getElement());
  }
}
