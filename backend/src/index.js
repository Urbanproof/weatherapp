const debug = require('debug',)('weathermap',);

const Koa = require('koa',);
const router = require('koa-router',)();
const fetch = require('node-fetch',);
const cors = require('kcors',);

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors(),);

const notEmptyStr = (str,) => {
  if (typeof str !== 'string') {
    return false;
  }
  return str.length > 0;
};

const queryString = (params,) => {
  if (typeof params !== 'object') {
    throw new TypeError('Object expected.',);
  }
  return Object.keys(params,).filter((key,) => {
    // Strip inherited properties, like prototype properties
    return Object.prototype.hasOwnProperty.call(params, key,);
  },).map((key,) => {
    // transforms object key-value pair to string key=value
    return `${encodeURIComponent(key,)}=${encodeURIComponent(params[key],)}`;
  },).join('&',);
};

const fetchWeather = async ({ lat = null, lon = null, },) => {
  const baseUri = `${mapURI}/forecast`;
  const params = {
    appid: appId,
  };
  if (notEmptyStr(lat,) && notEmptyStr(lon,)) {
    params.lat = lat;
    params.lon = lon;
  } else {
    params.q = targetCity;
  }
  const endpoint = `${baseUri}?${queryString(params,)}`;
  debug(endpoint,);
  const response = await fetch(endpoint,);

  return response ? response.json() : {};
};

router.get('/api/weather', async (ctx,) => {
  const weatherData = await fetchWeather(ctx.request.query,);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list ? weatherData.list[0].weather[0] : {};
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

debug(`App listening on port ${port}`,);
