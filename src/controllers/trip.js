import FiltersContainer from '../components/card-filters-container.js';
import Filter from '../components/card-filters.js';
import TripDays from '../components/trip-days.js';
import TripDay from '../components/trip-day.js';
import DayInfo from '../components/day-info.js';
import TripList from '../components/trip-list.js';
import TripCard from '../components/card.js';
import TripCardEdit from '../components/card-edit.js';
import NoCards from '../components/no-cards.js';
import {render, unrender, Position} from '../components/util.js';

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
    this._generatedFiltersData = [];
    this._generatedDayInfoData = [];
    this._generatedCardsData = [];
    this._generatedEditCardsData = [];
  }

  init() {
    // Фильтры
    // this._filters.forEach((filter) => this._renderFilter(filter));
    // render(this._container, this._filtersContainer.getElement());

    // dayInfo -> tripDay
    this._dayInfos.forEach((dayInfo) => this._renderDayInfo(dayInfo));

    // cards -> tripList
    this._cards.forEach((card) => this._generateCard(card));
    this._tripList.getElement().append(...this._generatedCardsData.map((instance) => instance.element));

    // tripList -> tripDday
    render(this._tripDay.getElement(), this._tripList.getElement());

    // tripDay -> tripDays
    render(this._tripDays.getElement(), this._tripDay.getElement());

    // trip-days -> container
    render(this._container, this._tripDays.getElement());
  }

  // _renderFilter(filter) {
  //   const filterComponent = new Filter(filter);
  //   // FIXME: логика фильтрации

  //   const filterOffers = this._filtersContainer.getElement()
  //     .querySelector(`.trip-sort__item--offers`);

  //   this._generatedFilters.push(filterComponent);
  //   this._generatedFiltersElements.push(filterComponent.getElement());
  //   render(filterOffers, filterComponent.getElement(), Position.BEFORE);
  // }

  _renderDayInfo(info) {
    const dayInfoComponent = new DayInfo(info);

    this._createDataStore(this._generatedDayInfoData, dayInfoComponent);
    render(this._tripDay.getElement(), dayInfoComponent.getElement());
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
      unrender(cardEditComponent.getElement());
      unrender(cardComponent.getElement());
      cardEditComponent.removeElement();
      cardComponent.removeElement();

      cardEditComponent.getElement().querySelector(`.event__reset-btn`).removeEventListener(`click`, onDeleteButtonClick);
      // checkPointsCount();
    };

    cardComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        enablecardEditMode();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    cardEditComponent.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, () => {
        enableCardMode();
      });

    cardEditComponent.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onDeleteButtonClick);

    this._createDataStore(this._generatedCardsData, cardComponent);
    this._createDataStore(this._generatedEditCardsData, cardEditComponent);
    // this._generatedCards.push(cardComponent);
    // this._generatedEditCards.push(cardEditComponent);
    // this._generatedCardsElements.push(cardComponent.getElement());
    // this._generatedEditCardsElements.push(cardEditComponent.getElement());
  }

  _checkPointsCount() {
    const tripEventsList = document.querySelector(`.trip-events__list`);

    return tripEventsList.childElementCount();
  }

  _clearTripRoute() {
    if (!this._checkPointsCount()) {
      const cardFilters = document.querySelector(`.trip-events__trip-sort`);
      const tripDaysElement = document.querySelector(`.trip-days`);

      unrender(cardFilters);
      unrender(tripDaysElement);
      this._clearFilters();
      this._clearCards();
      // renderNoPoints();
    }
  }

  _clearFilters() {
    this._generatedFilters.forEach((filter) => (filter._element = null));
    this._generatedFiltersElements = [];
  }

  _clearCards() {
    this._generatedCards.forEach((card) => (card._element = null));
    this._generatedEditCards.forEach((editCard) => (editCard._element = null));
    this._generatedCardsElements = [];
    this._generatedEditCardsElements = [];
  }

  _createDataStore(arr, component) {
    return arr.push({'instance': component, 'element': component.getElement()});
  }
}
