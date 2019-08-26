import {generateCardsItems} from './components/data.js';
import TripInfo from './components/trip-info.js';
import Menu from './components/menu.js';
import Filter from './components/filters.js';
import CardFilter from './components/card-filters.js';
import CardEdit from './components/card-edit.js';
import DayInfo from './components/day-info.js';
import Card from './components/card.js';
// utils
import {Position, createElement, render} from './components/util.js';
//  flatpickr
// import flatpickr from 'flatpickr';

const CARDS_COUNT = 4;
const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripPriceElement = tripInfoElement.querySelector(`.trip-info__cost-value`);

const controlsElement = document.querySelector(`.trip-controls`);
const controlsElementHeaders = controlsElement.querySelectorAll(`h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

const navigationTemplate = `<nav class="trip-controls__trip-tabs  trip-tabs"></nav>`;
const menuItems = [
  {
    label: `Table`,
    extraClass: ` trip-tabs__btn--active`
  },
  {
    label: `Stats`
  }
];

const filterItems = [
  {
    label: `everything`,
    isChecked: true
  },
  {
    label: `future`,
    isChecked: false
  },
  {
    label: `past`,
    isChecked: false
  }
];

const filtersTemplate = `<form class="trip-filters" action="#" method="get"></form>`;

const cardFiltersTemplate = `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`;

const cardFiltersItems = [
  {
    label: `event`,
    isChecked: true
  },
  {
    label: `time`,
    isChecked: false
  },
  {
    label: `price`,
    isChecked: false
  }
];

const tripDaysContainerTemplate = `<ul class="trip-days"></ul>`;
const tripDayContainerTemplate = `<li class="trip-days__item  day">`;
const tripEventsListTemplate = `<ul class="trip-events__list"></ul>`;

const dayInfoItems = {
  dayNumber: 1,
  month: `Mar`,
  calendarDay: `18`
};

// Создаём точки маршрута
const generateCards = (count) => new Array(count).fill(``).map(generateCardsItems);
const initialCards = generateCards(CARDS_COUNT);

// Получаем информацию о маршруте для TripInfo
const calculateRoutePoints = (points) => {
  const minDatePoint = points.reduce((current, next) => (current.startDate < next.startDate) ? current : next);
  const maxDatePoint = points.reduce((current, next) => (current.endDate > next.endDate) ? current : next);

  return {
    route: points.map((point) => point.city),
    startDate: minDatePoint.startDate,
    endDate: maxDatePoint.endDate,
  };
};

const routePoints = calculateRoutePoints(initialCards);

// Получаем цену всех билетов и доп. услуг
const getTicketsSum = (points) => points.map((point) => point.ticketPrice).reduce((sum, current) => sum + current);
const getOffersSum = (points) => (points.map((point) => point.offers.map((offer) => offer.price)
  .reduce((sum, current) => sum + current, 0))
  .reduce((sum, current) => sum + current));

tripPriceElement.textContent = getTicketsSum(initialCards) + getOffersSum(initialCards);

// Информация о маршруте
const renderTripInfo = (tripInfoData) => {
  const tripInfo = new TripInfo(tripInfoData);

  render(tripInfoElement, tripInfo.getElement(), Position.AFTER_BEGIN);
};

renderTripInfo(routePoints);

// 'Меню'
const navigationContainer = createElement(navigationTemplate);
const renderMenu = (menuData) => {
  const menu = new Menu(menuData);

  render(navigationContainer, menu.getElement());
};

menuItems.forEach((menuItem) => renderMenu(menuItem));
render(controlsElementHeaders[0], navigationContainer, Position.AFTER);

// 'Фильтры'
const filtersContainer = createElement(filtersTemplate);
const renderFilters = (filtersData) => {
  const filter = new Filter(filtersData);

  render(filtersContainer, filter.getElement());
};

filterItems.forEach((filterItem) => renderFilters(filterItem));
render(controlsElementHeaders[1], filtersContainer, Position.AFTER);

// 'Фильтр карточек'
const cardFiltersContainer = createElement(cardFiltersTemplate);
const cardFiltersOffers = cardFiltersContainer.querySelector(`.trip-sort__item--offers`);

const renderCardFilters = (cardFiltersData) => {
  const cardFilter = new CardFilter(cardFiltersData);

  render(cardFiltersOffers, cardFilter.getElement(), Position.BEFORE);
};

cardFiltersItems.forEach((cardFilterItem) => renderCardFilters(cardFilterItem));
render(tripEventsElement, cardFiltersContainer);

// // Контейнер для информации о дне и списка точек маршрута
const tripDayContainer = createElement(tripDayContainerTemplate);

// // Информация о дне
const renderDayInfo = (dayInfoData) => {
  const dayInfo = new DayInfo(dayInfoData);

  render(tripDayContainer, dayInfo.getElement(dayInfoData));
};

renderDayInfo(dayInfoItems);

// 'Редактирование карточки'
const tripEventsListContainer = createElement(tripEventsListTemplate);
// appendToContainer(tripEventsListContainer, generateCardEditTemplate(initialCards.shift()));

// Точки маршрута
const renderCard = (cardsData) => {
  const card = new Card(cardsData);
  const cardEdit = new CardEdit(cardsData);

  card.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      card.getElement().replaceWith(cardEdit.getElement());
    });

  cardEdit.getElement()
    .querySelector(`.event__save-btn`)
    .addEventListener(`click`, () => {
      cardEdit.getElement().replaceWith(card.getElement());
    });

  render(tripEventsListContainer, card.getElement(cardsData));
};

initialCards.forEach((initialCard) => renderCard(initialCard));
// appendToContainer(tripEventsListContainer, initialCards.map(generateCardTemplate).join(``));

const tripDaysContainer = createElement(tripDaysContainerTemplate);
render(tripDaysContainer, tripDayContainer);
render(tripDayContainer, tripEventsListContainer);
render(tripEventsElement, tripDaysContainer);

// const startTimeElement = document.querySelector(`#event-start-time-1`);
// flatpickr(startTimeElement, {});
