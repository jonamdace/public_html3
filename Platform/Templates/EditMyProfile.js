'use strict';
import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage, Image} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Navbar } from 'navbar-native';
import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import MKSpinner from "../Component/MKSpinner";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
var ImagePicker = require('react-native-image-picker');

export default class EditMyProfile extends Component {

    constructor(props: Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            isLoading : false,
            isCancelable : true,
            height : height,
            width : width,
            errorsJson:{
                address : null,
                districtId : null,
                stateId : null,
                emailId : null,
                name : null
            },
            address : '',
            districtId : '',
            stateId : '',
            emailId : '',
            name : '',
            userid : '',
            userImagePath : '',
            avatarSource : null,
            avatarSourceUri : null,
            avatarSourceName : null,
            avatarSourceFileType : null

        };
        this.navigate=this.props.navigateTo;
    }

    async componentDidMount() {

        var userid = await AsyncStorage.getItem('userid');
        this.setState({
            userid : userid
        });

        var postJson = new FormData();
        postJson.append("userid", userid);
        postJson.append("rf", "json");
        var subUrl="getUserDetailsFromApps";
        var response = await doPost(subUrl, postJson);
        if(response != null && response != "" && response != undefined){
            this.setState({
                address : response.address,
                districtId : response.districtId,
                stateId : response.stateId,
                emailId : response.email,
                name : response.name
            });
        }


        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
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

    focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    async updateMyProfile(){
        var that = this;
        var isValid = 1;
        var stateArray = that.state;
        var errorsJson = that.state.errorsJson;
        var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        Object.keys(errorsJson).forEach(function(key) {
            var stateArrayValue = stateArray[key];
            if(stateArrayValue == null || stateArrayValue==""){
                errorsJson[key] = "This field is required";
                isValid = 0;
            } else if( key == 'emailId' && emailReg.test(stateArrayValue) === false){
                errorsJson[key] = "Invalid Email Address";
                isValid = 0;
            }  else if( key == 'mobileNumber' && stateArrayValue.length!=10){
                errorsJson[key] = "Length should not be less than 10";
                isValid = 0;
            } else if( key == 'mobileNumber' && isNaN(stateArrayValue)){
                errorsJson[key] = "Invalid Mobile Number";
                isValid = 0;
            } else {
                errorsJson[key] = null;
            }
        });
        await that.updateMyState(errorsJson, 'errorsJson');
        if(isValid == 1){
            that.setState({isLoading : true});
            var postJson = new FormData();
            postJson.append("name", that.state.name);
            postJson.append("email", that.state.emailId);
            postJson.append("stateId", that.state.stateId);
            postJson.append("districtId", that.state.districtId);
            postJson.append("address", that.state.address);
            postJson.append("userid", that.state.userid);
            postJson.append('userFile', {
                uri: this.state.avatarSourceUri,
                type: this.state.avatarSourceFileType, // or photo.type
                name: this.state.avatarSourceName
            })
            postJson.append("rf", "json");
            var subUrl="updateMyProfile";
            var response = await doPost(subUrl, postJson);
            if(response != null && response != "" && response != undefined){
                var status = response.status;
                var message = response.message;
                var alertType = "";
                var title = "";
                if(status == 1){
                    alertType = 'success';
                    title = "Success!";
                } else {
                    title = "Error";
                    alertType = 'error';
                }
                MessageBarManager.showAlert({
                    title: title,
                    message: message,
                    alertType: alertType,
                    position: 'bottom',
                });
            }
            that.setState({isLoading : false});
        }
    }

    onFocus() {
        let errorsJson = this.state.errorsJson;
        var that = this;
        for (let name in errorsJson) {
            let ref = this.refs[name];
            if (ref && ref.isFocused()) {
                errorsJson[name] = null;
            }
        }
        that.updateMyState(errorsJson, 'errorsJson');
    }

    pickProfileImage(){

        var options = {
            title: 'Select Avatar',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    avatarSourceUri: response.uri,
                    avatarSourceName: response.fileName,
                    avatarSourceFileType : response.type
                });
            }
        });
    }

    removeImage(){
        this.setState({
            avatarSource : null
        });
    }

    render() {
        var inputWidth = this.state.width-30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";
        var that = this;
        var inputNameError = null;
        if(this.state.errorsJson.name != null){
            inputNameError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.name}</Text>;
        }

        var inputEmailError = null;
        if(this.state.errorsJson.emailId != null){
            inputEmailError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.emailId}</Text>;
        }

        var inputstateError = null;
        if(this.state.errorsJson.stateId != null){
            inputstateError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.stateId}</Text>;
        }

        var inputdistrictIdError = null;
        if(this.state.errorsJson.districtId != null){
            inputdistrictIdError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.districtId}</Text>;
        }

        var inputaddressError = null;
        if(this.state.errorsJson.address != null){
            inputaddressError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.address}</Text>;
        }

        var dynamicBtn = <MKButton onPress={()=> this.updateMyProfile()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
            Submit
        </MKButton>;
        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]} onLayout={()=> this.updateLayout()}>
                <Navbar
                    title={"Edit Profile"}
                    bgColor={'orange'}
                    left={{
                        icon: "ios-arrow-back",
                        onPress: () => this.onPressRedirect('MyProfile')
                    }}
                    style={{height:60}}
                    />
                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>

                        <MKTextInput label={'Name'} highlightColor={inputHighlightColor}
                                     onChangeText={(name) => this.updateMyState(name, 'name')}
                                     value = {this.state.name}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     returnKeyType={'next'} ref="name"
                                     onSubmitEditing={(event) => this.focusNextField('emailId')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputNameError }

                        <MKTextInput label={'Email'} highlightColor={inputHighlightColor}
                                     onChangeText={(emailId) => this.updateMyState(emailId, 'emailId')}
                                     value = {this.state.emailId}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     returnKeyType={'next'} ref="emailId"
                                     onSubmitEditing={(event) => this.focusNextField('state')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputEmailError }

                        <MKTextInput label={'State'} highlightColor={inputHighlightColor}
                                     onChangeText={(stateId) => this.updateMyState(stateId, 'stateId')}
                                     value = {this.state.stateId}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     maxLength={10} returnKeyType={'next'} ref="stateId"
                                     onSubmitEditing={(event) => this.focusNextField('districtId')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputstateError }

                        <MKTextInput label={'City'} highlightColor={inputHighlightColor}
                                     onChangeText={(districtId) => this.updateMyState(districtId, 'districtId')}
                                     value = {this.state.districtId}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     returnKeyType={'next'} ref="districtId"
                                     onSubmitEditing={(event) => this.focusNextField('address')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputdistrictIdError }

                        <MKTextInput label={'address'} highlightColor={inputHighlightColor}
                                     onChangeText={(address) => this.updateMyState(address, 'address')}
                                     value = {this.state.address}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     returnKeyType={'next'} ref="address"
                                     onSubmitEditing={(event) => this.focusNextField('address')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputaddressError }
                        <View style={{paddingTop: 30}}></View>

                        <View style={{flexDirection: 'row', padding: 5}}>

                            <TouchableOpacity onPress={()=> this.pickProfileImage()}>
                                <View
                                    style={{ width: 150, padding: 10, height : 50, borderRadius : 10, borderWidth: 1,  marginTop:5, marginBottom:10, borderColor: '#59C2AF', justifyContent : 'center', flexDirection: "row"}}>
                                    <Icon name='camera' color='#59C2AF' size={25}/>
                                    <Text style={{textAlign:"center", padding : 3, color : "#59C2AF"}}> Select a photo</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                this.state.avatarSource != null ?
                                    <View
                                        style={{ width: this.state.width - 190, height : 120, margin:5, borderRadius : 10, borderWidth: 1, borderColor: '#59C2AF'}}>
                                        <View>
                                            <Image source={this.state.avatarSource }
                                                   style={{width : this.state.width - 190, height : 120, borderRadius : 10}}/>
                                            <Icon name='times-circle' color='red' size={30}
                                                  style={{position : "absolute", top: 5, right : 5}}
                                                  onPress={()=> that.removeImage()}/>
                                        </View>

                                    </View> : null
                            }

                        </View>

                        <View style={{paddingTop: 30}}></View>
                    </View>
                </ScrollView>
                {dynamicBtn}
                <MKSpinner visible={this.state.isLoading} textContent={"Please wait"} cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}} />
                <MessageBarAlert ref="alert" />
            </View>
        );
    }
}
