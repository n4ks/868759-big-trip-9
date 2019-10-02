import RouteInfo from '../components/route-info.js';
import MenuContainer from '../components/menu-container.js';
import Menu from '../components/menu.js';
import FiltersContainer from '../components/filters-container.js';
import Filter from '../components/filters.js';
import SortingContainer from '../components/sorting-container.js';
import Sorting from '../components/sorting.js';
import RoutePointsContainer from '../components/route-points-container.js';
import DayContainer from '../components/day-container.js';
import Point from '../components/point.js';
import Destination from '../components/destination.js';
import Offers from '../components/offers.js';
import NewPoint from '../components/new-point.js';
import Stats from '../components/stats.js';

export default class CreationManager {

  // Информация о маршруте
  createRouteInfo(routeInfoData) {
    return new RouteInfo(routeInfoData);
  }

  // Меню
  createMenuContainer() {
    return new MenuContainer();
  }

  createMenu(items) {
    return items.map((item) => new Menu(item));
  }

  // Фильтры
  createFiltersContainer() {
    return new FiltersContainer();
  }

  createFiltersElements(items) {
    return items.map((item) => new Filter(item));
  }
  // Сортировка
  createSortingContainer() {
    return new SortingContainer();
  }

  createSortingElements(items) {
    return items.map((item) => new Sorting(item));
  }

  // Контейнер для дней и точек маршрута
  createRouteContainer() {
    return new RoutePointsContainer();
  }

  createDayContainers(daysInfos) {
    return daysInfos.map((day) => new DayContainer(day));
  }

  createPoints(filteredData, citiesList) {
    return filteredData.map((pointModel) => new Point(pointModel, citiesList));
  }

  createDestination(destinationData) {
    return new Destination(destinationData);
  }

  createOffers(offersData) {
    return new Offers(offersData);
  }

  createNewPoint(citiesList) {
    return new NewPoint(citiesList);
  }

  // Статистика
  createStats() {
    return new Stats();
  }
}
