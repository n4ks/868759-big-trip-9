import FiltersContainer from '../components/card-filters-container.js';
import Filter from '../components/card-filters.js';
import TripDays from '../components/trip-days.js';
import TripDay from '../components/trip-day.js';
import DayInfo from '../components/day-info.js';
import TripList from '../components/trip-list.js';
import NoCards from '../components/no-cards.js';
import PointController from '../controllers/point.js';
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
    this._pointController = null;
    this._currentFilter = `default`;

    this._onDataChange = this._onDataChange.bind(this);
    this._onDataDelete = this._onDataDelete.bind(this);
  }

  init() {
    // Фильтры точек маршрута
    this._filters.forEach((filter) => this._generateFilter(filter));
    this._renderFilter();

    // Заполнение контейнеров и рендер
    render(this._container, this._filtersContainer.getElement());
    this._renderRoute();
  }

  _generateFilter(filter) {
    const filterComponent = new Filter(filter);

    const onSortLinkClick = (evt) => {

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      this._currentFilter = evt.target.dataset.sortType;
      this._applyFilter(this._currentFilter);

    };
    filterComponent.getElement().addEventListener(`click`, onSortLinkClick);

    this._createDataStore(this._generatedFiltersData, filterComponent);
  }

  _applyFilter(filterType) {
    switch (filterType) {
      case `price`:
        const sortedByPrice = this._generatedCardsData.slice().sort((a, b) => b.instance._ticketPrice - a.instance._ticketPrice);
        this._pointController.renderCards(sortedByPrice);
        break;
      case `time`:
        const sortedByTime = this._generatedCardsData.slice().sort((a, b) => b.instance._endDate - a.instance._endDate);
        this._pointController.renderCards(sortedByTime);
        break;
      case `default`:
        this._pointController.renderCards();
        break;
    }
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

  _checkPointsCount() {
    const tripEventsList = document.querySelector(`.trip-events__list`);

    return tripEventsList.childElementCount;
  }

  _renderRoute() {
    // Информация о глобальной точке маршрута
    this._dayInfos.forEach((dayInfo) => this._generateDayInfo(dayInfo));
    this._renderDayInfo();

    // Точки маршрута
    this._pointController = new PointController(this._tripList, this._cards, this._generatedCardsData, this._generatedEditCardsData, this._onDataChange, this._onDataDelete);

    render(this._tripDay.getElement(), this._tripList.getElement());
    render(this._tripDays.getElement(), this._tripDay.getElement());
    render(this._container, this._tripDays.getElement());
  }

  _clearTripRoute() {
    const tripDaysElement = document.querySelector(`.trip-days`);
    const dayElement = document.querySelector(`.trip-days__item`);
    const dayInfoElement = document.querySelector(`.day__info`);
    const tripEventsListElement = document.querySelector(`.trip-events__list`);

    unrender(tripEventsListElement);
    while (tripEventsListElement.firstChild) {
      tripEventsListElement.removeChild(tripEventsListElement.firstChild);
    }
    unrender(dayInfoElement);
    unrender(dayElement);
    unrender(tripDaysElement);
    this._clearData(this._generatedDayInfoData);
    this._clearData(this._generatedCardsData);
    this._clearData(this._generatedEditCardsData);
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

  _onDataChange(editedCard, selectedCard, cardComponent, cardEditComponent) {
    this._cards[this._cards.findIndex((card) => card === selectedCard)] = editedCard;

    this._clearTripRoute();
    this._removeGeneratedComponent(this._generatedCardsData, cardComponent);
    this._removeGeneratedComponent(this._generatedEditCardsData, cardEditComponent);

    this._renderRoute();
    this._applyFilter(this._currentFilter);
  }

  _onDataDelete(cardComponent, cardEditComponent, currentCard) {
    const deletedCardIndex = this._cards[this._cards.findIndex((value) => value === currentCard)];
    this._cards.splice(deletedCardIndex, 1);

    this._removeGeneratedComponent(this._generatedCardsData, cardComponent);
    this._removeGeneratedComponent(this._generatedEditCardsData, cardEditComponent);

    unrender(cardEditComponent.getElement());
    unrender(cardComponent.getElement());
    cardEditComponent.removeElement();
    cardComponent.removeElement();

    if (!this._checkPointsCount()) {
      const cardFilters = document.querySelector(`.trip-events__trip-sort`);
      unrender(cardFilters);
      this._clearData(this._generatedFiltersData);
      this._clearTripRoute();
      this._renderNoCards();
    }
  }
}
