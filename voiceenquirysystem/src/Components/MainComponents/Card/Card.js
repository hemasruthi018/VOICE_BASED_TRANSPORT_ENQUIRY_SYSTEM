import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Buses: [], // Array to store the buses
      bookedbus: -1 // Track the selected bus for booking
    };
  }

  componentDidMount() {
    if (this.props.sbus === true) {
      const buses = [];
      const routeIds = this.props.routeids;

      if (routeIds.length === 0) {
        console.log("No route IDs provided");
        return;
      }

      // Fetch buses for each RouteId
      Promise.all(
        routeIds.map(id =>
          fetch(`http://localhost:3001/fetchBuses/${id}`)
            .then(res => res.json()) // Parse JSON automatically
            .then(data => {
              console.log(`Buses for RouteID ${id}:`, data); // Log each response
              buses.push(...data); // Store the buses in the array
            })
            .catch(err => console.log('Error fetching buses:', err))
        )
      )
        .then(() => {
          if (buses.length > 0) {
            this.setState({ Buses: buses });
            console.log("All fetched buses:", buses); // Log the final list of buses
          } else {
            console.log("No buses found for any route.");
          }
        })
        .catch(err => console.error('Error during bus fetching:', err));
    }
  }

  handleBusClick = (index) => {
    this.setState({ bookedbus: index }, () => {
      this.props.SetBus(this.state.Buses[this.state.bookedbus]); // Set selected bus
      this.props.onRouteChange('test'); // Navigate to seat selection page
    });
  };

  LoadBuses = () => {
    if (this.state.Buses.length === 0) {
      console.log('No buses available to display.');
      return <p>No buses found</p>;
    }

    return this.state.Buses.map((bus, index) => (
      <div
        key={index}
        className="bg-light-yellow br3 pa3 ma2 br2 grow" // Added grow class to restore clickable area responsiveness
        style={{ width: "550px", margin: "0 auto", marginBottom: "20px", cursor: 'pointer' }}
        onClick={() => this.handleBusClick(index)}  // Click handler for the bus card
      >
        <div>
          <div className="clearfix row-one">
            <div className="column-two p-right-10 w-30 fl">
              <div className="travels lh-24 f-bold d-color">{bus.AgencyName}</div>
              <div className="bus-type f-15 m-top-16 l-color">{bus.AC === 0 ? "Non-AC" : "AC"}</div>
              <img src={`https://robohash.org/${index}?200x200`} alt="bus" style={{ width: "50px", height: "50px" }} />
            </div>
            <div className="column-three p-right-10 w-10 fl">
              <div className="dp-time f-15 d-color f-bold">{bus.StartTime}</div>
            </div>
            <div className="column-four p-right-10 w-20 fl">
              <div className="dur l-color lh-12">{bus.TravelTime} hrs.</div>
              <div className="bus-type f-15 m-top-16 d-color">Travel Time</div>
            </div>
            <div className="column-eight w-15 fl">
              <div className="seat-left m-top-16">{bus.TotalSeats - bus.ReservedSeats} <span className="l-color"> Seats available</span></div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  render() {
    if (this.props.sbus === true) {
      return (
        <div>{this.LoadBuses()}</div>
      );
    } else {
      return (
        <div className="bg-light-yellow dib br3 pa3 ma2 grow">
          <h4>Bus Info Placeholder</h4>
        </div>
      );
    }
  }
}

export default Card;
