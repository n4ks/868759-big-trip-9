import Chart from 'chart.js';
import moment from 'moment';

const HOURS_COUNT = 24;

const Color = {
  PINK: `rgba(255, 99, 132, 0.7)`,
  BLUE: `rgba(54, 162, 235, 0.7)`,
  YELLOW: `rgba(255, 206, 86, 0.7)`,
  TEAL: `rgba(75, 192, 192, 0.7)`,
  OCEAN: `rgba(50, 135, 168, 0.7)`,
  ORANGE: `rgba(245, 191, 66, 0.7)`,
  RED: `rgba(217, 13, 40, 0.7)`,
  GREEN: `rgba(13, 217, 88, 0.7)`,
  VIOLET: `rgba(152, 13, 217, 0.7)`
};

const ChartConfig = {
  TYPE: `bar`,
  LABEL_MONEY: `Money`,
  LABEL_TRANSPORT: `Transport`,
  LABEL_TIME: `Time-Spend`,
  BORDER_WIDTH: 1
};

export default class StatsChart {
  constructor(filteredData) {
    this._data = filteredData;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  init() {
    this._generateMoneyChart();
    this._generateTransportChart();
    this._generateTimeChart();

  }

  _generateMoneyChart() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const moneyChartData = this.getMoneyChartData(this._data);

    this._moneyChart = new Chart(moneyCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: moneyChartData.labels,
        datasets: [{
          label: ChartConfig.LABEL_MONEY,
          data: moneyChartData.prices,
          backgroundColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.OCEAN,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET

          ],
          borderColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.OCEAN,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET
          ],
          borderWidth: ChartConfig.BORDER_WIDTH
        }]
      },
      options: {
        responsive: true,
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

  getMoneyChartData(data) {
    //  Получаем массив уникальных тайпов
    const moneyChartLabels = [...new Set(data.map((point) => point.type))];
    // Создаём новый массив на основе массива уникальных тайпов
    const moneyChartTotal = moneyChartLabels.map((label) => {
      let sum = 0;
      // Циклом пробегаемся по всем поинтам, находим совпадения тайпов
      data.forEach((point) => {
        if (point.type === label) {
          // Если совпадение найдено получаем сумму всех точек с таким тайпом
          sum += point.ticketPrice;
        }
      });
      // Возвращает объект с тайпом и суммой
      return {type: label, price: sum};
    });
    // Сортируем по убыванию
    const moneyChartTotalSorted = moneyChartTotal.sort((a, b) => b.price - a.price);
    // Получаем массивы тайпов и цен для чарта
    return {
      labels: moneyChartTotalSorted.map((obj) => obj.type),
      prices: moneyChartTotalSorted.map((obj) => obj.price)
    };
  }

  _generateTransportChart() {
    const transportCtx = document.querySelector(`.statistics__chart--transport`);

    const transportChartData = this.getTransportChartData(this._data);

    this._transportChart = new Chart(transportCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: transportChartData.labels,
        datasets: [{
          label: ChartConfig.LABEL_TRANSPORT,
          data: transportChartData.counts,
          backgroundColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET

          ],
          borderColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET
          ],
          borderWidth: ChartConfig.BORDER_WIDTH
        }]
      },
      options: {
        responsive: true,
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

  getTransportChartData(data) {
    const ignoredServices = [`check-in`, `sightseeing`, `restaurant`];
    const transportChartLabels = [...new Set(data.filter((point) => !ignoredServices.includes(point.type)).map((point) => point.type))];

    const transportChartTotal = transportChartLabels.map((label) => {
      let sum = 0;
      data.forEach((point) => {
        if (point.type === label) {
          sum++;
        }
      });

      return {type: label, count: sum};
    });

    const transportChartTotalSorted = transportChartTotal.sort((a, b) => b.count - a.count);

    return {
      labels: transportChartTotalSorted.map((obj) => obj.type),
      counts: transportChartTotalSorted.map((obj) => obj.count)
    };
  }

  _generateTimeChart() {
    const spendedDaysCtx = document.querySelector(`.statistics__chart--time`);

    const timeSpendData = this.getTimeSpendData(this._data);

    this._timeSpendChart = new Chart(spendedDaysCtx, {
      type: ChartConfig.TYPE,
      data: {
        labels: timeSpendData.labels,
        datasets: [{
          label: ChartConfig.LABEL_TIME,
          data: timeSpendData.counts,
          backgroundColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET

          ],
          borderColor: [
            Color.PINK,
            Color.BLUE,
            Color.YELLOW,
            Color.TEAL,
            Color.ORANGE,
            Color.RED,
            Color.GREEN,
            Color.VIOLET
          ],
          borderWidth: ChartConfig.BORDER_WIDTH
        }]
      },
      options: {
        responsive: true,
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

  getTimeSpendData(data) {
    const timeChartLabels = [...new Set(data.map((point) => point.type))];

    const timeChartDataTotal = timeChartLabels.map((label) => {
      let day = 0;
      data.forEach((point) => {
        if (label === point.type) {
          const startDate = moment(point.startDate);
          const endDate = moment(point.endDate);
          day += endDate.diff(startDate, `hours`) / HOURS_COUNT;
        }
      });

      return {
        type: label,
        count: day.toFixed(1)
      };
    });

    const timeChartDataTotalSorted = timeChartDataTotal.sort((a, b) => b.count - a.count);

    return {
      labels: timeChartDataTotalSorted.map((obj) => obj.type),
      counts: timeChartDataTotalSorted.map((obj) => obj.count)
    };
  }

  updateChart(data) {
    const moneyChartData = this.getMoneyChartData(data);

    this._moneyChart.data.labels = moneyChartData.labels;
    this._moneyChart.data.datasets[0].data = moneyChartData.prices;
    this._moneyChart.update();

    const transportChartData = this.getTransportChartData(data);
    this._transportChart.data.labels = transportChartData.labels;
    this._transportChart.data.datasets[0].data = transportChartData.counts;
    this._transportChart.update();

    const timeSpendChartData = this.getTimeSpendData(data);
    this._timeSpendChart.data.labels = timeSpendChartData.labels;
    this._timeSpendChart.data.datasets[0].data = timeSpendChartData.counts;
    this._timeSpendChart.update();
  }
}
