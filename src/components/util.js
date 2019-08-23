const firstLetterToUppercase = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getTimeFromDate = (date) => `${date.getHours()}${`:`}${(date.getMinutes() < 10 ? `0` : ``)}${date.getMinutes()}`;
const getMonthAsString = (date) => date.toLocaleString(`en`, {month: `short`});
const calculateDuration = (secondDate, firstDate) => {
  const res = Math.abs(secondDate - firstDate) / 1000;
  const days = Math.floor(res / 86400);
  const hours = Math.floor(res / 3600) % 24;
  const minutes = Math.floor(res / 60) % 60;
  let result;

  switch (true) {
    case hours === 0 && days === 0:
      result = `${minutes}${`M`}`;
      break;
    case days === 0:
      result = `${hours}${`H`} ${minutes}${`M`}`;
      break;
    case days > 0:
      result = `${days}${`D`} ${hours}${`H`} ${minutes}${`M`}`;
      break;
    default:
      break;
  }
  return result;
};

export {firstLetterToUppercase, getTimeFromDate, getMonthAsString, calculateDuration};
