import React, { Component } from 'react';
import {  AppRegistry } from 'react-native';
import SplashScreen  from '@remobile/react-native-splashscreen';
import App from "./Platform/App";
export default class OneStepShop extends Component {

    componentDidMount() {
        SplashScreen.hide();
    }

  render() {
    return (
      	<App />
    );
  }
}

AppRegistry.registerComponent('OneStepShop', () => OneStepShop);
