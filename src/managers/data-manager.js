import PointModel from '../components/adapter.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const URL = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

const CONTENT_TYPE = {'Content-Type': `application/json`};
const Status = {
  MIN: 200,
  MAX: 300
};

const checkStatus = (response) => {
  if (response.status >= Status.MIN && response.status < Status.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class DataManager {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: URL.POINTS})
      .then(toJSON)
      .then(PointModel.parsePoints);
  }

  createPoint({data}) {
    return this._load({
      url: URL.POINTS,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers(CONTENT_TYPE)
    })
      .then(toJSON)
      .then(PointModel.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers(CONTENT_TYPE),
      url: `${URL.POINTS}/${id}`
    })
      .then(toJSON)
      .then(PointModel.parsePoint);
  }

  deletePoint({id}) {
    return this._load({
      method: Method.DELETE,
      url: `${URL.POINTS}/${id}`
    });
  }

  getDestinations() {
    return this._load({url: URL.DESTINATIONS})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: URL.OFFERS})
      .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
