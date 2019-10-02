import AbstractComponent from '../components/abstract-component.js';

export default class Destination extends AbstractComponent {
  constructor({description, pictures}) {
    super();
    this._alt = description;
    this._pictures = pictures;
  }

  getTemplate() {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._alt}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${this._pictures.map((picture) => `<img class="event__photo" src="${picture.src}" name="photo" alt="${picture.alt}">`).join(``)}
        </div >
      </div >
    </section >`;
  }
}
