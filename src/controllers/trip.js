import FiltersContainer from '../components/card-filters-container.js';
import Filter from '../components/card-filters.js';
import TripDays from '../components/trip-days.js';
import TripDay from '../components/trip-day.js';
import DayInfo from '../components/day-info.js';
import TripList from '../components/trip-list.js';
import NoCards from '../components/no-cards.js';
import PointController from '../controllers/point.js';
import {render, unrender, removeChildElements} from '../components/util.js';

export default class TripController {
  constructor(container, filters, cards, changeSummary) {
    this._container = container;
    this._filtersContainer = new FiltersContainer();
    this._filters = filters;
    this._tripDays = new TripDays();
    this._generatedDays = null;
    this._dayInfos = null;
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
    this._changeSummary = changeSummary;
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
        let sortedByPrice = this._generatedCardsData.slice().sort((a, b) => b.instance._ticketPrice - a.instance._ticketPrice);
        this._pointController.renderCards(sortedByPrice);
        this._hideDayInfo();
        sortedByPrice = [];
        break;
      case `time`:
        let sortedByTime = this._generatedCardsData.slice().sort((a, b) => b.instance._endDate - a.instance._endDate);
        this._pointController.renderCards(sortedByTime);
        this._hideDayInfo();
        sortedByTime = [];
        break;
      case `default`:
        // Переформировываем структуру если начальная дата точки была изменена пользователем
        let sortByDay = this._generatedCardsData.slice().sort((a, b) => a.instance.StartDate - b.instance.StartDate);
        this._pointController.renderCards(sortByDay);
        this._showDayInfo();
        sortByDay = [];
        break;
    }
  }

  _renderFilter() {
    const filterOffers = this._filtersContainer.getElement()
      .querySelector(`.trip-sort__item--offers`);

    filterOffers.before(...this._generatedFiltersData.map((instance) => instance.element));
  }

  // Формируем массив объектов с уникальными начальными датами и нумерацией
  _getDayInfos() {
    let startDays = [];
    let i = 1;
    startDays = (this._cards.map((card) => `${card.StartDate.getFullYear()}-${card.StartDate.getMonth() + 1}-${card.StartDate.getDate()}`));
    const uniqueDays = new Set(startDays);

    const uniqueDayInfos = Array.from(uniqueDays).map((day) => ({
      dayNumber: i++,
      date: day
    }));

    this._dayInfos = uniqueDayInfos;
  }

  _generateDayInfo(info) {
    const dayInfoComponent = new DayInfo(info);

    this._createDataStore(this._generatedDayInfoData, dayInfoComponent);
  }

  _generateDays() {
    const generatedDays = this._generatedDayInfoData.map((dayInfo) => {
      const tripDayComponent = new TripDay();
      const tripListComponent = new TripList();
      tripDayComponent.getElement().append(dayInfo.element);
      tripDayComponent.getElement().append(tripListComponent.getElement());

      return tripDayComponent.getElement();
    });

    this._generatedDays = generatedDays;
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
    this._getDayInfos();
    this._dayInfos.forEach((dayInfo) => this._generateDayInfo(dayInfo));
    this._generateDays();

    // Точки маршрута
    this._pointController = new PointController(this._generatedDays, this._cards, this._generatedCardsData, this._generatedEditCardsData, this._onDataChange, this._onDataDelete);
    this._tripDays.getElement().append(...this._generatedDays);
    render(this._container, this._tripDays.getElement());
  }

  _clearTripRoute() {
    const tripDaysElement = document.querySelector(`.trip-days`);
    const tripEventsListElement = document.querySelector(`.trip-events__list`);

    unrender(tripEventsListElement);
    removeChildElements(tripEventsListElement);
    removeChildElements(tripDaysElement);
    this._clearData(this._generatedDayInfoData);
    this._clearData(this._generatedCardsData);
    this._clearData(this._generatedEditCardsData);
    this._generatedDayInfoData = [];
    this._generatedCardsData = [];
    this._generatedEditCardsData = [];
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
    // Обновляем информацию о маршруте
    this._changeSummary(this._generatedCardsData.map((card) => card.instance));
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

  _hideDayInfo() {
    const dayInfoElements = document.querySelectorAll(`.day__info`);
    Array.from(dayInfoElements).forEach((element) => {
      element.classList.add(`visually-hidden`);
    });
  }

  _showDayInfo() {
    const dayInfoElements = document.querySelectorAll(`.day__info`);
    Array.from(dayInfoElements).forEach((element) => {
      element.classList.remove(`visually-hidden`);
    });
  }

  hidePage() {
    this._container.classList.add(`visually-hidden`);
  }

  showPage() {
    this._container.classList.remove(`visually-hidden`);
  }
}
