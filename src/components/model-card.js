export default class ModelCard {
  constructor(data) {
    this._id = data.id;
    this._type = data.type;
    this._city = data.destination.name;
    this._description = data.destination.description;
    this._photos = data.destination.pictures.map((picture) => ({
      src: picture.src,
      alt: picture.description
    }));
    this._startDate = new Date(data.date_from);
    this._endDate = new Date(data.date_to);
    this._ticketPrice = data.base_price;
    this._offers = data.offers.map((offer) => ({
      title: offer.title,
      price: offer.price,
      isChecked: offer.accepted
    }));
    this._isFavorite = data.is_favorite;
  }

  get Type() {
    return this._type;
  }

  get City() {
    return this._city;
  }

  get Description() {
    return this._description;
  }

  get Photos() {
    return this._photos;
  }

  get StartDate() {
    return this._startDate;
  }

  get EndDate() {
    return this._endDate;
  }

  get TicketPrice() {
    return this._ticketPrice;
  }

  get IsFavorite() {
    return this._isFavorite;
  }

  get Offers() {
    return this._offers;
  }

  static parseCard(data) {
    return new ModelCard(data);
  }

  static parseCards(data) {
    return data.map(ModelCard.parseCard);
  }
}
