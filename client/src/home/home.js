import React, { Component } from "react";
import Helmet from "react-helmet";
import { Button, Header } from "semantic-ui-react";
import { TiCamera, TiWarning } from "react-icons/ti";
import { Phone } from "../_common";

const Text = ({ children }) => <p>{children}</p>;

// Adjust this list of components to fit to the components you
// trained the machine to recognize. This example uses semantic-ui
// for rendering components. You can find documentation about the
// available props for each component here: https://react.semantic-ui.com/
// For the text component, I just threw in the paragraph output
// you see above this explanation :)

const availableComponents = {
  button: {
    component: Button,
    text: "Click here",
    props: {
      primary: true
    }
  },
  headline: {
    component: Header,
    text: "Large Header",
    props: {
      size: "large",
      as: "h2"
    }
  },
  text: {
    component: Text,
    text:
      "Nancy, seriously, you're gonna be so cool now, it's ridiculous. If we’re both going crazy, then we’ll go crazy together, right? Friends don't lie. He’s a sensitive kid. Is he? He’s missing, is what he is!"
  }
};

class Home extends Component {
  state = {
    components: [],
    hasConnectionError: false
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
      if (!Object.keys(availableComponents).includes(componentName)) {
        console.warn(
          `There is no component called "${componentName}" in the list of available components. You should either add "${componentName}" to the list or adjust your machine learning to not recognize this component.`
        );
        return null;
      }
      const tempItem = availableComponents[componentName];
      const TempComponent = tempItem.component;
      return (
        <TempComponent key={componentKey} {...tempItem.props}>
          {tempItem.text}
        </TempComponent>
      );
    });
    return (
      <div className="homeWrapper">
        <Helmet>
          <title>Wireframe to Code demo</title>
        </Helmet>
        <Phone>
          {this.state.hasConnectionError && (
            <div className="homeError">
              <TiWarning className="homeIconSpacer" size={64} />
              <h2>Sorry, no connection!</h2>
              <p>
                You need to start the node server in order to receive scanned
                components here!
              </p>
            </div>
          )}
          {!this.state.components.length && (
            <div className="homeError">
              <TiCamera className="homeIconSpacer" size={64} />
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
