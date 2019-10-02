// import AbstractComponent from './abstract-component.js';
import {createElement, getPointLabel} from './util.js';

const InitValue = {
  ID: -1,
  TYPE: `flight`,
  CITY: ``,
  START_DATE: new Date().valueOf(),
  END_DATE: new Date().setDate(new Date().getDate() + 1),
  TICKET_PRICE: 0,
  IS_FAVORITE: false
};

export default class NewPoint {
  constructor(citiesList) {
    this._id = InitValue.ID;
    this._editElement = null;
    this._type = InitValue.TYPE;
    this._city = InitValue.CITY;
    this._photos = null;
    this._ticketPrice = InitValue.TICKET_PRICE;
    this._startDate = InitValue.START_DATE;
    this._endDate = InitValue.END_DATE;
    this._isFavorite = InitValue.IS_FAVORITE;
    this._citiesList = citiesList;
    this._changeEventType();
  }

  get Id() {
    return this._id;
  }

  get Type() {
    return this._type;
  }

  get City() {
    return this._city;
  }

  get StartDate() {
    return this._startDate;
  }

  get EndDate() {
    return this._endDate;
  }

  get Offers() {
    return this._offers;
  }

  get Photos() {
    return this._photos;
  }

  get Description() {
    return this._description;
  }

  getEditElement() {
    if (!this._editElement) {
      this._editElement = createElement(this.getEditTemplate());
    }

    return this._editElement;
  }

  removeEditElement() {
    if (this._element) {
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

  getEditTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
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
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
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
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details"></section>
</form>`;
  }
}
