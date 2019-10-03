import AbstractComponent from './abstract-component.js';
import {createElement, calculateDuration, getPointLabel} from './util.js';
import moment from 'moment';

const OFFERS_COUNT = 3;

export default class Point extends AbstractComponent {
  constructor({id, type, city, description, photos, ticketPrice, offers, startDate, endDate, isFavorite}, citiesList) {
    super();
    this._id = id;
    this._element = null;
    this._editElement = null;
    this._type = type;
    this._city = city;
    this._description = description;
    this._photos = photos;
    this._ticketPrice = ticketPrice;
    this._offers = offers;
    this._startDate = startDate;
    this._endDate = endDate;
    this._isFavorite = isFavorite;
    this._citiesList = citiesList;
    this._changeEventType();
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get city() {
    return this._city;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  get offers() {
    return this._offers;
  }

  get photos() {
    return this._photos;
  }

  get description() {
    return this._description;
  }

  getEditElement() {
    if (!this._editElement) {
      this._editElement = createElement(this.getEditTemplate());
    }

    return this._editElement;
  }

  removeEditElement() {
    if (this._editElement) {
      this._editElement = null;
    }
  }

  _changeEventType() {
    const typeInputs = [...this.getEditElement().querySelectorAll(`.event__type-input`)];
    typeInputs.forEach((input) => {
      if (input.value === this._type) {
        input.setAttribute(`checked`, true);
      }
    });
  }

  _getOffers() {
    let checkedOffers = [];

    this._offers.forEach((offer) => {
      if (checkedOffers.length < OFFERS_COUNT && offer.isChecked) {
        checkedOffers.push(offer);
      }
    });

    return checkedOffers.map(({title, price}) => `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`).join(``);
  }

  getTemplate() {
    return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${getPointLabel(this._type)} ${this._city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${moment(this._startDate).format(`HH:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${moment(this._endDate).format(`HH:mm`)}</time>
      </p>
      <p class="event__duration">${calculateDuration(this._endDate, this._startDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${this._ticketPrice}</span>
    </p>

    <h4 class="visually-hidden">offers:</h4>
    <ul class="event__selected-offers">
    ${this._getOffers()}
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
  }

  getEditTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getPointLabel(this._type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1" onkeypress="return false">
          <datalist id="destination-list-1">
            ${this._citiesList.map((city) => `<option value="${city}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._ticketPrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
      ${this._offers.length > 0 ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">offers</h3>
        <div class="event__available-offers">
          ${this._offers.map(({title, price, isChecked}) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.replace(` `, `-`)}-1" type="checkbox" name="event-offer" value="${title.replace(` `, `-`)}"
      ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${title.replace(` `, `-`)}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`).join(``)}
        </div>
      </section >` : ``}


    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${this._photos.map((photo) => `<img class="event__photo" src="${photo.src}" name="photo" alt="${photo.alt}">`).join(``)}
        </div >
      </div >
    </section >
      </section >
    </form >
  </li > `;
  }
}
