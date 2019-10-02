import DataManager from '../managers/data-manager.js';
import FilterManager from '../managers/filter-manager.js';
import RenderManager from '../managers/render-manager.js';
import CreationManager from '../managers/creation-manager.js';
import EventsManager from '../managers/events-manager.js';
import StatsChart from '../components/stats-chart.js';
import {addDayNumber, getTotalSum, getPointIndex, getCities, getCitiesSummary, getMinMaxDates, getDatesSummary} from '../components/util.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const NEW_POINT_ID = -1;
const ANIMATION_TIMEOUT = 600;
const ANIMATION_TIMING = 1000;
const ID_STEP = 1;
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

const RouteContainerPadding = {
  ADD: `80px`,
  REMOVE: `0px`
};

const FormState = {
  ENABLED: `enabled`,
  DISABLED: `disabled`
};

const ButtonAction = {
  SAVE: `Save`,
  SAVING: `Saving`,
  DELETE: `Delete`,
  DELETING: `Deleting`
};

export default class Controller {
  constructor(filtersItems, sortingItems, menuItems) {
    this._dataManager = null;
    this._data = null;
    this._menuItems = menuItems;
    this._menuContainer = null;
    this._menu = null;
    this._citiesList = null;
    this._routeInfo = null;
    this._totalSumElement = document.querySelector(`.trip-info__cost-value`);
    this._filtersItems = filtersItems;
    this._filtersContainer = null;
    this._filters = null;
    this._filteredData = null;
    this._filteredAndSortedData = null;
    this._currentFilter = FilteringType.EVERYTHING;
    this._currentSorting = SortingType.EVENT;
    this._filterManager = new FilterManager();
    this._renderManager = new RenderManager();
    this._creationManager = new CreationManager();
    this._eventsManager = new EventsManager(this);

    this._routePointsContainer = null;
    this._sortingItems = sortingItems;
    this._sortingContainer = null;
    this._sorting = null;
    this._daysContainers = [];
    this._points = [];

    this._editablePoint = null;
    this._currentPoint = null;

    this._currentDestination = null;
    this._currentOffers = null;
    this._newPoint = null;
    this._noPointTemplate = document.querySelector(`.trip-events__msg`);
    this._noDataTemplate = document.querySelector(`.trip-events__msg--loading`);
    this._statsPage = null;
    this._statsChart = null;
  }

  get Menu() {
    return this._menu;
  }

  get Filters() {
    return this._filters;
  }

  get CurrentFilter() {
    return this._currentFilter;
  }

  set CurrentFilter(val) {
    this._currentFilter = val;
  }

  get Sorting() {
    return this._sorting;
  }

  get CurrentSorting() {
    return this._currentSorting;
  }

  set CurrentSorting(val) {
    this._currentSorting = val;
  }

  get Points() {
    return this._points;
  }

  get EditablePoint() {
    return this._editablePoint;
  }

  set EditablePoint(val) {
    this._editablePoint = val;
  }

  get CurrentPoint() {
    return this._currentPoint;
  }

  set CurrentPoint(val) {
    this._currentPoint = val;
  }

  get NewPoint() {
    return this._newPoint;
  }

  get CitiesList() {
    return this._citiesList;
  }

  init() {
    // Получаем данные с сервера
    this._dataManager = new DataManager({endPoint: END_POINT, authorization: AUTHORIZATION});

    this._dataManager.getPoints().then((points) => {
      this._removeLoadingTemplate();
      // Записываем полученные данные в конструктор
      this._data = points;
      // Сортируем данные по дефолтным значениям перед рендером
      this._updateSortAndFilters();

      // Создаём и рендерим информацию о маршруте
      const routeInfoData = this._filterManager.getRouteInfoData(this._filteredData);
      this._routeInfo = this._creationManager.createRouteInfo(routeInfoData);

      // Выводим общую стоимость
      this._updateTotalSum(this._filteredData);

      // Статистика
      this._statsPage = this._creationManager.createStats();
      this._renderManager.renderStats(this._statsPage);
      this._statsChart = new StatsChart(this._filteredAndSortedData);
      this._statsChart.init();

      // Создаём меню
      this._menu = this._creationManager.createMenu(this._menuItems);
      this._menuContainer = this._creationManager.createMenuContainer();

      // Добавляем события на кнопки меню
      this._eventsManager.addMenuEventListeners();

      // Рендер меню
      this._renderManager.renderMenu(this._menuContainer, this._menu);
      this._renderManager.renderMenuContainer(this._menuContainer);


      // Создаём фильтры
      this._filters = this._creationManager.createFiltersElements(this._filtersItems);
      this._filtersContainer = this._creationManager.createFiltersContainer();


      // Добавляем события изменения фильтра
      this._eventsManager.addFiltersEventListener();

      // Рендерим фильтры
      this._renderManager.renderFilters(this._filtersContainer, this._filters);
      this._renderManager.renderFiltersContainer(this._filtersContainer);

      // Создаём сортировку
      this._sorting = this._creationManager.createSortingElements(this._sortingItems);
      this._sortingContainer = this._creationManager.createSortingContainer();

      // Добавляем события изменения фильтра на элементы сортировки
      this._eventsManager.addSortingEventListener();

      // Рендерим информацию о маршруте и сортировку
      this._renderManager.renderRegularComponents(this._routeInfo, this._sortingContainer, this._sorting);

      // Вешаем логику на кнопку создания новой точки
      this._eventsManager.addNewPointEventListeners();

      this._initRoute();
    });
  }

  _initRoute() {
    this._routePointsContainer = this._creationManager.createRouteContainer();

    // Добавляем нумерацию к датам и создаём контейнеры дней
    const uniqueStartDays = this._filterManager.getUniqueStartDays(this._filteredAndSortedData);
    const daysInfos = addDayNumber(uniqueStartDays);
    this._daysContainers = this._creationManager.createDayContainers(daysInfos);

    // Получаем список городов
    this._dataManager.getDestinations().then((destinations) => {
      this._citiesList = this._getCities(destinations);
      // Создаём точки
      this._points = this._creationManager.createPoints(this._filteredAndSortedData, this._citiesList);

      // Добавляем события для точек
      this._eventsManager.addPointsEventListeners();

      // Вызываем метод рендера в зависимости от текущей сортировки и передаем все необходимые компоненты для маршрута
      this._callRenderRouteBySorting(this._routePointsContainer, this._daysContainers, this._points);
    });
  }

  _callRenderRouteBySorting(routePointsContainer, daysContainers, points) {
    if (this._currentSorting === SortingType.EVENT) {
      this._checkAditionalPadding();
      // вызываем функцию рендера с днями
      this._renderManager.renderDaysRoute(routePointsContainer, daysContainers, points);
    } else if (this._currentSorting === SortingType.TIME || this._currentSorting === SortingType.PRICE) {
      this._checkAditionalPadding();
      // рендерим точки без дней, прямо в контейнер
      this._renderManager.renderPointsRoute(routePointsContainer, points);
    }
  }

  // Обновляем общую стоимость путешествия
  _updateTotalSum(filteredData) {
    if (this._data.length !== 0) {
      const totalSum = getTotalSum(filteredData);
      this._totalSumElement.textContent = totalSum;
    } else {
      this._totalSumElement.textContent = 0;
    }
  }

  // Обновляем информацию по городам
  _updateRouteCitiesInfo(filteredData) {
    const cities = getCities(filteredData);
    this._routeInfo.getElement()
      .querySelector(`.trip-info__title`).textContent = getCitiesSummary(cities);
  }

  // Обновляем начальную и конечную даты путешествия
  _updateRouteDatesInfo(filteredData) {
    const routeInfoElement = this._routeInfo.getElement()
      .querySelector(`.trip-info__dates`);

    if (this._data.length !== 0) {
      const minMaxDates = getMinMaxDates(filteredData);
      routeInfoElement.textContent = getDatesSummary(minMaxDates);
    } else {
      routeInfoElement.textContent = ``;
    }

  }

  // Обновляем фильтры и сортировку
  _updateFilters() {
    this._filteredData = this._filterManager.getFilteredData(this._data, this._currentFilter);
  }

  _updateSorting() {
    this._filteredAndSortedData = this._filterManager.getSortedData(this._filteredData, this._currentSorting);
  }

  _updateSortAndFilters() {
    this._updateFilters(this._data);
    this._updateSorting();
  }

  _clearRoute() {
    this._points.forEach((point) => {
      this._renderManager.unrender(point.getElement());
      this._renderManager.unrender(point.getEditElement());
      point.removeElement();
      point.removeEditElement();
    });
    this._points = [];

    if (this._daysContainers.length > 0) {
      this._daysContainers.forEach((dayContainer) => {
        this._renderManager.unrender(dayContainer.getElement());
        dayContainer.removeElement();
      });
      this._daysContainers = [];
    }

    this._renderManager.unrender(this._routePointsContainer.getElement());
    this._routePointsContainer.removeElement();
    this._routePointsContainer = null;
  }

  // Отфильтровываем данные, очищаем маршрут и перерендериваем, обновляем информацию в хедере
  updateRoute() {
    this._updateSortAndFilters();
    this._clearRoute();
    this._initRoute();
    this._statsChart.updateChart(this._filteredAndSortedData);
  }

  // Изменение точки
  onDataChange(editablePoint, newData) {
    if (newData.id !== NEW_POINT_ID) {
      // Изменение точки
      this._toggleFormElements(FormState.DISABLED, ButtonAction.SAVING);

      this._dataManager.updatePoint({id: newData.id, data: this._toRAW(newData)})
        .then((serverData) => {

          this._toggleFormElements(FormState.ENABLED, ButtonAction.SAVE);
          const editingPointIndex = getPointIndex(this._data, editablePoint);
          this._data[editingPointIndex] = serverData;

          this._updateAll();
        })
        .catch(() => {
          this._shakePoint();
          this._toggleFormElements(FormState.ENABLED, ButtonAction.SAVE);
        });
    } else {
      // Создание точки
      newData.id = (this._data.length + ID_STEP).toString();
      this._toggleFormElements(FormState.DISABLED, ButtonAction.SAVING);
      this._dataManager.createPoint({data: this._toRAW(newData)})
        .then((serverData) => {
          this._toggleFormElements(FormState.ENABLED, ButtonAction.SAVE);
          this._data.push(serverData);

          this._showNoPointsTemplate();
          this.removeNewPoint();
          this._updateAll();
        })
        .catch(() => {
          this._shakePoint();
          this._toggleFormElements(FormState.ENABLED, ButtonAction.SAVE);
        });
    }
  }

  _updateAll() {
    this.updateRoute();
    this._updateRouteDatesInfo(this._filteredAndSortedData);
    this._updateRouteCitiesInfo(this._filteredAndSortedData);
    this._updateTotalSum(this._filteredAndSortedData);
  }

  // Удаление точки
  onDataDelete(deletedPoint) {
    this._toggleFormElements(FormState.DISABLED, ButtonAction.DELETING);
    this._dataManager.deletePoint({id: deletedPoint.Id})
      .then(() => {
        this._toggleFormElements(FormState.ENABLED, ButtonAction.DELETE);
        deletedPoint.removeElement();
        const deletedPointIndex = getPointIndex(this._data, deletedPoint);
        this._data.splice(deletedPointIndex, 1);

        this._updateAll();
        this._showNoPointsTemplate();
      })
      .catch(() => {
        this._shakePoint();
        this._toggleFormElements(FormState.ENABLED, ButtonAction.DELETE);
      });
  }

  // Получаем destination с сервера, затем создаём и отрисовываем
  loadDestination(city) {
    this._dataManager.getDestinations().then((destinations) => {
      // Получаем Destination по названию города
      const loadedDestination = destinations.find((destination) => destination.name === city);

      this.updateDestination(loadedDestination);
    });
  }

  // Создаём и рендерим destination
  updateDestination(destinationObj) {
    // Удаляем старый элемент и ссылку на него
    this._renderManager.unrender(this._currentPoint.getEditElement().querySelector(`.event__section--destination`));
    if (this._currentDestination !== null) {
      this._currentDestination.removeElement();
    }

    // Создаём новый и рендерим
    this._currentDestination = this._creationManager.createDestination(destinationObj);
    const eventDetailsContainer = this._currentPoint.getEditElement().querySelector(`.event__details`);
    this._renderManager.renderDestination(eventDetailsContainer, this._currentDestination);
  }

  // Получаем офферы с сервера, затем вызываем создание и отрисовку
  loadOffers(type) {
    this._dataManager.getOffers().then((offers) => {
      // Получаем нужные офферы по типу
      const loadedOffers = offers.find((offer) => offer.type === type).offers;
      // Проверяем присутствуют ли офферы у выбранного типа
      this.updateOffers(loadedOffers);
    });
  }

  updateOffers(offers) {
    // Удаляем старый элемент и ссылку на него
    this._renderManager.unrender(this._currentPoint.getEditElement().querySelector(`.event__section--offers`));
    if (this._currentOffers !== null) {
      this._currentOffers.removeElement();
    }

    // Если у данного типа есть офферы - создаём и рендерим
    if (offers.length > 0) {
      this._currentOffers = this._creationManager.createOffers(offers);

      const eventDetailsContainer = this._currentPoint.getEditElement().querySelector(`.event__details`);
      this._renderManager.renderOffers(eventDetailsContainer, this._currentOffers);
    }
  }

  // Форма создания новой точки
  createNewPoint() {
    this._newPoint = this._creationManager.createNewPoint(this._citiesList);
    this._renderManager.renderNewPoint(this._sortingContainer.getElement(), this._newPoint);
  }

  removeNewPoint() {
    this._newPoint.removeEditElement();
    this._renderManager.unrender(this._newPoint.getEditElement());
    // Снимаем блок с кнопки
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  // Заглушка при отсутствии точек
  _showNoPointsTemplate() {
    if (this._data.length === 0) {
      this._noPointTemplate.classList.remove(`visually-hidden`);
      this._sortingContainer.getElement().classList.add(`visually-hidden`);
    } else {
      this._noPointTemplate.classList.add(`visually-hidden`);
      this._sortingContainer.getElement().classList.remove(`visually-hidden`);
    }
  }

  _removeLoadingTemplate() {
    this._noDataTemplate.classList.add(`visually-hidden`);
  }

  // Отступ для контейнера при фильтрации не по дням
  _checkAditionalPadding() {
    let padding;
    if (this._currentSorting === SortingType.EVENT) {
      padding = RouteContainerPadding.REMOVE;
    } else if (this._currentSorting === SortingType.PRICE || this._currentSorting === SortingType.TIME) {
      padding = RouteContainerPadding.ADD;
    }

    this._routePointsContainer.getElement().style.paddingLeft = padding;
  }

  _getCities(destionations) {
    return destionations.map((destination) => destination.name);
  }

  _toRAW(point) {
    return {
      'base_price': point.ticketPrice,
      'date_from': point.startDate,
      'date_to': point.endDate,
      'destination': {
        'description': point.description,
        'name': point.city,
        'pictures': point.photos.map((picture) => ({
          'src': picture.src,
          'description': picture.alt
        }))
      },
      'id': point.id,
      'is_favorite': point.isFavorite,
      'offers': point.offers.map((offer) => ({
        'title': offer.title,
        'price': offer.price,
        'accepted': offer.isChecked
      })),
      'type': point.type
    };
  }

  _toggleFormElements(state, action) {
    const formElements = this._currentPoint.getEditElement();
    const formInputs = [...formElements.querySelectorAll(`input`)];
    const saveBtn = formElements.querySelector(`.event__save-btn`);
    const delBtn = formElements.querySelector(`.event__reset-btn`);

    switch (action) {
      case ButtonAction.SAVE:
        saveBtn.textContent = ButtonAction.SAVE;
        break;
      case ButtonAction.SAVING:
        saveBtn.textContent = ButtonAction.SAVING;
        break;
      case ButtonAction.DELETE:
        delBtn.textContent = ButtonAction.DELETE;
        break;
      case ButtonAction.DELETING:
        delBtn.textContent = ButtonAction.DELETING;
        break;
      default:
        break;
    }

    if (state === FormState.DISABLED) {
      saveBtn.disabled = true;
      delBtn.disabled = true;

    } else if (state === FormState.ENABLED) {
      saveBtn.disabled = false;
      delBtn.disabled = false;
    }

    formInputs.forEach((input) => {
      if (state === FormState.DISABLED) {
        input.disabled = true;
      } else if (state === FormState.ENABLED) {
        input.disabled = false;
      }
    });
  }

  _shakePoint() {
    this._currentPoint.getEditElement().style.animation = `shake ${ANIMATION_TIMEOUT / ANIMATION_TIMING}s`;

    setTimeout(() => {
      this._currentPoint.getEditElement().style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}
