import TripInfo from './components/trip-info.js';
import Menu from './components/menu.js';
import Filter from './components/filters.js';
import TripController from './controllers/trip.js';
import RenderStats from './components/render-stats.js';
import Data from './components/data.js';
// utils
import {Position, createElement, render, getMinMaxDate, DatesOperationType} from './components/util.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

const Class = {
  VISUALLY_HIDDEN: `visually-hidden`,
  MENU_BTN_ACTIVE: `trip-tabs__btn--active`
};

const data = new Data({endPoint: END_POINT, authorization: AUTHORIZATION});
data.getCards().then((cardData) => {

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
  // const generateCards = (count) => new Array(count).fill(``).map(generateCardsItems);
  // const cardsMock = generateCards(CARDS_COUNT);

  const generateDayInfos = () => {
    let startDays = [];
    let i = 1;
    startDays = (cardData.map((card) => card.StartDate.getDate()));

    const uniqueDays = new Set(startDays);
    const dayInfo = Array.from(uniqueDays).map((day) => ({
      dayNumber: i++,
      date: day
    }));

    return dayInfo;
  };

  console.log(generateDayInfos());
  const dayInfoItems = [
    {
      dayNumber: 1,
      date: getMinMaxDate(cardData, DatesOperationType.STARTDATE_MIN)
    }];

  // Получаем информацию о маршруте для TripInfo
  const calculateRoutePoints = (points) => {
    return {
      route: points.map((point) => point.City),
      startDate: getMinMaxDate(cardData, DatesOperationType.STARTDATE_MIN),
      endDate: getMinMaxDate(cardData, DatesOperationType.ENDDATE_MAX),
    };
  };

  const routePoints = calculateRoutePoints(cardData);

  // Получаем цену всех билетов и доп. услуг
  const getTicketsSum = (points) => points.map((point) => point.TicketPrice).reduce((sum, current) => sum + current);
  const getOffersSum = (points) => (points.map((point) => point.Offers.map((offer) => offer.price)
    .reduce((sum, current) => sum + current, 0))
    .reduce((sum, current) => sum + current));

  tripPriceElement.textContent = getTicketsSum(cardData) + getOffersSum(cardData);

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

  const tripController = new TripController(tripEventsElement, cardFiltersItems, dayInfoItems, cardData);
  tripController.init();

  const renderStats = new RenderStats(cardData);
  renderStats.init();
});

