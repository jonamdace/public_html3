'use strict';
import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Menu extends Component {
    constructor(props: Object) {
        super(props);
        var {height, width} = Dimensions.get('window');

        this.state = {
            height : height,
            width : width
        }
    }


    updateLayout(){
        var {height, width} = Dimensions.get('window');
        this.setState({height : height, width : width});
    }

    render() {
        var inputWidth = this.state.width-30;
        var layoutWidth = this.state.width;

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth}]} onLayout={()=> this.updateLayout()}>
                <View style={[{height : 150, width : layoutWidth, backgroundColor: "#59C2AF"}]}>
                    <Text style={{textAlign:"center"}} >testef</Text>
                </View>
                <View style={[{height : this.state.height - 150, width : layoutWidth, backgroundColor: "#FFF"}]}>
                    <Text style={{textAlign:"center"}} >testef</Text>
                </View>
            </View>
            );
    }
}