import AbstractComponent from './abstract-component.js';

export default class Menu extends AbstractComponent {
  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs"></nav>`;
  }
}
