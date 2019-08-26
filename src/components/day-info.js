import {createElement} from './util.js';

export default class DayInfo {
  constructor({dayNumber, month, calendarDay}) {
    this._dayNumber = dayNumber;
    this._month = month;
    this._calendarDay = calendarDay;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    const dayInfoTemplate = `<div class="day__info">
      <span class="day__counter">${this._dayNumber}</span>
      <time class="day__date" datetime="2019-03-18">${this._month} ${this._calendarDay}</time>
    </div>`;

    return dayInfoTemplate;
  }
}

