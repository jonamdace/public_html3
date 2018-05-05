import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage, Image} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ViewHistory extends Component {

    constructor(props: Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            isLoading : false,
            isCancelable : true,
            height : height,
            width : width,
        };
        this.navigate=this.props.navigateTo;
    }

    async componentDidMount() {

    }


    renderRow(){
        return <View style={{ padding : 10}}>
            <View style={{flexDirection : 'row'}}>
                <Text>S.No # : </Text>
                <Text></Text>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Text>Action</Text>
                <Text></Text>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Text>Page Name : </Text>
                <Text></Text>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Text>Date : </Text>
                <Text></Text>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Text>Description : </Text>
                <Text></Text>
            </View>
        </View>;
    }

    render() {
        return(<View>{this.renderRow()}</View>);
    }

}