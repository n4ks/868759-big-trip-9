const capitalizeText = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getTimeFromDate = (date) => `${date.getHours()}${`:`}${(date.getMinutes() < 10 ? `0` : ``)}${date.getMinutes()}`;
const getMonthAsString = (date) => date.toLocaleString(`en`, {month: `short`});
const calculateDuration = (secondDate, firstDate) => {
  const res = Math.abs(secondDate - firstDate) / 1000;
  const days = Math.floor(res / 86400);
  const hours = Math.floor(res / 3600) % 24;
  const minutes = Math.floor(res / 60) % 60;

  switch (true) {
    case !hours && !days:
      return `${minutes}${`M`}`;
    case !days:
      return `${hours}${`H`} ${minutes}${`M`}`;
    case days > 0:
      return `${days}${`D`} ${hours}${`H`} ${minutes}${`M`}`;
    default:
      break;
  }
};

export {capitalizeText, getTimeFromDate, getMonthAsString, calculateDuration};
