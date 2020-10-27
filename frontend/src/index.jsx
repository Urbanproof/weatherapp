import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch(`${baseURL}/weather`);
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
