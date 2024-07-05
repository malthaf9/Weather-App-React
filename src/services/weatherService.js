import { DateTime } from "luxon";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching data: ", err);
    });
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  if (!data || !data.list) {
    console.error("Forecast data is missing", data);
    return { timezone: data.city.timezone, daily: [], hourly: [] };
  }

  const { city: { timezone }, list } = data;

  let daily = [];
  let hourly = [];

  const dailyData = {};
  list.forEach((item) => {
    const localTime = DateTime.fromSeconds(item.dt).setZone(timezone);
    const time = localTime.toFormat("hh:mm a");
    const day = localTime.toFormat("ccc");

    if (!dailyData[day] || time === "12:00 pm") {
      dailyData[day] = {
        title: day,
        temp: item.main.temp,
        icon: item.weather[0].icon,
      };
    }

    if (localTime.hour % 3 === 0) {
      hourly.push({
        title: time,
        temp: item.main.temp,
        icon: item.weather[0].icon,
      });
    }
  });

  daily = Object.values(dailyData).slice(0, 5);
  hourly = hourly.slice(0, 5);

  console.log("Formatted Daily Data:", daily); // Debug log
  console.log("Formatted Hourly Data:", hourly); // Debug log

  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const rawForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  });

  console.log("Raw Forecast Weather Data:", rawForecastWeather); // Debug log

  const formattedForecastWeather = formatForecastWeather(rawForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };





