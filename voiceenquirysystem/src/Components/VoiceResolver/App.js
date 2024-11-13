import React from 'react';
import Artyom from 'artyom.js';
import ArtyomCommandsManager from './ArtyomCommands.js';

const Jarvis = new Artyom();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artyomActive: false,
      textValue: ''
    };
    this.CommandsManager = new ArtyomCommandsManager(Jarvis);
    this.CommandsManager.loadCommands();
  }

  componentDidMount() {
    // Automatically start the assistant and play a welcome message on page load
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("I'm Leader Bot of this Westworld. Me and my team of bots will assist you with bookings. Click on one of us if you need help."));
  }

  startAssistant = () => {
    // Initialize Artyom and start listening
    Jarvis.initialize({
      lang: "en-GB",
      debug: true,
      continuous: true,
      soundex: true,
      listen: true
    }).then(() => {
      this.setState({ artyomActive: true });
    }).catch((err) => console.error("Error initializing Artyom:", err));

    // Redirect recognized text to the state and optionally display in an input
    Jarvis.redirectRecognizedTextOutput((recognizedText, isFinal) => {
      if (isFinal) {
        this.setState({ textValue: recognizedText });
        const targetInput = document.getElementById(this.props.id);
        if (targetInput) {
          targetInput.value = recognizedText;
        }
      }
    });
  }

  stopAssistant = () => {
    Jarvis.fatality().then(() => {
      this.setState({ artyomActive: false });
    }).catch((err) => console.error("Error stopping Artyom:", err));
  }

  handleTextChange = (event) => {
    this.setState({ textValue: event.target.value });
  }

  render() {
    return (
      <div>
        <textarea
          id={this.props.id}
          value={this.state.textValue}
          onChange={this.handleTextChange}
          style={{ width: "200px", height: "auto" }}
          placeholder="Speak here..."
        />
        <button onClick={this.startAssistant} disabled={this.state.artyomActive}>Start Voice</button>
        <button onClick={this.stopAssistant} disabled={!this.state.artyomActive}>Stop Voice</button>
      </div>
    );
  }
}
