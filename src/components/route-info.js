import AbstractComponent from './abstract-component.js';
import {getCitiesSummary, getDatesSummary} from './util.js';

export default class RouteInfo extends AbstractComponent {
  constructor({cities, dates}) {
    super();
    this._cities = cities;
    this._dates = dates;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${getCitiesSummary(this._cities)}</h1>

    <p class="trip-info__dates">${getDatesSummary(this._dates)}</p>
  </div>`;
  }
}
