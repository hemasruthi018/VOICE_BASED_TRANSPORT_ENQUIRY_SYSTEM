import React, { Component } from 'react';
import './Message.css';
import Card from '../MainComponents/Card/Card.js';
import tachyons from 'tachyons';
import Logo from '../Logo/Logo';

class Message extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }

  componentDidMount() {
    // Set up welcome message to be spoken on every load or reload
    window.onload = () => {
      this.speak("I'm Leader Bot of this Westworld. Me and my team of bots will be assisting you for booking. If at any point, you are struck with what to do, click on one of us. We'll help you.");
    };
  }

  speak = (text) => {
    const synth = window.speechSynthesis;

    // Stop any currently active speech before starting new speech
    if (synth.speaking) {
        synth.cancel();
    }

    const speakText = new SpeechSynthesisUtterance(text);

    speakText.onend = () => console.log('Done speaking...');
    speakText.onerror = () => console.error('Speech synthesis error');

    // Start speaking
    synth.speak(speakText);

    // Set a timeout to stop speaking after 2 seconds
    setTimeout(() => {
        if (synth.speaking) {
            synth.cancel();
            console.log('Speech synthesis stopped after 2 seconds');
        }
    }, 6000); // 2000 milliseconds = 2 seconds
};

  handleClick1 = () => this.speak("Click the button on my right side, to Book a bus");
  handleClick2 = () => this.speak("To Search Bus Location, Click the button on my right side");
  handleClick3 = () => this.speak("Looking to Sign in or Register?");
  handleClick4 = () => this.speak("Are you interested in knowing more? Click to learn About us");

  togglePopup = () => this.setState({ showPopup: !this.state.showPopup });

  render() {
    return (
      <div className='broc'>
        <img onClick={this.handleClick} alt='bus' src={'https://robohash.org/leaderbot'} style={{ width: '80px', height: 'auto' }} />
        <p className="headeds" style={{ borderRadius: '55px 50px' }}>
          Hey I'm Leader Bot of this Westworld. My team of bots will be assisting you for booking.
          <br /> If at any point, you're unsure, click on one of us to enable voice help.
        </p>

        <div className='wrapped xyz'>
          <input type="text" className="face" value="What are you looking for?" style={{ marginLeft: '10px', height: '50px' }} disabled /><br />

          <img alt='bus' onClick={this.handleClick1} src={'https://robohash.org/1'} style={{ width: '80px', height: 'auto' }} />
          <input type="button" id="ip5" value="Book a bus" onClick={() => this.props.onRouteChange('signin')} readOnly /><br />

          <img alt='bus' onClick={this.handleClick2} src={'https://robohash.org/12'} style={{ width: '80px', height: 'auto' }} />
          <input type="button" id="ip5" value="Search Bus Location" onClick={() => this.props.onRouteChange('locating')} readOnly /><br />

          <img alt='bus' onClick={this.handleClick3} src={'https://robohash.org/16'} style={{ width: '80px', height: 'auto' }} />
          <input type="button" id="ip5" value="Sign In/Register" onClick={() => this.props.onRouteChange('signin')} readOnly /><br />

          <img alt='bus' onClick={this.handleClick4} src={'https://robohash.org/13'} style={{ width: '80px', height: 'auto' }} />
          <input type="button" id="ip5" value="About Us" onClick={this.togglePopup} readOnly /><br />
          
          {this.state.showPopup && (
            <Popup closePopup={this.togglePopup} />
          )}
        </div>
      </div>
    );
  }
}

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <p className='xyzz'>VOICE BASED AUTOMATED ENQUIRY SYSTEM V1.0</p>
          <p>© All Rights Reserved</p>
          <ul>
            <li>Easy to use interface</li>
            <li>Voice-enabled updates and retrievals</li>
            <li>24/7 software availability</li>
            <li>Optimal route suggestions for time and cost efficiency</li>
          </ul>
          <button style={{ background: '#00ff00' }} onClick={this.props.closePopup}>Close</button>
        </div>
      </div>
    );
  }
}

export default Message;
