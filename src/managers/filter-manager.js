import {getCities, getMinMaxDates} from '../components/util.js';
import moment from 'moment';

const FilteringType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const SortingType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export default class FilterManager {
  // Фильтрация
  getFilteredData(data, filteringType) {
    let filteredData;

    switch (filteringType) {
      case FilteringType.EVERYTHING:
        filteredData = data;
        break;
      case FilteringType.FUTURE:
        filteredData = data.filter((point) => point.startDate > Date.now());
        break;
      case FilteringType.PAST:
        filteredData = data.filter((point) => point.endDate < Date.now());
        break;
      default:
        break;
    }

    return filteredData;
  }

  // Сортировка
  getSortedData(data, sortingType) {
    let sortedData;

    switch (sortingType) {
      // Вызывать при изменении/добавлении или удалении точки (при инициализации не нужно, структура отличаться не будет)
      case SortingType.EVENT:
        sortedData = data.slice().sort((a, b) => a.startDate - b.startDate);
        break;
      case SortingType.PRICE:
        sortedData = data.slice().sort((a, b) => b.ticketPrice - a.ticketPrice);
        break;
      case SortingType.TIME:
        sortedData = data.slice().sort((a, b) => b.endDate - a.endDate);
        break;
      default:
        break;
    }

    return sortedData;
  }

  getUniqueStartDays(data) {
    return [...new Set(data.map((point) => moment(point.startDate).format(`YYYY-MM-DD`)))];
  }

  getRouteInfoData(data) {
    return {
      cities: getCities(data),
      dates: getMinMaxDates(data)
    };
  }
}
