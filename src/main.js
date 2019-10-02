// инициализация контроллера
import Controller from './controllers/controller.js';

// FIXME: пока будет жить здесь

const filtersItems = [
  {
    label: `everything`,
    isChecked: true
  },
  {
    label: `future`,
  },
  {
    label: `past`,
  }
];

const sortingItems = [
  {
    label: `event`,
    isChecked: true
  },
  {
    label: `time`,
  },
  {
    label: `price`,
  }
];

const menuItems = [
  {
    label: `Table`,
  },
  {
    label: `Stats`
  }
];

const controller = new Controller(filtersItems, sortingItems, menuItems);
controller.init();
