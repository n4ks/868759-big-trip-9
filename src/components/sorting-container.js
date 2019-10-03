import AbstractComponent from './abstract-component.js';

export default class SortingContainer extends AbstractComponent {
  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    <span class="trip-sort__item  trip-sort__item--offers">offers</span>
  </form>`;
  }
}
