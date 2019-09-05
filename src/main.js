import {generateCardsItems} from './components/data.js';
import TripInfo from './components/trip-info.js';
import Menu from './components/menu.js';
import Filter from './components/filters.js';
import TripController from './controllers/trip.js';
import RenderStats from './components/render-stats.js';
// utils
import {Position, createElement, render, getMinMaxDate, DatesOperationType} from './components/util.js';


const Class = {
  VISUALLY_HIDDEN: `visually-hidden`,
  MENU_BTN_ACTIVE: `trip-tabs__btn--active`
};

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
    label: `table`,
  },
  {
    label: `stats`
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
    dataSortType: `default`,
    isChecked: true
  },
  {
    label: `time`,
    dataSortType: `time`,
    isChecked: false
  },
  {
    label: `price`,
    dataSortType: `price`,
    isChecked: false
  }
];

// Создаём точки маршрута
const generateCards = (count) => new Array(count).fill(``).map(generateCardsItems);
const cardsMock = generateCards(CARDS_COUNT);

const dayInfoItems = [
  {
    dayNumber: 1,
    date: getMinMaxDate(cardsMock, DatesOperationType.STARTDATE_MIN)
  }];

// Получаем информацию о маршруте для TripInfo
const calculateRoutePoints = (points) => {
  return {
    route: points.map((point) => point.city),
    startDate: getMinMaxDate(cardsMock, DatesOperationType.STARTDATE_MIN),
    endDate: getMinMaxDate(cardsMock, DatesOperationType.ENDDATE_MAX),
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
  // Переключение между маршрутом и статистикой
  menu.getElement().addEventListener(`click`, (evt) => {
    const stats = document.querySelector(`.statistics`);
    if (evt.target.tagName !== `A`) {
      return;
    }
    switch (evt.target.id) {
      case `table`:
        tripController.show();
        evt.target.classList.add(Class.MENU_BTN_ACTIVE);
        stats.classList.add(Class.VISUALLY_HIDDEN);
        controlsElement.querySelector(`#stats`).classList.remove(Class.MENU_BTN_ACTIVE);
        break;
      case `stats`:
        tripController.hide();
        evt.target.classList.add(Class.MENU_BTN_ACTIVE);
        stats.classList.remove(Class.VISUALLY_HIDDEN);
        controlsElement.querySelector(`#table`).classList.remove(Class.MENU_BTN_ACTIVE);
        break;
      default:
        break;
    }
  });

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

const renderStats = new RenderStats(cardsMock);
renderStats.init();
