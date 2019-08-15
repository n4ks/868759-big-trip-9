import { generateNavButtonTemplate } from './components/menu.js';
import { generateFilterButtonTemplate } from './components/filters.js';
import { generateCardFilterButtonTemplate } from './components/card-filters.js';
import { generateCardEditTemplate } from './components/card-edit.js';

// const CARDS_COUNT = 3;
const controlsElement = document.querySelector(`.trip-controls`);
const controlsElementHeaders = controlsElement.querySelectorAll(`h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

const navigationTemplate = `<nav class="trip-controls__trip-tabs  trip-tabs"></nav>`;
const menuButtons = [
  {
    label: `Table`,
    extraClass: ` trip-tabs__btn--active`
  },
  {
    label: `Stats`
  }
];

const filterButtons = [
  {
    label: `everything`,
    isChecked: true
  },
  {
    label: `future`,
    isChecked: false
  },
  {
    label: `past`,
    isChecked: false
  }
];

const filtersTemplate = `<form class="trip-filters" action="#" method="get"></form>`;

const cardFiltersTemplate = `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`;

const cardFiltersButtons = [
  {
    label: `event`,
    isChecked: true
  },
  {
    label: `time`,
    isChecked: false
  },
  {
    label: `price`,
    isChecked: false
  }
];

const tripContainerTemplate = `<ul class="trip-days"></ul>`;
const tripEventsListTemplate = `<ul class="trip-events__list"></ul>`;

// 1) Создаём контейнер
const createContainer = (template) => {
  const element = document.createElement(`template`);

  element.innerHTML = template.trim();

  return element.content.firstChild;
};

// 2) Заполняем контейнер
const appendToContainer = (container, template, position = `beforeEnd`) => {
  container.insertAdjacentHTML(position, template);

  return container;
};

// 3) Рендерим в DOM
const renderElement = (container, element, position = `beforeEnd`) => {
  container.insertAdjacentElement(position, element);
};

// 'Меню'
const navigationContainer = createContainer(navigationTemplate);

appendToContainer(navigationContainer, generateNavButtonTemplate(menuButtons));
renderElement(controlsElementHeaders[0], navigationContainer, `afterEnd`);

// 'Фильтры'
const filtersContainer = createContainer(filtersTemplate);

appendToContainer(filtersContainer, generateFilterButtonTemplate(filterButtons));
renderElement(controlsElementHeaders[1], filtersContainer, `afterEnd`);

// 'Фильтр карточек'
const cardFiltersContainer = createContainer(cardFiltersTemplate);
const cardFiltersDecorativeElements = cardFiltersContainer.querySelectorAll(`span`);

appendToContainer(cardFiltersDecorativeElements[0], generateCardFilterButtonTemplate(cardFiltersButtons), `afterEnd`);
renderElement(tripEventsElement, cardFiltersContainer);

// 'Редактирование карточки'
const tripEventsContainer = createContainer(tripEventsListTemplate);
appendToContainer(tripEventsContainer, generateCardEditTemplate());

const tripContainer = createContainer(tripContainerTemplate);
renderElement(tripContainer, tripEventsContainer);
renderElement(tripEventsElement, tripContainer);

// 'Карточки'
// const cardsContainer = createContainer(cardsContainerTemplate);

// for (let i = 1; i <= CARDS_COUNT; i++) {
//   appendToContainer(cardsContainer, generateCardTemplate(i));
// }

// renderElement(tripEventsElement, cardsContainer);
