import {capitalizeText} from './util.js';

export const generateCardFilterButtonTemplate = (items) => {
  const cardFilterButtons = items.map((item) => {
    const cardFilterButton = `<div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-${item.label}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item.label}"
        ${item.isChecked ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-${item.label}">${capitalizeText(item.label)}</label>
      </div>`;

    return cardFilterButton;
  }).join(``);

  return cardFilterButtons;
};
