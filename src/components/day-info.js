import AbstractComponent from './abstract-component.js';
import {getMonthAsString} from './util.js';

export default class DayInfo extends AbstractComponent {
  constructor({dayNumber, date}) {
    super();
    this._dayNumber = dayNumber;
    this._date = new Date(date);
  }

  getTemplate() {
    return `<div class="day__info">
      <span class="day__counter">${this._dayNumber}</span>
      <time class="day__date" datetime="${this._date.getFullYear()}-${this._date.getMonth()}-${this._date.getDate()}">
      ${getMonthAsString(this._date)} ${this._date.getDate()}</time>
    </div>`;
  }
}

