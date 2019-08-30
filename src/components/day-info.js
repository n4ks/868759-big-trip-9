import AbstractComponent from './abstract-component.js';
import {getMonthAsString} from './util.js';

export default class DayInfo extends AbstractComponent {
  constructor({dayNumber, date}) {
    super();
    this._dayNumber = dayNumber;
    this._date = date;
  }

  getTemplate() {
    return `<div class="day__info">
      <span class="day__counter">${this._dayNumber}</span>
      <time class="day__date" datetime="2019-03-18">${getMonthAsString(this._date)} ${this._date.getDate()}</time>
    </div>`;
  }
}

