import AbstractComponent from './abstract-component.js';
import {capitalizeText} from '../components/util.js';

export default class Menu extends AbstractComponent {
  constructor({label}) {
    super();
    this._label = label;
  }

  getTemplate() {
    return `<a class="trip-tabs__btn" id="${this._label}" href="#">${capitalizeText(this._label)}</a>`;
  }
}
