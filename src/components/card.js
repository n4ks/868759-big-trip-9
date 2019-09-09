import AbstractComponent from './abstract-component.js';
import {capitalizeText, getTimeFromDate, calculateDuration} from './util.js';

export default class Card extends AbstractComponent {
  constructor({Type, City, StartDate, EndDate, TicketPrice, Offers}) {
    super();
    this._type = Type;
    this._city = City;
    this._startDate = StartDate;
    this._endDate = EndDate;
    this._ticketPrice = TicketPrice;
    this._offers = Offers;
  }

  getTemplate() {
    return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${capitalizeText(this._type)} to ${this._city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${getTimeFromDate(this._startDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${getTimeFromDate(this._endDate)}</time>
      </p>
      <p class="event__duration">${calculateDuration(this._endDate, this._startDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${this._ticketPrice}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${this._offers.map(({title, price, isChecked}) => isChecked ? `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>` : ``).join(``)}
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
  }
}

