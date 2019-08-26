import {createElement} from './util.js';

export default class Filter {
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
    const filterTemplate = `<div class="trip-filters__filter">
        <input id="filter-${this._label}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${this._label}" ${this._isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${this._label}">${this._label}</label>
      </div>`;

    return filterTemplate;
  }
}
