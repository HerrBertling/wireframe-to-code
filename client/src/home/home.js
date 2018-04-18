import React, { Component } from "react";
import Helmet from "react-helmet";
import { Button, Header } from "semantic-ui-react";
import Camera from 'react-icons/lib/ti/camera';
import Warning from 'react-icons/lib/ti/warning-outline';
import { Phone } from "../_common";

class Home extends Component {
  state = {
    components: [],
    hasConnectionError: true
  };

  runWebSocket = () => {
    const connection = new WebSocket("ws://localhost:4242");

    connection.onopen = () => {
      console.log("I am open!");
      this.setConnectionError(false);
    };

    // Log errors
    connection.onerror = error => {
      this.setConnectionError(true);
    };
    // Log messages from the server
    connection.onmessage = message => this.getMessageIntoState(message);
  };

  setConnectionError = state => {
    this.setState({
      hasConnectionError: state
    });
  };

  getMessageIntoState = message => {
    let newComponents = this.state.components;
    let messageToArray = message.data.slice(1, -1).split(",");
    newComponents.push(messageToArray);
    newComponents.sort((a, b) => {
      let numberA = parseInt(a[3], 10);
      let numberB = parseInt(b[3], 10);
      if (numberA === numberB) {
        return 0;
      } else {
        return numberA < numberB ? -1 : 1;
      }
    });
    console.log(newComponents);
    this.setState({
      components: newComponents
    });
  };

  componentDidMount() {
    this.runWebSocket();
  }

  render() {
    const componentList = this.state.components.map(component => {
      const componentName = component[0];
      const componentKey = component[1] + component[2] + component[3];
      if (componentName === '"button"') {
        return (
          <div>
            <Button primary key={componentKey}>Click here!</Button>
          </div>
        );
      }
      if (componentName === '"headline"') {
        return <Header key={componentKey} size='large'>Large Header</Header>;
      }
      if (componentName === '"text"') {
        return (
          <p key={componentKey}>
            Nancy, seriously, you're gonna be so cool now, it's ridiculous. If
            we’re both going crazy, then we’ll go crazy together, right? Friends
            don't lie. He’s a sensitive kid. Is he? He’s missing, is what he is!
          </p>
        );
      }
    });
    return (
      <div className='homeWrapper'>
        <Helmet>
          <title>Wireframe to Code demo</title>
        </Helmet>
        <Phone>
          {this.state.hasConnectionError && (
            <div className="homeError">
              <Warning className="homeIconSpacer" size={64} />
              <h2>Sorry, no connection!</h2>
              <p>
                You need to start the node server in order to receive scanned
                components here!
              </p>
            </div>
          )}
          {!this.state.components.length && (
            <div className="homeError">
              <Camera className="homeIconSpacer" size={64} />
              <h2>Please scan components!</h2>
              <p>
                You need to scan components via the DoodleClassifier to see
                things here!
              </p>
            </div>
          )}
          {!this.state.hasConnectionError &&
            this.state.components.length && (
              <div className="homeContentWrapper">
                <div className="homeComponentWrapper">{componentList}</div>
              </div>
            )}
        </Phone>
      </div>
    );
  }
}

export default Home;
