import AbstractComponent from './abstract-component.js';
import {formatDateAsDayMonth} from './util.js';

export default class DayContainer extends AbstractComponent {
  constructor({date, dayNumber}) {
    super();
    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._dayNumber}</span>
      <time class="day__date" datetime="${this._date}">
      ${formatDateAsDayMonth(this._date).toUpperCase()}</time>
    </div>
    <ul class="trip-events__list"></ul>
    </li>`;
  }
}
