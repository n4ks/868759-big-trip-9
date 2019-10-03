import AbstractComponent from './abstract-component.js';

export default class RouteContainer extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
