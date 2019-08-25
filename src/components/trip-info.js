import {getMonthAsString} from './util.js';
export const generateTripInfoTemplate = ({route, startDate, endDate}) => {
  const tripInfo = `<div class="trip-info__main">
  <h1 class="trip-info__title">${route.length > 2 ? `${route[0]} — ... — ${route[route.length - 1]}` : route.join(` — `)}</h1>

  <p class="trip-info__dates">${getMonthAsString(startDate)} ${startDate.getDate()}&nbsp;&mdash;&nbsp;${endDate.getDate()} ${getMonthAsString(endDate)}</p>
</div>`;

  return tripInfo;
};
