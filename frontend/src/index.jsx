import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (position) => {
  try {
    let url = `${baseURL}/weather`;
    if (position instanceof window.GeolocationPosition) {
      url += `?lat=${encodeURIComponent(position.coords.latitude)}&lon=${encodeURIComponent(position.coords.longitude)}`;
    }
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    /**
     * Maybe we can add GCP logging later on?
     * This should be okay for now.
     */
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  return {};
};

const getLocation = () => {
  if (!navigator.geolocation) {
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      description: '',
      hasGeolocation: false,
    };
  }

  async componentDidMount() {
    let location = null;
    let hasGeolocation = false;
    try {
      location = await getLocation();
      hasGeolocation = true;
    } catch (error) {
      // Same story here, GCP logging would be nice addition
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`Failed to use geolocation. Error: ${error}`);
      }
    }
    const {
      icon = '',
      description = '',
    } = await getWeatherFromApi(location);
    this.setState({
      icon: icon.slice(0, -1),
      description,
      hasGeolocation,
    });
  }

  render() {
    const { icon, description, hasGeolocation } = this.state;

    return (
      <figure className="icon">
        {
          icon
            ? <img src={`/img/${icon}.svg`} alt={`Weather in 3 hours: ${description ?? ''}`} />
            : <div className="loading-icon" />
        }
        { description && <figcaption>{ description }</figcaption> }
        {
          !hasGeolocation && icon
          && <p>Warging: without location access this data might be unaccurate.</p>
        }
      </figure>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app'),
);
