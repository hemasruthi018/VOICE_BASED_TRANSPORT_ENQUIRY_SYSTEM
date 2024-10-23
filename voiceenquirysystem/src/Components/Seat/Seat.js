import React, { Component } from 'react';
import tachyons from 'tachyons';
import './Seat.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ScrollPanel } from 'primereact/scrollpanel';
import SeatRow from './SeatRow/SeatRow';

class Seat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reserved: 0,
      seatsfilled: [],
      seatsbooked: []
    };
  }

  componentDidMount() {
    if (!this.props.seldate || isNaN(new Date(this.props.seldate))) {
      console.log('Invalid travel date detected in Seat.js');
      return;  // Prevent further execution if the date is invalid
    }
  
    fetch('http://localhost:3001/BookedSeats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traveldate: this.props.seldate,
        busregnno: this.props.bus.BusRegnNo
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ seatsfilled: data });
      console.log(this.state);
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  

  handleBooking1 = () => {
    this.handleBooking();
  };

  handleBooking = () => {
    if (this.state.seatsbooked.length === 0) {
      alert("Please select at least one seat to continue.");
      return;
    }
  
    fetch('http://localhost:3001/Tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traveldate: this.props.seldate,
        busregnno: this.props.bus.BusRegnNo,
        seatsbooked: this.state.seatsbooked,
        starttime: this.props.bus.StartTime,
        routeid: this.props.bus.RouteID,
        driverid: this.props.bus.DriverID
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Error booking seats: " + JSON.stringify(data.error));
      } else if (!data.pnr) {
        alert("Error: No PNR generated. Booking failed.");
      } else {
        this.props.setPNR(data.pnr);
        this.props.setbooked(this.state.seatsbooked);
        this.finalizeBooking(data.pnr);
      }
    })
    .catch(err => console.log("Booking error:", err));
  };
  

  finalizeBooking = (pnr) => {
    fetch('http://localhost:3001/SeatsBooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pnr: pnr,  // Use the pnr passed from handleBooking
        traveldate: this.props.seldate,
        busregnno: this.props.bus.BusRegnNo,
        seatsbooked: this.state.seatsbooked,
        starttime: this.props.bus.StartTime,
        routeid: this.props.bus.RouteID,
        driverid: this.props.bus.DriverID
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ response2: data });
      if (!this.state.response2.error) {
        this.bookThrough(pnr);
      } else {
        alert("Error inserting into SeatsBooking: " + JSON.stringify(this.state.response2.error));
      }
    })
    .catch(err => console.log(err));
  };
  

  bookThrough = (pnr) => {
    fetch('http://localhost:3001/Through', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pnr: pnr,  // Use the pnr passed from finalizeBooking
        traveldate: this.props.seldate,
        busregnno: this.props.bus.BusRegnNo,
        seatsbooked: this.state.seatsbooked,
        starttime: this.props.bus.StartTime,
        routeid: this.props.bus.RouteID,
        driverid: this.props.bus.DriverID
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ response3: data });
      if (!this.state.response3.error) {
        alert("Booking successful!");
        this.props.onRouteChange('testing');
      } else {
        alert("Error booking seats: " + JSON.stringify(this.state.response3.error));
      }
    })
    .catch(err => console.log(err));
  };
  

  pay = (text, op) => {
    text = text.toString(10);

    let ul = document.getElementById('mylist');
    if (op === '1') {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(text));
      if (!this.state.seatsbooked.includes(parseInt(text))) {
        this.state.seatsbooked.push(parseInt(text));
      }
      ul.appendChild(li);
    } else {
      for (let x = 0; x < ul.childNodes.length; x++) {
        if (ul.childNodes[x].textContent === text) {
          ul.removeChild(ul.childNodes[x]);
          this.setState({
            seatsbooked: this.state.seatsbooked.filter(n => n !== parseInt(text))
          });
        }
      }
    }
    console.log(this.state);
  };

  onreserved = (x) => {
    this.setState(prevState => ({
      reserved: prevState.reserved + x
    }));
  };

  render() {
    const seatrow = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30],
      [31, 32, 33, 34, 35],
      [36, 37, 38, 39, 40]
    ];

    return (
      <div className='wraps pa2 center'>
        <div className='Headdiv'>
          <h3 className='face pa3 ba b--green bg-lightest-blue'>Book Seats</h3>
        </div>

        <div className='Content'>
          <ScrollPanel style={{ width: '400px', height: 'auto' }}>
            <div className='rowC'>
              <div>
                {seatrow.map((row, idx) => (
                  <SeatRow
                    key={idx}
                    filled={this.state.seatsfilled}
                    seatrow={row}
                    change={this.pay}
                    reserve={this.onreserved}
                  />
                ))}
              </div>

              <div className="booking-details">
                <div id="legend" className="seatCharts-legend">
                  <ul className="seatCharts-legendList">
                    <li className="seatCharts-legendItem">
                      <div className="seatCharts-seat seatCharts-cell booked"></div>
                      <span className="seatCharts-legendDescription">Already Booked</span>
                    </li>
                    <li className="seatCharts-legendItem">
                      <div className="seatCharts-seat seatCharts-cell avail"></div>
                      <span className="seatCharts-legendDescription">Available</span>
                    </li>
                  </ul>
                </div>
                <h3> Selected Seats (<span id="counter">{this.state.reserved}</span>):</h3>
                <ul id="mylist"></ul>
                Total: <b>₹<span id="total">({this.state.reserved * 300})</span></b>

                <button className="checkout-button" onClick={this.handleBooking1}>Pay Now</button>
              </div>
            </div>
          </ScrollPanel>
        </div>
      </div>
    );
  }
}

export default Seat;
