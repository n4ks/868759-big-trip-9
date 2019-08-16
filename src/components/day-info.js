export const generateDayInfoTemplate = (item) => {
  const dayInfo = `<div class="day__info">
    <span class="day__counter">${item.dayNumber}</span>
    <time class="day__date" datetime="2019-03-18">${item.month} ${item.calendarDay}</time>
  </div>`;

  return dayInfo;
};
