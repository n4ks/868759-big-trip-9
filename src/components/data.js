import ModelCard from './model-card.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const URL = {
  POINTS: `points`,
  DESTINATIONS: `destinations`
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

export default class Data {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load()
      .then(toJSON)
      .then(ModelCard.parseCards);
  }

  createCard({card}) {
    return this._load({
      method: Method.POST,
      body: JSON.stringify(card),
      headers: new Headers(CONTENT_TYPE)
    })
      .then(toJSON)
      .then(ModelCard.parseCard);
  }

  updateCard({id, card}) {
    return this._load({
      method: Method.PUT,
      body: JSON.stringify(card),
      headers: new Headers(CONTENT_TYPE),
      url: `${URL}/${id}`
    })
      .then(toJSON)
      .then(ModelCard.parseCard);
  }

  deleteCard({id}) {
    return this._load({
      method: Method.DELETE,
      url: `${URL}/${id}`
    })
      .then(toJSON);
  }

  _load(method = Method.GET, body = null, headers = new Headers(), url = URL.POINTS) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
