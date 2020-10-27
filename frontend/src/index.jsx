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
    };
  }

  async componentDidMount() {
    const {
      icon = '',
      description = '',
    } = await getWeatherFromApi();
    this.setState({
      icon: icon.slice(0, -1),
      description,
    });
  }

  render() {
    const { icon, description } = this.state;

    return (
      <div className="icon">
        { icon && <img src={`/img/${icon}.svg`} alt={`Weather in 3 hours: ${description ?? ''}`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app'),
);
