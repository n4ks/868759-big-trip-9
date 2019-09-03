import TripCard from '../components/card';
import TripCardEdit from '../components/card-edit';
import {unrender} from '../components/util.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class PointController {
  constructor(container, cardsData, cardsArray, cardsEditArray, onDataChange, onDataDelete) {
    this._container = container;
    this._cardsData = cardsData;
    this._generatedCardsData = cardsArray;
    this._generatedEditCardsData = cardsEditArray;
    this._onDataChange = onDataChange;
    this._onDataDelete = onDataDelete;

    this.create();
  }

  create() {
    this._cardsData.forEach((cardData) => this._generateCard(cardData));
    this._renderCards();
  }

  _generateCard(card) {
    const cardComponent = new TripCard(card);
    const cardEditComponent = new TripCardEdit(card);

    flatpickr(cardEditComponent.getElement().querySelector(`#event-start-time-1`), {
      // dateFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: new Date(cardEditComponent.StartDate),
      // minDate: `today`,
    });

    flatpickr(cardEditComponent.getElement().querySelector(`#event-end-time-1`), {
      // dateFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: new Date(cardEditComponent.EndDate),
      // minDate: cardEditComponent.StartDate,
    });

    const enableCardMode = () => cardEditComponent.getElement().replaceWith(cardComponent.getElement());
    const enablecardEditMode = () => cardComponent.getElement().replaceWith(cardEditComponent.getElement());

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        enableCardMode();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onDeleteButtonClick = () => {
      this._onDataDelete(cardComponent, cardEditComponent, card);

      cardEditComponent.getElement().querySelector(`.event__reset-btn`)
        .removeEventListener(`click`, onDeleteButtonClick);
    };

    cardComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        enablecardEditMode();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    cardEditComponent.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(cardEditComponent.getElement().querySelector(`.event--edit`));

        const getCurrentOffersState = () => {
          const checkedOffers = formData.getAll(`event-offer`);
          let updatedOffers = [];

          if (cardEditComponent.Offers.length) {
            cardEditComponent.Offers.forEach((offer) => {
              offer.isChecked = false;
              checkedOffers.forEach((checkedOffer) => {
                if (offer.name === checkedOffer) {
                  offer.isChecked = true;
                }
              });
              updatedOffers.push(offer);
            });
          }

          return updatedOffers;
        };

        const entry = {
          type: formData.get(`event-type`),
          city: formData.get(`event-destination`),
          description: cardEditComponent.Description,
          photos: cardEditComponent.Photos,
          startDate: new Date(formData.get(`event-start-time`)),
          endDate: new Date(formData.get(`event-end-time`)),
          ticketPrice: formData.get(`event-price`),
          offers: getCurrentOffersState()
        };

        this._cards[this._cards.findIndex((value) => value === card)] = entry;
        enableCardMode();
        // this._clearTripRoute();
        // this._removeGeneratedComponent(this._generatedCardsData, cardComponent);
        // this._removeGeneratedComponent(this._generatedEditCardsData, cardEditComponent);

        this._renderRoute();
      });

    cardEditComponent.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onDeleteButtonClick);

    this._createDataStore(this._generatedCardsData, cardComponent);
    this._createDataStore(this._generatedEditCardsData, cardEditComponent);
  }

  _renderCards(cardsData = this._generatedCardsData) {
    this._container.getElement().append(...cardsData.map((instance) => instance.element));
  }

  _createDataStore(arr, component) {
    return arr.push({'instance': component, 'element': component.getElement()});
  }
}
