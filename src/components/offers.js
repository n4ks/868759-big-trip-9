import AbstractComponent from '../components/abstract-component.js';

export default class Offers extends AbstractComponent {
  constructor(offers) {
    super();
    this._offersData = offers;
  }

  getTemplate() {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${this._offersData.map(({title, price, isChecked = false}) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.replace(` `, `-`)}-1" type="checkbox" name="event-offer" value="${title.replace(` `, `-`)}"
    ${isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${title.replace(` `, `-`)}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
    </label>
  </div>`).join(``)}
  </div>
 </section >`;
  }
}
