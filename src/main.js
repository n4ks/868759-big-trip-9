import { generateNavButtonTemplate } from './components/menu.js';
import { generateFilterButtonTemplate } from './components/filters.js';

const controlsElement = document.querySelector(`.trip-controls`);
const controlsElementHeaders = controlsElement.querySelectorAll(`h2`);

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
renderElement(controlsElementHeaders[0], navigationContainer, `afterend`);

// 'Фильтры'
const filtersContainer = createContainer(filtersTemplate);

appendToContainer(filtersContainer, generateFilterButtonTemplate(filterButtons));
renderElement(controlsElementHeaders[1], filtersContainer, `afterEnd`);
