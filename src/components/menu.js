import AbstractComponent from './abstract-component.js';

export default class Menu extends AbstractComponent {
  constructor({label, extraClass}) {
    super();
    this._label = label;
    this._extraClass = extraClass;
  }

  getTemplate() {
    return `<a class="trip-tabs__btn${this._extraClass ? this._extraClass : ``}" href="#">${this._label}</a>`;
  }
}
