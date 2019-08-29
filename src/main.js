import {generateCardsItems} from './components/data.js';
import TripInfo from './components/trip-info.js';
import Menu from './components/menu.js';
import Filter from './components/filters.js';
// import CardFilter from './components/card-filters.js';
// import CardEdit from './components/card-edit.js';
// import DayInfo from './components/day-info.js';
// import Card from './components/card.js';
import TripController from './controllers/trip.js';
// utils
import {Position, createElement, render} from './components/util.js';

const CARDS_COUNT = 4;

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
const tripPriceElement = tripInfoElement.querySelector(`.trip-info__cost-value`);

const controlsElement = document.querySelector(`.trip-controls`);

const controlsElementHeaders = controlsElement.querySelectorAll(`h2`);
const ControlsHeaders = {
  FIRST: controlsElementHeaders[0],
  SECOND: controlsElementHeaders[1]
};

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
const noPointsTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;

const dayInfoItems = [
  {
    dayNumber: 1,
    month: `Mar`,
    calendarDay: `18`
  }];

// Создаём точки маршрута
const generateCards = (count) => new Array(count).fill(``).map(generateCardsItems);
const cardsMock = generateCards(CARDS_COUNT);

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

const routePoints = calculateRoutePoints(cardsMock);

// Получаем цену всех билетов и доп. услуг
const getTicketsSum = (points) => points.map((point) => point.ticketPrice).reduce((sum, current) => sum + current);
const getOffersSum = (points) => (points.map((point) => point.offers.map((offer) => offer.price)
  .reduce((sum, current) => sum + current, 0))
  .reduce((sum, current) => sum + current));

tripPriceElement.textContent = getTicketsSum(cardsMock) + getOffersSum(cardsMock);

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
render(ControlsHeaders.FIRST, navigationContainer, Position.AFTER);

// 'Фильтры'
const filtersContainer = createElement(filtersTemplate);
const renderFilters = (filtersData) => {
  const filter = new Filter(filtersData);

  render(filtersContainer, filter.getElement());
};

filterItems.forEach((filterItem) => renderFilters(filterItem));
render(ControlsHeaders.SECOND, filtersContainer, Position.AFTER);

const tripController = new TripController(tripEventsElement, cardFiltersItems, dayInfoItems, cardsMock);
tripController.init();

// 'Фильтр карточек'

// // Контейнер для информации о дне и списка точек маршрута
// const tripDayContainer = createElement(tripDayContainerTemplate);

// // // Информация о дне
// const renderDayInfo = (dayInfoData) => {
//   const dayInfo = new DayInfo(dayInfoData);

//   render(tripDayContainer, dayInfo.getElement(dayInfoData));
// };

// renderDayInfo(dayInfoItems);

// const renderNoPoints = () => {
//   const noPointsElement = createElement(noPointsTemplate);

//   render(tripEventsElement, noPointsElement);
// };

// const checkPointsCount = () => {
//   const tripEventsList = document.querySelector(`.trip-events__list`);
//   if (tripEventsList.childElementCount === 0) {
//     const cardFilters = document.querySelector(`.trip-events__trip-sort`);
//     const tripDaysElement = document.querySelector(`.trip-days`);

//     unrender(cardFilters);
//     unrender(tripDaysElement);

//     renderNoPoints();
//   }
// };

// // Точки маршрута
// const tripEventsListContainer = createElement(tripEventsListTemplate);
// const renderCard = (cardsData) => {
//   const card = new Card(cardsData);
//   const cardEdit = new CardEdit(cardsData);

//   const enableCardMode = () => cardEdit.getElement().replaceWith(card.getElement());
//   const enablecardEditMode = () => card.getElement().replaceWith(cardEdit.getElement());

//   const onEscKeyDown = (evt) => {
//     if (evt.key === `Escape`) {
//       enableCardMode();
//       document.removeEventListener(`keydown`, onEscKeyDown);
//     }
//   };

//   const onDeleteButtonClick = () => {
//     unrender(cardEdit.getElement());
//     unrender(card.getElement());
//     cardEdit.removeElement();
//     card.removeElement();
//     cardEdit.getElement().querySelector(`.event__reset-btn`).removeEventListener(`click`, onDeleteButtonClick);
//     checkPointsCount();
//   };

//   card.getElement()
//     .querySelector(`.event__rollup-btn`)
//     .addEventListener(`click`, () => {
//       enablecardEditMode();
//       document.addEventListener(`keydown`, onEscKeyDown);
//     });

//   cardEdit.getElement()
//     .querySelector(`.event__save-btn`)
//     .addEventListener(`click`, () => {
//       enableCardMode();
//     });

//   cardEdit.getElement()
//     .querySelector(`.event__reset-btn`)
//     .addEventListener(`click`, onDeleteButtonClick);

//   render(tripEventsListContainer, card.getElement(cardsData));
// };

// initialCards.forEach((initialCard) => renderCard(initialCard));

// const tripDaysContainer = createElement(tripDaysContainerTemplate);
// render(tripDaysContainer, tripDayContainer);
// render(tripDayContainer, tripEventsListContainer);
// render(tripEventsElement, tripDaysContainer);
