import {firstLetterToUppercase, getTimeFromDate, calculateDuration} from './util.js';

export const generateCardTemplate = ({type, city, startDate, endDate, ticketPrice, offers}) => {

  const cardTemplate = `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${firstLetterToUppercase(type)} to ${city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${getTimeFromDate(startDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${getTimeFromDate(endDate)}</time>
      </p>
      <p class="event__duration">${calculateDuration(endDate, startDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${ticketPrice}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map(({title, price}) => `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`).join(``)}
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;

  return cardTemplate;
};
