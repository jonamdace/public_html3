'use strict';
import React, {Component, PropTypes} from "react";
import {View, Image, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import { Container, Navbar } from 'navbar-native';
import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import MKSpinner from "../Component/MKSpinner";
import ConfigVariable from '../Component/config/ConfigVariable';
import Icon from 'react-native-vector-icons/Ionicons';
import noimage from '../images/noimage.jpg'
export default class MyProfile extends Component {

    constructor(props: Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            isLoading : false,
            isCancelable : true,
            height : height,
            width : width,
            errorsJson:{
                inputPassword : null,
                inputRePassword : null
            },
            inputRePassword : '',
            inputPassword : ''
        };
        this.navigate=this.props.navigateTo;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    updateMyState(value, keyName){
        this.setState({
            [keyName] : value
        });
    }

    updateLayout(){
        var {height, width} = Dimensions.get('window');
        this.setState({height : height, width : width});
    }

    onPressRedirect(routes){
        this.navigate(routes);
    }


    renderRowData(inputWidth, label, value){
        return <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{width : 100}}>
                <Text style={{ fontSize: 16, fontWeight : 'bold', color : '#16a085'}}>{label}</Text>
            </View>
            <View style={{width: 20}}>
                <Text style={{ fontSize: 16, color:'grey'}}>:</Text>
            </View>
            <View style={{width: inputWidth - 120}}>
                <Text style={{ fontSize: 16, color:'grey'}}>{value}</Text>
            </View>
        </View>;
    }

    render() {
        var inputWidth = this.state.width-30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";

        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var imgContent = <Image source={noimage} style={{width: 200, height: 200, resizeMode: Image.resizeMode.contain, alignSelf:'center', justifyContent :'center', borderRadius:90}} ></Image>;
        var username = this.state.username;

        var dynamicBtn = <MKButton onPress={()=> this.onPressRedirect("EditMyProfile")} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF',width: 100, height:50, borderRadius:5}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
            <Icon name="ios-create-outline" size={25} color={"#FFF"} /> Edit
        </MKButton>;


        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]} onLayout={()=> this.updateLayout()}>

                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
                        <View style={{justifyContent :'center', overflow:'hidden',width: inputWidth, height: 200, borderRadius:10, alignSelf:"center", marginTop: 15, marginBottom: 15, borderColor: "#59C2AF", borderWidth : 1}}>
                            {imgContent}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: inputWidth - 100}}>

                            </View>
                            <View style={{width: 100}}>
                                {dynamicBtn}
                            </View>
                        </View>

                        { this.renderRowData(inputWidth, "Mobile", "8344798628") }
                        { this.renderRowData(inputWidth, "Email", "mathan@mynap.in") }
                        { this.renderRowData(inputWidth, "State", "8344798628") }
                        { this.renderRowData(inputWidth, "City", "8344798628") }
                        { this.renderRowData(inputWidth, "Address", "ghjghjg hhhj g h hghjg hghjg hjgjh gghghj hghjghj hgjhg jhgh jhggjhghjg hhj gh hghjghj") }

                        <View style={{paddingTop: 30}}></View>
                    </View>
                </ScrollView>
                <MKSpinner visible={this.state.isLoading} textContent={"Please wait"} cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}} />
            </View>
        );
    }
}
