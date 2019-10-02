import moment from 'moment';

const Position = {
  PREPEND: `prepend`,
  APPEND: `append`,
  AFTER: `after`,
  BEFORE: `before`
};

export default class RenderManager {
  constructor() {
    this._routeControlsContainer = document.querySelector(`.trip-main__trip-controls`);
    this._routeInfoContainer = document.querySelector(`.trip-main__trip-info`);
    this._globalRouteContainer = document.querySelector(`.trip-events`);
  }

  // Рендерим компоненты которые не будут перерисовываться
  renderRegularComponents(routeInfo, sortingContainer, sorting) {
    this.renderRouteInfo(routeInfo);
    this.renderSortingElements(sortingContainer, sorting);
    this.renderSortingContainer(sortingContainer);

  }

  // Информация о маршруте
  renderRouteInfo(element) {
    this._render(this._routeInfoContainer, element.getElement(), Position.PREPEND);
  }

  // Меню
  renderMenuContainer(element) {
    const position = this._routeControlsContainer.querySelector(`h2`);

    this._render(position, element.getElement(), Position.AFTER);
  }

  renderMenu(container, elements) {
    elements.forEach((element) => this._render(container.getElement(), element.getElement(), Position.APPEND));
  }

  // Фильтры
  renderFiltersContainer(element) {
    this._render(this._routeControlsContainer, element.getElement(), Position.APPEND);
  }

  renderFilters(container, elements) {
    elements.forEach((element) => this._render(container.getElement(), element.getElement(), Position.APPEND));
  }

  // Сортировка
  renderSortingContainer(element) {
    this._render(this._globalRouteContainer, element.getElement(), Position.PREPEND);
  }

  renderSortingElements(container, elements) {
    const offersElement = container.getElement()
      .querySelector(`.trip-sort__item--offers`);

    elements.forEach((element) => this._render(offersElement, element.getElement(), Position.BEFORE));
  }

  renderRouteContainer(container, element) {
    this._render(container, element.getElement(), Position.APPEND);
  }

  fillDaysContainers(daysContainers, points) {
    daysContainers.forEach((dayContainer) => {
      const dayDate = dayContainer.getElement().querySelector(`.day__date`).getAttribute(`datetime`);
      const pointsList = dayContainer.getElement().querySelector(`.trip-events__list`);

      points.forEach((point) => {
        if (moment(point.StartDate).format(`YYYY-MM-DD`) === dayDate) {
          this.renderPoint(pointsList, point.getElement());
        }
      });
    });
  }

  renderDayContainers(container, daysContainers) {
    daysContainers.forEach((dayContainer) =>
      this._render(container.getElement(), dayContainer.getElement(), Position.APPEND));
  }

  renderPoint(container, point) {
    // Заполняем контейнер точками
    this._render(container, point, Position.APPEND);
  }

  // Рендер маршрута по дням
  renderDaysRoute(routeContainer, daysContainers, points) {
    // Заполняем контейнеры дней точками
    this.fillDaysContainers(daysContainers, points);
    // Рендерим в контейнер маршрута
    this.renderDayContainers(routeContainer, daysContainers);
    // Рендерим глобальный контейнер
    this.renderRouteContainer(this._globalRouteContainer, routeContainer);
  }

  // Рендер маршрута по точкам
  renderPointsRoute(routeContainer, points) {
    // Рендерим точки в контейнер маршрута
    points.forEach((point) => this._render(routeContainer.getElement(), point.getElement(), Position.APPEND));
    // Рендерим глобальный контейнер
    this.renderRouteContainer(this._globalRouteContainer, routeContainer);
  }

  renderDestination(container, element) {
    this._render(container, element.getElement(), Position.APPEND);
  }

  renderOffers(container, element) {
    this._render(container, element.getElement(), Position.PREPEND);
  }

  renderNewPoint(container, element) {
    this._render(container, element.getEditElement(), Position.AFTER);
  }

  renderStats(element) {
    this._render(this._globalRouteContainer, element.getElement(), Position.AFTER);
  }

  _render(container, element, position) {
    switch (position) {
      case Position.PREPEND:
        container.prepend(element);
        break;
      case Position.APPEND:
        container.append(element);
        break;
      case Position.AFTER:
        container.after(element);
        break;
      case Position.BEFORE:
        container.before(element);
        break;
    }
  }

  unrender(element) {
    if (element) {
      element.remove();
    }
  }
}
