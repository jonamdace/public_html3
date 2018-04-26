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
            mobileNumber : '',
            address : '',
            districtId : '',
            stateId : '',
            emailId : '',
            name : '',
            userid : '',
            userCode : '',
            userImage : '',
        };
        this.navigate=this.props.navigateTo;
    }

   async componentDidMount() {

       var userid = await AsyncStorage.getItem('userid');

       var postJson = new FormData();
        postJson.append("userid", userid);
        postJson.append("rf", "json");
        var subUrl="getUserDetailsFromApps";
        var response = await doPost(subUrl, postJson);
       if(response != null && response != "" && response != undefined){

           this.setState({
               userCode : response.userCode,
               userImage : response.img,
               mobileNumber : response.mobile,
               address : response.address,
               districtId : response.districtId,
               stateId : response.stateId,
               emailId : response.email,
               name : response.name
           });
       }
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

        var filePath = ConfigVariable.uploadedUserProfileFilePath;
        var srcImg = noimage;
        var userImage = this.state.userImage;
        if(userImage !="" && userImage!=null){
            srcImg = { uri : filePath + this.state.userCode+'/'+ userImage }
        }
        var imgContent = <Image source={srcImg} style={{width: inputWidth, height: 200, resizeMode: Image.resizeMode.contain, alignSelf:'center', justifyContent :'center', borderRadius:90}} ></Image>;
        var username = this.state.username;

        var dynamicBtn = <MKButton onPress={()=> this.onPressRedirect("EditMyProfile")} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF',width: 100, height:50, borderRadius:5}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
            <Icon name="ios-create-outline" size={25} color={"#FFF"} /> Edit
        </MKButton>;


        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]} onLayout={()=> this.updateLayout()}>

                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
                        <View style={{justifyContent :'center', overflow:'hidden',width: inputWidth, height: 200, alignSelf:"center", marginTop: 15, marginBottom: 15}}>
                            {imgContent}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: inputWidth - 100}}>

                            </View>
                            <View style={{width: 100}}>
                                {dynamicBtn}
                            </View>
                        </View>

                        { this.renderRowData(inputWidth, "Mobile", this.state.mobileNumber) }
                        { this.renderRowData(inputWidth, "Email",  this.state.emailId) }
                        { this.renderRowData(inputWidth, "State",  this.state.stateId) }
                        { this.renderRowData(inputWidth, "City",  this.state.districtId) }
                        { this.renderRowData(inputWidth, "Address",  this.state.address) }

                        <View style={{paddingTop: 30}}></View>
                    </View>
                </ScrollView>
                <MKSpinner visible={this.state.isLoading} textContent={"Please wait"} cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}} />
            </View>
        );
    }
}
