import {createElement, getMonthAsString} from './util.js';

export default class TripInfo {
  constructor({route, startDate, endDate}) {
    this._route = route;
    this._startDate = startDate;
    this._endDate = endDate;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    const tripInfoTemplate = `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._route.length > 2 ? `${this._route[0]} — ... — ${this._route[this._route.length - 1]}` : this._route.join(` — `)}</h1>

    <p class="trip-info__dates">${getMonthAsString(this._startDate)} ${this._startDate.getDate()}&nbsp;&mdash;&nbsp;${this._endDate.getDate()} ${getMonthAsString(this._endDate)}</p>
  </div>`;

    return tripInfoTemplate;
  }
}
