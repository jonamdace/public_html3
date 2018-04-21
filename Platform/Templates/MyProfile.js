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

    render() {
        var inputWidth = this.state.width-30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";

        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var imgContent = <Image source={noimage} style={{width: 180, height: 180, resizeMode: Image.resizeMode.contain, alignSelf:'center', justifyContent :'center', borderRadius:90}} ></Image>;
        var username = this.state.username;

        var dynamicBtn = <MKButton onPress={()=> this.onPressRedirect("editMyProfile")} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF',width: 140, height:60, borderRadius: 30}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
            <Icon name="ios-create-outline" size={30} color={"#FFF"} style={{padding:10}}/> Edit Profile
        </MKButton>;


        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]} onLayout={()=> this.updateLayout()}>

                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
                        <View style={{justifyContent :'center', overflow:'hidden',width: inputWidth, height: 200, borderRadius:10, alignSelf:"center", marginTop: 15, marginBottom: 15, borderColor: "#59C2AF", borderWidth : 1}}>
                            {imgContent}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: inputWidth - 140}}>

                            </View>
                            <View style={{width: 140}}>
                                {dynamicBtn}
                            </View>
                        </View>
                        <View>
                            <Text style={{padding: 10, fontSize: 18, color:'grey'}}><Text style={{fontSize: 18, fontWeight : 'bold', color : '#16a085'}}>Mobile : </Text><Text>834478628</Text></Text>
                            <Text style={{padding: 10, fontSize: 18, color:'grey'}}><Text style={{fontSize: 18, fontWeight : 'bold', color : '#16a085'}}>Email : </Text><Text>mathan@mynap.in</Text></Text>
                            <Text style={{padding: 10, fontSize: 18, color:'grey'}}><Text style={{fontSize: 18, fontWeight : 'bold', color : '#16a085'}}>State : </Text><Text>834478628</Text></Text>
                            <Text style={{padding: 10, fontSize: 18, color:'grey'}}><Text style={{fontSize: 18, fontWeight : 'bold', color : '#16a085'}}>City : </Text><Text>834478628</Text></Text>
                            <Text style={{padding: 10, fontSize: 18, color:'grey'}}><Text style={{fontSize: 18, fontWeight : 'bold', color : '#16a085'}}>Address :  </Text><Text>1/96 chef nn, fkhf hjh, jnjnkjf jkfjklf jkfjlkf kjklj</Text></Text>
                        </View>
                        <View style={{paddingTop: 30}}></View>
                    </View>
                </ScrollView>
                <MKSpinner visible={this.state.isLoading} textContent={"Please wait"} cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}} />
            </View>
        );
    }
}
