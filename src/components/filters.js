import AbstractComponent from './abstract-component.js';

export default class CardFilter extends AbstractComponent {
  constructor({label, dataSortType, isChecked = false}) {
    super();
    this._label = label;
    this._dataSortType = dataSortType;
    this._isChecked = isChecked;
  }

  getTemplate() {
    return `<div class="trip-filters__filter">
        <input id="filter-${this._label}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${this._label}" ${this._isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" data-sort-type="${this._label}" for="filter-${this._label}">${this._label}</label>
      </div>`;

  }
}
