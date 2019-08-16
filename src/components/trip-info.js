export const generateTripInfoTemplate = (item) => {
  const tripInfo = `<div class="trip-info__main">
  <h1 class="trip-info__title">${item.startPoint} &mdash; ... &mdash; ${item.endPoint}</h1>

  <p class="trip-info__dates">${item.month} ${item.startDate}&nbsp;&mdash;&nbsp;${item.endDate}</p>
</div>`;

  return tripInfo;
};
