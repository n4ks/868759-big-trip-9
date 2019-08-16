export const generateFilterButtonTemplate = (items) => {
  const filterButtons = items.map((item) => {
    const filterButton = `<div class="trip-filters__filter">
      <input id="filter-${item.label}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="${item.label}" ${item.isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${item.label}">${item.label.charAt(0).toUpperCase() + item.label.slice(1)}</label>
    </div>`;

    return filterButton;
  }).join(``);

  return filterButtons;
};
