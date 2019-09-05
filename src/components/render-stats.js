import Chart from 'chart.js';
import {render} from '../components/util.js';
import Statistics from './statistics.js';

const Color = {
  PINK: `rgba(255, 99, 132, 0.7)`,
  BLUE: `rgba(54, 162, 235, 0.7)`,
  YELLOW: `rgba(255, 206, 86, 0.7)`,
  TEAL: `rgba(75, 192, 192, 0.7)`,
};

const ChartConfig = {
  TYPE: `bar`,
  LABEL_MONEY: `Money`,
  LABEL_TRANSPORT: `Transport`,
  BORDER_WIDTH: 1
};

export default class RenderStats {
  constructor(cardMock) {
    this._stats = new Statistics();
    this._data = cardMock;
    this._moneyChart = null;
    this._transportChart = null;
  }

  init() {
    const pageMainElement = document.querySelector(`.page-body__page-main`);
    render(pageMainElement.querySelector(`.page-body__container`), this._stats.getElement());
    this._generateMoneyChart();
    this._generateTransportChart();

  }

  _generateMoneyChart() {
    const moneyCtx = this._stats.getElement().querySelector(`.statistics__chart--money`);
    const moneyChartLabels = new Set(this._data.map((point) => point.type));

    const moneyChartPrice = Array.from(moneyChartLabels).map((label) => {
      let sum = 0;
      this._data.forEach((card) => {
        if (card.type === label) {
          sum += card.ticketPrice;
        }
      });

      return sum;
    });

    this._moneyChart = new Chart(moneyCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: Array.from(moneyChartLabels),
        datasets: [{
          label: ChartConfig.LABEL_MONEY,
          data: moneyChartPrice,
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
          borderWidth: ChartConfig.BORDER_WIDTH
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

  _generateTransportChart() {
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const ignoredServices = [`check-in`, `sightseeing`, `restaurant`];

    const transportChartLabels = new Set(this._data.filter((point) => !ignoredServices.includes(point.type)).map((point) => point.type));
    const transportChartCount = Array.from(transportChartLabels).map((label) => {
      let sum = 0;
      this._data.forEach((card) => {
        if (card.type === label) {
          sum++;
        }
      });

      return sum;
    });

    this._moneyChart = new Chart(transportCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: Array.from(transportChartLabels),
        datasets: [{
          label: ChartConfig.LABEL_TRANSPORT,
          data: transportChartCount,
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
          borderWidth: ChartConfig.BORDER_WIDTH
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
