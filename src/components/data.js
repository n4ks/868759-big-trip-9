const RandomElementCount = {
  TYPE: 10,
  CITY: 4,
  DESCRIPTION: 3,
  PHOTO: 4,
  OFFER: 3
};

const Time = {
  DAYS: 30,
  MIN_HOUR: 0,
  MAX_HOUR: 23
};

const Price = {
  MIN: 1,
  MAX: 160
};
const RANDOM_MODIFIER = 0.5;

export const generateCardsItems = () => ({
  type: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`][mockHelper.getRandomNumber(RandomElementCount.TYPE)],
  city: [`Geneva`, `Saint Petersburg`, `Amsterdam`, `Charmonix`][mockHelper.getRandomNumber(RandomElementCount.CITY)],
  description: [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`].sort(() => mockHelper.getRandomSorting()).slice(0, mockHelper.getRandomNumber(RandomElementCount.DESCRIPTION)).join(` `),
  photos: mockHelper.generateRandomPhotos(RandomElementCount.PHOTO),
  startDate: mockHelper.getRandomDate(Time.MIN_HOUR, Time.MAX_HOUR),
  endDate: mockHelper.getRandomDate(Time.MIN_HOUR, Time.MAX_HOUR, Time.DAYS),
  ticketPrice: mockHelper.getRandomNumber(Price.MIN, Price.MAX),
  offers: [
    {
      title: `Add luggage`,
      price: 10,
      name: `luggage`,
      isChecked: mockHelper.getRandomBool()
    },
    {
      title: `Switch to comfort class`,
      price: 150,
      name: `comfort`,
      isChecked: mockHelper.getRandomBool()
    },
    {
      title: `Add meal`,
      price: 2,
      name: `meal`,
      isChecked: mockHelper.getRandomBool()
    },
    {
      title: `Choose seats`,
      price: 9,
      name: `seats`,
      isChecked: mockHelper.getRandomBool()
    },
  ].sort(() => mockHelper.getRandomSorting()).slice(0, mockHelper.getRandomNumber(RandomElementCount.OFFER))
});

const mockHelper = {
  getRandomNumber(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  getRandomBool() {
    return Math.random() > RANDOM_MODIFIER;
  },
  generateRandomPhotos(count) {
    return new Array(count).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
  },
  getRandomSorting() {
    return Math.random() - RANDOM_MODIFIER;
  },
  getRandomDate(startHour, endHour, days = 0) {
    const startDate = Date.now();
    const endDate = new Date(Date.now());
    endDate.setDate(endDate.getDate() + days);
    const date = new Date(+startDate + Math.random() * (endDate - startDate));
    const hour = startHour + Math.random() * (endHour - startHour);
    date.setHours(hour);

    return date;
  }
};
