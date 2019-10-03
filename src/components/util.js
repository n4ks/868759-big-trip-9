import moment from 'moment';
import dompurify from 'dompurify';

const FIRST_DAY = 1;

const EventType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

const EventTypePlaceholder = {
  TO: `to`,
  AT: `at`
};

const Time = {
  DAY_MS: 86400,
  HOUR_MS: 3600,
  HOUR_MIN: 60,
  MIN_SEC: 60,
  SEC_MS: 1000,
  HOURS: 24
};

const ADD_ZERO = 0;
const CHECK_LEAD_ZERO = 10;
const LEAD_ZERO = `0`;

const CITIES_COUNT = 3;

const Date = {
  DAYS: `D`,
  HOURS: `H`,
  MINUTES: `M`
};

const CitiesIndex = {
  FIRST: 0,
  LAST: 1
};

// Используется для получения значений для id и value в point
const removeLastWord = (text) => {
  const words = text.split(` `);
  return words[words.length - 1];
};

const createElement = (template) => {
  const element = document.createElement(`template`);
  const clearTemplate = dompurify.sanitize(template);
  element.innerHTML = clearTemplate.trim();

  return element.content.firstChild;
};

const addDayNumber = (dates) => {
  let i = FIRST_DAY;
  return dates.map((date) => ({
    date,
    dayNumber: i++
  }));
};

const formatDateAsDayMonth = (date) => {
  return moment(date).format(`DD MMM`);
};

// Стоимость машрута
const getTicketsSum = (data) => {
  return data.map((point) => point.ticketPrice).reduce((sum, current) => sum + current);
};

const getOffersSum = (data) => {
  return (data.map((point) => point.offers.map((offer) => offer.isChecked ? offer.price : ADD_ZERO)
    .reduce((sum, current) => sum + current, ADD_ZERO))
    .reduce((sum, current) => sum + current));
};

const getTotalSum = (data) => {
  const ticketsSum = getTicketsSum(data);
  const offersSum = getOffersSum(data);

  return ticketsSum + offersSum;
};

const checkLeadZero = (value) => (value < CHECK_LEAD_ZERO ? LEAD_ZERO : ``) + value;

const calculateDuration = (secondDate, firstDate) => {
  const res = Math.abs(secondDate - firstDate) / Time.SEC_MS;
  const days = Math.floor(res / Time.DAY_MS);
  const hours = Math.floor(res / Time.HOUR_MS) % Time.HOURS;
  const minutes = Math.floor(res / Time.HOUR_MIN) % Time.MIN_SEC;

  const formattedDays = checkLeadZero(days);
  const formattedHours = checkLeadZero(hours);
  const formattedMinutes = checkLeadZero(minutes);
  let result;

  if (!days) {
    result = `${formattedHours}${Date.HOURS} ${formattedMinutes}${Date.MINUTES}`;
    if (!hours) {
      result = `${formattedMinutes}${Date.MINUTES}`;
    }
  } else {
    result = `${formattedDays}${Date.DAYS} ${formattedHours}${Date.HOURS} ${formattedMinutes}${Date.MINUTES}`;
  }

  return result;
};
// Ищем точку в исходном массиве данных
const getPointIndex = (data, point) => data.findIndex((pointData) => pointData.id === point.id);

const getCities = (data) => {
  return data.map((point) => point.city);
};

// Получаем начальную и конечную точки маршута для первичной инициализации и обновления
const getCitiesSummary = (cities) => cities.length > CITIES_COUNT ? `${cities[CitiesIndex.FIRST]} — ... — ${cities[cities.length - CitiesIndex.LAST]}` : cities.join(` — `);

// Получаем начальную и конечную даты маршрута
const getMinMaxDates = (data) => {
  return {
    minDate: data.reduce((current, next) => (current.startDate < next.startDate) ? current : next).startDate,
    maxDate: data.reduce((current, next) => (current.endDate > next.endDate) ? current : next).endDate
  };
};

// Получаем строку для вывода начальной и конечной даты для первичной инициализации и обновления
const getDatesSummary = ({minDate, maxDate}) => `${formatDateAsDayMonth(minDate).toUpperCase()} — ${formatDateAsDayMonth(maxDate).toUpperCase()}`;

// Изменяем плейсхолдер в точке
const getEventPlaceholder = (pointType) => {
  let placeholder;

  switch (pointType) {
    case EventType.TAXI:
    case EventType.BUS:
    case EventType.TRAIN:
    case EventType.SHIP:
    case EventType.TRANSPORT:
    case EventType.DRIVE:
    case EventType.FLIGHT:
      placeholder = EventTypePlaceholder.TO;
      break;
    case EventType.CHECK_IN:
    case EventType.SIGHTSEEING:
    case EventType.RESTAURANT:
      placeholder = EventTypePlaceholder.AT;
      break;
    default:
      placeholder = EventTypePlaceholder.TO;
      break;
  }

  return placeholder;
};

const getPointLabel = (pointType) => {
  return `${pointType} ${getEventPlaceholder(pointType)}`;
};

export {
  removeLastWord,
  createElement,
  addDayNumber,
  formatDateAsDayMonth,
  getTotalSum,
  calculateDuration,
  getPointIndex,
  getCities,
  getCitiesSummary,
  getMinMaxDates,
  getDatesSummary,
  getEventPlaceholder,
  getPointLabel
};
