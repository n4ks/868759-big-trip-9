import AbstractComponent from './abstract-component.js';

export default class TripInfo extends AbstractComponent {
  constructor({cities, dates}) {
    super();
    this._cities = cities;
    this._dates = dates;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._cities}</h1>

    <p class="trip-info__dates">${this._dates}</p>
  </div>`;
  }
}
