import React, { Component } from 'react';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import './Welcome.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class Welcome extends Component {
  constructor(props) {
    super(props);

    const today = new Date();
    this.state = {
      minDate: new Date(today.setMonth(today.getMonth() - 1)),
      maxDate: new Date(today.setMonth(today.getMonth() + 2)),
      onwarddate: '',
      fromSelect: '',
      toSelect: '',
      Stops: [],
      filteredFrom: [],
      filteredTo: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/BusStops')
      .then(res => res.json())
      .then(data => this.setState({ Stops: JSON.parse(data) }))
      .catch(err => console.log(err));
  }

  filterFromPlace = (event) => {
    this.setState({
      filteredFrom: this.state.Stops.filter(place =>
        place.toLowerCase().startsWith(event.query.toLowerCase())
      )
    });
  };

  filterToPlace = (event) => {
    const results = this.state.Stops.filter(place =>
      place.toLowerCase().startsWith(event.query.toLowerCase())
    ).filter(r => r.toLowerCase() !== this.state.fromSelect.toLowerCase());

    this.setState({ filteredTo: results });
  };

  handleRegister = (event) => {
    event.preventDefault();
    fetch('http://localhost:3001/CheckRoute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromSelect: this.state.fromSelect,
        toSelect: this.state.toSelect
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error === '') {
          this.props.setPlaces(this.state.fromSelect, this.state.toSelect);
          data.response.forEach(routeId => this.props.SetRouteId(routeId, 1));
          this.props.onRouteChange('search');
        } else {
          alert("No such route exists");
        }
      })
      .catch(err => console.log('Fetch error:', err));
  }

  render() {
    return (
      <div className='formwarp pa2 shadow-2 center'>
        <form>
          <div className='wraap pa2 center'>
            <div className="form-group col-md-10">
              <label htmlFor="onwarddate">Pick a Date: </label>
              <Calendar
                dateFormat="dd/mm/yy"
                value={this.state.onwarddate}
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
                onChange={(e) => this.setState({ onwarddate: e.value })}
                showIcon
              />
            </div>

            <div className="form-group col-md-10">
              <label htmlFor="from">Source Place:</label>
              <AutoComplete
                style={{ background: "#000000" }}
                value={this.state.fromSelect}
                suggestions={this.state.filteredFrom}
                completeMethod={this.filterFromPlace}
                size={30}
                placeholder="From Place"
                minLength={1}
                onChange={(e) => this.setState({ fromSelect: e.value })}
              />
            </div>

            <div className="form-group col-md-10">
              <label htmlFor="to">Destination:</label>
              <AutoComplete
                style={{ background: "#000000" }}
                value={this.state.toSelect}
                suggestions={this.state.filteredTo}
                completeMethod={this.filterToPlace}
                size={30}
                placeholder="To Place"
                minLength={1}
                onChange={(e) => this.setState({ toSelect: e.value })}
              />
            </div>

            <div className="form-group col-md-10">
              <input
                type='submit'
                value='Search Buses'
                style={{ marginLeft: '20px' }}
                onClick={this.handleRegister}
                className="btn btn-primary"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Welcome;