import Chart from 'chart.js';
import {render} from '../components/util.js';

const Color = {
  PINK: `rgba(255, 99, 132, 0.7)`,
  BLUE: `rgba(54, 162, 235, 0.7)`,
  YELLOW: `rgba(255, 206, 86, 0.7)`,
  TEAL: `rgba(75, 192, 192, 0.7)`,
};

const ChartConfig = {
  TYPE: `bar`,
  LABEL_MONEY: `Spent`
};

export default class RenderStats {
  constructor(cardMock, statistics) {
    this._stats = statistics;
    this._data = cardMock;
  }

  generateMoneyChart() {
    const pageMainElement = document.querySelector(`.page-body__page-main`);

    render(pageMainElement.querySelector(`.page-body__container`), this._stats.getElement());

    const moneyCtx = this._stats.getElement().querySelector(`.statistics__chart--money`);

    const moneyLabels = new Set(this._data.map((point) => point.type));

    const moneyPrice = Array.from(moneyLabels).map((label) => {
      let sum = 0;
      this._data.forEach((card) => {
        if (card.type === label) {
          sum += card.ticketPrice;
        }
      });

      return sum;
    });

    const moneyChart = new Chart(moneyCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: Array.from(moneyLabels),
        datasets: [{
          label: ChartConfig.LABEL_MONEY,
          data: moneyPrice,
          backgroundColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,

          ],
          borderColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}
