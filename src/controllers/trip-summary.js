
import TripInfo from '../components/trip-info.js';
import {getMinMaxDate, DatesOperationType, Position, render, getMonthAsString} from '../components/util.js';

export default class SummaryController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._route = null;
    this._tripInfo = null;
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    // Получаем информацию о маршруте - города и даты
    this._calculateRoutePoints(this._cards);
    this._renderRouteInfo(this._route);
  }

  _calculateRoutePoints(cards) {
    const cities = cards.map((card) => card.City);
    const startDate = getMinMaxDate(cards, DatesOperationType.STARTDATE_MIN);
    const endDate = getMinMaxDate(cards, DatesOperationType.ENDDATE_MAX);

    // Формируем строку для вывода информации о маршруте в хедере
    this._route = {
      cities: `${cities.length > 2 ? `${cities[0]} — ... — ${cities[cities.length - 1]}` : cities.join(` — `)}`,
      dates: `${getMonthAsString(startDate)} ${startDate.getDate()} — ${endDate.getDate()} ${getMonthAsString(endDate)}`
    };
  }

  _renderRouteInfo(routeData) {
    this._tripInfo = new TripInfo(routeData);

    render(this._container, this._tripInfo.getElement(), Position.AFTER_BEGIN);
  }

  _updateRouteInfo(updatedRoute) {
    this._tripInfo.getElement().querySelector(`.trip-info__title`).textContent = updatedRoute.cities;
    this._tripInfo.getElement().querySelector(`.trip-info__dates`).textContent = updatedRoute.dates;
  }

  // _updatePrice(updatedCards) {
  //   // FIXME: принимает обновленные данные по карточкам (в том числе должно учитываться удаление)
  // }

  _onDataChange(updatedCards) {
    // Обновляем информацию по маршруту и датам
    this._calculateRoutePoints(updatedCards);
    this._updateRouteInfo(this._route);
  }
}
