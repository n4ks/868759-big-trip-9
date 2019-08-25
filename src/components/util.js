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

export {capitalizeText, getTimeFromDate, getMonthAsString, calculateDuration};
