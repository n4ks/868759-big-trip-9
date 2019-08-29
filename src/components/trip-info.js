import AbstractComponent from './abstract-component.js';
import {getMonthAsString} from './util.js';

export default class TripInfo extends AbstractComponent {
  constructor({route, startDate, endDate}) {
    super();
    this._route = route;
    this._startDate = startDate;
    this._endDate = endDate;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._route.length > 2 ? `${this._route[0]} — ... — ${this._route[this._route.length - 1]}` : this._route.join(` — `)}</h1>

    <p class="trip-info__dates">${getMonthAsString(this._startDate)} ${this._startDate.getDate()}&nbsp;&mdash;&nbsp;${this._endDate.getDate()} ${getMonthAsString(this._endDate)}</p>
  </div>`;
  }
}
