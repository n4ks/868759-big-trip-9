import AbstractComponent from '../components/abstract-component.js';

export default class tripDay extends AbstractComponent {
  getTemplate() {
    return `<li class="trip-days__item  day">`;
  }
}
