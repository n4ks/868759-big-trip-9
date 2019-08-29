import AbstractComponent from './abstract-component.js';
import {capitalizeText} from './util.js';

export default class CardFilter extends AbstractComponent {
  constructor({label, isChecked}) {
    super();
    this._label = label;
    this._isChecked = isChecked;
  }

  getTemplate() {
    return `<div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-${this._label}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${this._label}"
          ${this._isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${this._label}">${capitalizeText(this._label)}</label>
        </div>`;
  }
}
