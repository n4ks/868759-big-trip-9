import AbstractComponent from './abstract-component.js';

export default class Menu extends AbstractComponent {
  constructor({label}) {
    super();
    this._label = label;
  }

  getTemplate() {
    return `<a class="trip-tabs__btn" id="${this._label}" href="#">${this._label}</a>`;
  }
}
