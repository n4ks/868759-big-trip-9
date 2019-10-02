import AbstractComponent from './abstract-component.js';

export default class Sorting extends AbstractComponent {
  constructor({label, isChecked = false}) {
    super();
    this._label = label;
    this._isChecked = isChecked;
  }

  getTemplate() {
    return `<div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-${this._label}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${this._label}"
          ${this._isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" data-sort-type="${this._label}" for="sort-${this._label}">${this._label}</label>
        </div>`;
  }
}
