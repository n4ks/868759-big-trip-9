import AbstractComponent from './abstract-component.js';

export default class DayInfo extends AbstractComponent {
  constructor({dayNumber, month, calendarDay}) {
    super();
    this._dayNumber = dayNumber;
    this._month = month;
    this._calendarDay = calendarDay;
  }

  getTemplate() {
    return `<div class="day__info">
      <span class="day__counter">${this._dayNumber}</span>
      <time class="day__date" datetime="2019-03-18">${this._month} ${this._calendarDay}</time>
    </div>`;
  }
}

