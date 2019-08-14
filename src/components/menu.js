export const generateNavButtonTemplate = (items) => {
  const navButtonsTemplates = items.map((item) => {
    const navButtonTemplate = `<a class="trip-tabs__btn${item.extraClass ? item.extraClass : ``}" href="#">${item.label}</a>`;

    return navButtonTemplate;
  }).join(``);

  return navButtonsTemplates;
};
