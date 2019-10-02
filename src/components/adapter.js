export default class PointModel {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.city = data.destination.name;
    this.description = data.destination.description;
    this.photos = data.destination.pictures.map((picture) => ({
      src: picture.src,
      alt: picture.description
    }));
    this.startDate = data.date_from;
    this.endDate = data.date_to;
    this.ticketPrice = data.base_price;
    this.offers = data.offers.map((offer) => ({
      title: offer.title,
      price: offer.price,
      isChecked: offer.accepted
    }));
    this.isFavorite = data.is_favorite;
  }

  static parsePoint(data) {
    return new PointModel(data);
  }

  static parsePoints(data) {
    return data.map(PointModel.parsePoint);
  }
}
