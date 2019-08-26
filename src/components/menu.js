import {createElement} from './util.js';

export default class Menu {
  constructor({label, extraClass}) {
    this._label = label;
    this._extraClass = extraClass;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    const menuTemplate = `<a class="trip-tabs__btn${this._extraClass ? this._extraClass : ``}" href="#">${this._label}</a>`;

    return menuTemplate;
  }
}
