import React, { Component, PropTypes } from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { Container, Navbar } from 'navbar-native';
import Icon from 'react-native-vector-icons/Ionicons';



export default class MyCustomizedNavBar extends Component {

  static contextTypes = {
    drawer: PropTypes.object.isRequired,
  };
  
  render() {
    return (
      <Navbar 
        title = {this.props.title}
        bgColor = {"orange"}
        left = {<Icon name="md-menu" size={32} color={"#FFF"} onPress={this.context.drawer.open} style={{padding:15}}/>}
        style = {{height:60}}
        titleColor = {"#FFF"}
    />
    )
  }
}
