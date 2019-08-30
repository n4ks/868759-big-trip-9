const Position = {
  BEFORE_END: `beforeEnd`,
  AFTER_BEGIN: `afterBegin`,
  AFTER: `after`,
  BEFORE: `before`
};

const DatesOperationType = {
  STARTDATE_MIN: `min`,
  ENDDATE_MAX: `max`
};

const createElement = (template) => {
  const element = document.createElement(`template`);
  element.innerHTML = template.trim();

  return element.content.firstChild;
};

const render = (container, element, position = Position.BEFORE_END) => {

  switch (position) {
    case Position.AFTER_BEGIN:
      container.prepend(element);
      break;
    case Position.BEFORE_END:
      container.append(element);
      break;
    case Position.AFTER:
      container.after(element);
      break;
    case Position.BEFORE:
      container.before(element);
      break;
  }
};

const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

const capitalizeText = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const checkLeadZero = (value) => (value < 10 ? `0` : ``) + value;
const getTimeFromDate = (date) => `${date.getHours()}${`:`}${(checkLeadZero(date.getMinutes()))}`;
const getMonthAsString = (date) => date.toLocaleString(`en`, {month: `short`});
const calculateDuration = (secondDate, firstDate) => {
  const res = Math.abs(secondDate - firstDate) / 1000;
  const days = Math.floor(res / 86400);
  const hours = Math.floor(res / 3600) % 24;
  const minutes = Math.floor(res / 60) % 60;

  const formattedDays = checkLeadZero(days);
  const formattedHours = checkLeadZero(hours);
  const formattedMinutes = checkLeadZero(minutes);
  let result;

  if (!days) {
    result = `${formattedHours}${`H`} ${formattedMinutes}${`M`}`;
    if (!hours) {
      result = `${formattedMinutes}${`M`}`;
    }
  } else {
    result = `${formattedDays}${`D`} ${formattedHours}${`H`} ${formattedMinutes}${`M`}`;
  }

  return result;
};

const getMinMaxDate = (points, type) => {
  let result;
  if (type === DatesOperationType.STARTDATE_MIN) {
    result = points.reduce((current, next) => (current.startDate < next.startDate) ? current : next).startDate;
  } else if (type === DatesOperationType.ENDDATE_MAX) {
    result = points.reduce((current, next) => (current.endDate > next.endDate) ? current : next).endDate;
  }

  return result;
};

export {Position, createElement, render, unrender, capitalizeText, getTimeFromDate, getMonthAsString, calculateDuration, getMinMaxDate, DatesOperationType};
