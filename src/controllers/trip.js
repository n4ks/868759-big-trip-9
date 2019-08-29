import FiltersContainer from '../components/card-filters-container.js';
import Filter from '../components/card-filters.js';
import TripDays from '../components/trip-days.js';
import TripDay from '../components/trip-day.js';
import DayInfo from '../components/day-info.js';
import TripList from '../components/trip-list.js';
import TripCard from '../components/card.js';
import TripCardEdit from '../components/card-edit.js';
import {render, Position} from '../components/util.js';

export default class TripController {
  constructor(container, filters, dayInfos, cards) {
    this._container = container;
    this._filtersContainer = new FiltersContainer();
    this._filters = filters;
    this._generatedFilters = [];
    this._tripDays = new TripDays();
    this._tripDay = new TripDay();
    this._dayInfos = dayInfos;
    this._tripList = new TripList();
    this._cards = cards;
    this._generatedCards = [];
    this._generatedEditCards = [];
    this._generatedCardsElements = [];
    this._generatedEditCardsElements = [];
  }

  init() {
    // Фильтры
    this._filters.forEach((filter) => this._renderFilter(filter));
    render(this._container, this._filtersContainer.getElement());

    // day-info
    this._dayInfos.forEach((dayInfo) => this._renderDayInfo(dayInfo));

    // trip-cards
    this._cards.forEach((card) => this._generateCard(card));
    this._tripList.getElement().append(...this._generatedCardsElements);

    // trip-list
    render(this._tripDay.getElement(), this._tripList.getElement());

    // day
    render(this._tripDays.getElement(), this._tripDay.getElement());

    // trip-days
    render(this._container, this._tripDays.getElement());
  }

  _renderFilter(filter) {
    const filterComponent = new Filter(filter);
    // FIXME: логика фильтрации
    this._generatedFilters.push(filterComponent);

    const filterOffers = this._filtersContainer.getElement()
      .querySelector(`.trip-sort__item--offers`);

    render(filterOffers, filterComponent.getElement(), Position.BEFORE);
  }

  _renderDayInfo(info) {
    const dayInfoComponent = new DayInfo(info);

    render(this._tripDay.getElement(), dayInfoComponent.getElement());
  }

  _generateCard(card) {
    const cardComponent = new TripCard(card);
    const cardEditComponent = new TripCardEdit(card);

    this._generatedCards.push(cardComponent);
    this._generatedEditCards.push(cardEditComponent);
    this._generatedCardsElements.push(cardComponent.getElement());
    this._generatedEditCardsElements.push(cardEditComponent.getElement());
  }
}
