import {createElement, capitalizeText} from './util.js';

export default class CardFilter {
  constructor({label, isChecked}) {
    this._label = label;
    this._isChecked = isChecked;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    const cardFilterTemplate = `<div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-${this._label}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${this._label}"
          ${this._isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${this._label}">${capitalizeText(this._label)}</label>
        </div>`;

    return cardFilterTemplate;
  }
}
