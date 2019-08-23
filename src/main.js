import {generateCardsItems} from './components/data.js';
import {generateTripInfoTemplate} from './components/trip-info.js';
import {generateNavButtonTemplate} from './components/menu.js';
import {generateFilterButtonTemplate} from './components/filters.js';
import {generateCardFilterButtonTemplate} from './components/card-filters.js';
import {generateCardEditTemplate} from './components/card-edit.js';
import {generateDayInfoTemplate} from './components/day-info.js';
import {generateCardTemplate} from './components/card.js';
//  flatpickr
// import flatpickr from 'flatpickr';

const CARDS_COUNT = 4;
const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripPriceElement = tripInfoElement.querySelector(`.trip-info__cost-value`);

const controlsElement = document.querySelector(`.trip-controls`);
const controlsElementHeaders = controlsElement.querySelectorAll(`h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

const navigationTemplate = `<nav class="trip-controls__trip-tabs  trip-tabs"></nav>`;
const menuButtons = [
  {
    label: `Table`,
    extraClass: ` trip-tabs__btn--active`
  },
  {
    label: `Stats`
  }
];

const filterButtons = [
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

const cardFiltersButtons = [
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

const dayInfo = {
  dayNumber: 1,
  month: `Mar`,
  calendarDay: `18`
};

// Создаём точки маршрута
const generateCards = (count) => new Array(count).fill(``).map(generateCardsItems);
const initialCards = generateCards(CARDS_COUNT);

// Получаем информацию о маршруте для хедера
const calculateRoutePoints = (points) => {
  let minDates = [];
  let maxDates = [];

  points.map(function (point) {
    minDates.push(point.startDate);
    maxDates.push(point.endDate);
  });

  const maxDate = new Date(Math.max.apply(null, maxDates));
  const minDate = new Date(Math.min.apply(null, minDates));

  return {
    route: points.map((point) => point.city),
    startDate: minDate,
    endDate: maxDate,
  };
};

// Получаем сумму билетом и доп. услуг
const getTotalSum = (points) => {
  const ticketsSum = points.map((point) => point.ticketPrice).reduce((sum, current) => sum + current, 0);
  const offersSum = (points.map((point) => point.offers.map((offer) => offer.price)
    .reduce((sum, current) => sum + current, 0))
    .reduce((sum, current) => sum + current, 0));

  return ticketsSum + offersSum;
};

tripPriceElement.textContent = getTotalSum(initialCards);

// 1) Создаём контейнер
const createContainer = (template) => {
  const element = document.createElement(`template`);

  element.innerHTML = template.trim();

  return element.content.firstChild;
};

// 2) Заполняем контейнер
const appendToContainer = (container, template, position = `beforeEnd`) => {
  container.insertAdjacentHTML(position, template);

  return container;
};

// 3) Рендерим в DOM
const renderElement = (container, element, position = `beforeEnd`) => {
  container.insertAdjacentElement(position, element);
};

// Информация о маршруте
appendToContainer(tripInfoElement, generateTripInfoTemplate(calculateRoutePoints(initialCards)), `afterBegin`);

// 'Меню'
const navigationContainer = createContainer(navigationTemplate);

appendToContainer(navigationContainer, generateNavButtonTemplate(menuButtons));
renderElement(controlsElementHeaders[0], navigationContainer, `afterEnd`);

// 'Фильтры'
const filtersContainer = createContainer(filtersTemplate);

appendToContainer(filtersContainer, generateFilterButtonTemplate(filterButtons));
renderElement(controlsElementHeaders[1], filtersContainer, `afterEnd`);

// 'Фильтр карточек'
const cardFiltersContainer = createContainer(cardFiltersTemplate);
const cardFiltersDecorativeElements = cardFiltersContainer.querySelectorAll(`span`);

appendToContainer(cardFiltersDecorativeElements[0], generateCardFilterButtonTemplate(cardFiltersButtons), `afterEnd`);
renderElement(tripEventsElement, cardFiltersContainer);

// // Контейнер для информации о дне и списка точек маршрута
const tripDayContainer = createContainer(tripDayContainerTemplate);

// // Информация о дне
appendToContainer(tripDayContainer, generateDayInfoTemplate(dayInfo));

// 'Редактирование карточки'
const tripEventsListContainer = createContainer(tripEventsListTemplate);
appendToContainer(tripEventsListContainer, generateCardEditTemplate(initialCards.shift()));

// Точки маршрута
appendToContainer(tripEventsListContainer, initialCards.map(generateCardTemplate).join(``));

const tripDaysContainer = createContainer(tripDaysContainerTemplate);
renderElement(tripDaysContainer, tripDayContainer);
renderElement(tripDayContainer, tripEventsListContainer);
renderElement(tripEventsElement, tripDaysContainer);

// const startTimeElement = document.querySelector(`#event-start-time-1`);
// flatpickr(startTimeElement, {});
