'use strict';
import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";

export default class EditProfile extends Component {

  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
	    	super(props);
		this.state = {
			isLoading : false,
			height : height,
			width : width,
			inputName : '',
			inputEmail : '',
			inputPassword : '',
			inputMobileNumber : ''
		};
	}

	componentDidMount() {

	}

	editMyProfile(){
		var inputEmailValue = this.state.inputEmail;
		var inputMobileNumberValue = this.state.inputMobileNumber;
		var inputNameValue = this.state.inputName;

		//alert(this.state.inputEmail + "test"+ this.state.inputMobileNumber);
		if(!this.state.isLoading){
			this.setState({isLoading : true});
		} else {
			this.setState({isLoading : false});
		}
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

	render() { 
		var inputWidth = this.state.width-30;
		var layoutWidth = this.state.width;
		var inputHeight = 38;
		var inputFontSize = 16;
		var inputHighlightColor = "#00BCD4";
		return (
		<View style={[{height : this.state.height, flex: 1, width : layoutWidth}]} onLayout={()=> this.updateLayout()}>
		<Navbar
		    title={"Edit Profile"}
		    bgColor={"orange"}
		    left={{
			icon: "ios-arrow-back",
			onPress: () => this.onPressRedirect('LoginScreenForCustomer')
		    }}
		    style={{height:60}}
		/>

			<ScrollView >
		      		<View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
					<MKTextInput label={'Name'} highlightColor={inputHighlightColor} 
						onChangeText={(inputName) => this.updateMyState(inputName, 'inputName')}
						value = {this.state.inputName}
						inputStyle={{fontSize: inputFontSize, height: inputHeight, width: inputWidth}} />

					<MKTextInput label={'Mobile Number'} highlightColor={inputHighlightColor}
						onChangeText={(inputMobileNumber) => this.updateMyState(inputMobileNumber, 'inputMobileNumber')}
						value = {this.state.inputMobileNumber}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}} />

					<MKTextInput label={'Email'} highlightColor={inputHighlightColor}  
						onChangeText={(inputEmail) => this.updateMyState(inputEmail, 'inputEmail')}
						value = {this.state.inputEmail}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}} />

					<MKTextInput label={'Password'} highlightColor={inputHighlightColor}  
						onChangeText={(inputPassword) => this.updateMyState(inputPassword, 'inputPassword')}
						value = {this.state.inputPassword}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}} />

					<View style={{paddingTop: 30}}></View>
				</View>
			</ScrollView>
			<MKButton isLoading={this.state.isLoading} onPress={()=> this.editMyProfile()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
				UPDATE PROFILE
			</MKButton>
		</View>
		);
	}
}
