# Wireframes to Code

:warning: this is a Hackweek project and by no means good™ or beautiful™ code. It's working, though! :warning:

> if machine learning algorithms can classify a complex set of thousands of handwritten symbols — such as handwritten Chinese characters — with a high degree of accuracy, then we should be able to classify the [.] components within our system and teach a machine to recognize them.

([Sketching Interfaces](https://airbnb.design/sketching-interfaces/) by Airbnb)

This repo contains both the server and the client for a setup as described in the Airbnb blog post.

## Installation

1. Run `yarn` in both the `client` and `server` folder to install all required packages.
1. Start the server from within the `server` folder with `node index.js`.
1. Start the client from within the `client` folder with `hops start`.

## What else is needed?

You have to setup a machine learning app that is able to classify your sketches. This is how you do it:

1. Follow the [Getting Started guide](https://github.com/ml4a/ml4a-ofx#getting-started) from ml4a-ofx for the DoodleClassifier example.
    - You might run into a bug with the `data` path, described [here](https://github.com/ml4a/ml4a-ofx/issues/22)
2. Adjust the `classifyCurrentSamples()` function to add the image coordinates. This is needed to sort the classified images in the correct order. Basically copy and paste this (the last part with the `sendMessage` action is where we add additional info besides the label):

```
void ofApp::classifyCurrentSamples()
{
    ofLog(OF_LOG_NOTICE, "Classifiying on frame " + ofToString(ofGetFrameNum()));
    gatherFoundSquares();
    for (int i = 0; i < foundSquares.size(); i++)
    {
        vector<float> encoding = ccv.encode(foundSquares[i].img, ccv.numLayers() - 1);
        VectorFloat inputVector(encoding.size());
        for (int i = 0; i < encoding.size(); i++)
            inputVector[i] = encoding[i];
        if (pipeline.predict(inputVector))
        {
            // gt classification
            int label = pipeline.getPredictedClassLabel();
            foundSquares[i].isPrediction = true;
            foundSquares[i].label = classNames[label];

            // send over OSC
            ofxOscMessage m;
            m.setAddress(oscAddress);
            m.addStringArg(foundSquares[i].label);
            m.addFloatArg(foundSquares[i].area);
            m.addIntArg(foundSquares[i].rect.x);
            m.addIntArg(foundSquares[i].rect.y);
            m.addIntArg(foundSquares[i].rect.width);
            m.addIntArg(foundSquares[i].rect.height);
            sender.sendMessage(m, false);
        }
    }
}
```

3. Adjust the list of components the machine should learn accordingly – of course your client should know how to handle the different classified components. This repo currently has four different components included (button, userinfo, headline, text).
4. Compile the DoodleClassifier
5. Teach the machine through providing examples
6. Hope that the machine has learned enough. Happy classifying :rocket:

I tried to teach the machine different sketching styles through examples from a broader group of people. This will take a lot more samples than you'd need if only one person provides sketches. You will achieve better quick results if you restrict the samples to one style of sketches. With enough samples, you should be able to teach the machine sufficiently to recognize components across sketching styles. But as time is a constraint in a HackWeek, ain't nobody got time for that :laughing:

### Known bugs

The server will crash through reloading – it tries to open up port 5000 again which of course makes no sense. Had no time to fix this. Happy to get a pull request on this :blush:
