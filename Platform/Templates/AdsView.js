'use strict';
import React, {Component, PropTypes} from "react";
import {
	View, 
	Text, 
	TouchableOpacity, 
	StyleSheet,
	Platform,
	Dimensions,
	ScrollView,
	Image
	} from "react-native";

import MKSpinner from "../Component/MKSpinner";
import MKCard from "../Component/MKCard";
import Divider from '../Component/divider/Divider';
import colors from '../Component/config/colors';
import ConfigVariable from '../Component/config/ConfigVariable';
var banner = require('../images/1stepshop-1.jpg');
import CommonStyle from "../Styles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome';
import { doPost } from "../Component/MKActions";

import Swiper from 'react-native-swiper';
var {height, width} = Dimensions.get('window');
export default class AdsView extends Component {
	static navigationOptions = { title: 'AdsView', header: null };
  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
	    	super(props);
		this.state = {
			isLoading : false,
			height : height,
			width : width,
			singleAdsJson : {},
			adsgalleryDetails:{}
		};
		this.navigate=this.props.navigateTo;
	}

	updateLayout(){
		var {height, width} = Dimensions.get('window');
		this.setState({height : height, width : width});
	}



	async componentDidMount() {
	        var paramsData = this.props.value;
		var singleAdsJson = null;
		var adsgalleryDetails = null;
		var that = this;
		if(paramsData != null){
			var adsId = paramsData['adsId'];
			var postJson = new FormData();
			postJson.append("rf", "json");
			var subUrl = "singleItem/"+adsId;
			var response = await doPost(subUrl, postJson);
			if(response != null){
				singleAdsJson = response['adsDetails']
				adsgalleryDetails = response['adsgalleryDetails']
			}
		}

		this.setState({singleAdsJson : singleAdsJson, adsgalleryDetails : adsgalleryDetails});

		//alert(JSON.stringify(this.state.adsgalleryDetails));
	}

	updateMyState(value, keyName){
		this.setState({
			[keyName] : value
		});
	}

	onPressRedirectToGoBack(routes){
    		this.props.navigation.goBack();
		this.navigate(routes);
	}

	onPressRedirectToPassData(routes, postJson){
		this.navigate(routes, postJson);
	}

	render() { 
		var deviceWidth = this.state.width;

		var adsJson = this.state.singleAdsJson;
		var descContent = null;
		var fileName = null;
		var fileImage = null;
		if(adsJson != null && adsJson.length>0){
			var singleAdsJson = adsJson[0];
		descContent = <View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Ads Code
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['adsCode']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Title
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['adsTitle']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Price
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['offerPrice']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Description
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['description']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Country
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['country']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					State
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['state']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					City
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['city']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow ]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Posted On
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['createdAt']}
				</Text>
			</View>
		</View>;


		}
		var adsgalleryDetails = this.state.adsgalleryDetails; 
		var adsGalleryCount = 0;
		if(adsgalleryDetails != null && adsgalleryDetails != undefined){	
			adsGalleryCount = adsgalleryDetails.length;
			if(adsGalleryCount>0){
				fileName = adsgalleryDetails[0]['file_name'];
			}
		}
		var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
		if(fileName != null){
			filePath = ConfigVariable.uploadedAdsFilePath + '/' + singleAdsJson['userCode'] + '/' + singleAdsJson['adsCode'] + '/' + fileName;
			fileImage = <Image source={{uri: filePath }}  resizeMode={'stretch'} >
<View style={[CommonStyle.slide1, {height : 300}]}>
		</View>
</Image>
		} else {
			fileImage = <Image source={{uri: filePath }} >
		<View style={[CommonStyle.slide1]}>
		</View>
</Image>
		}
/*
		if(singleAdsJson != null){
			descContent = Object.keys(singleAdsJson).map((key)=> {
				return <View  key={key}>
					<Text  style={{ flexDirection : 'row', backgroundColor: '#59C2AF', minHeight:40, textAlign:'center', fontSize: 14}}>
						{ key }
					</Text>
					<Text  style={{ flexDirection : 'row', backgroundColor: '#FFF', minHeight:50, padding: 10, alignItems:'center'}}>
						{singleAdsJson[key]}
					</Text>
				</View>;
			})
		}*/




    		return ( 
<View style={[{height : this.state.height, flex: 1, width : deviceWidth, backgroundColor:'#59C2AF'}]} 
	onLayout={()=> this.updateLayout()} >
	<ScrollView >
		<View style={[CommonStyle.wrapper]} >
<TouchableOpacity style={[CommonStyle.button, {top: 5, left: 0, position:'absolute', width:60, alignItems:'center'}]} onPress={()=>this.onPressRedirectToGoBack()} >
<Icon name='arrow-left' color='#fff' size={18} style={{paddingTop:5}}/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>this.onPressRedirectToPassData('AdsGallery', {data: this.state.adsgalleryDetails, singleAdsJson : this.state.singleAdsJson})}>
{fileImage}
		
</TouchableOpacity>

<View style={[CommonStyle.button, {top: 210, left: 10, position:'absolute', width:70, alignItems:'center', flexDirection:'row'}]} >
<Icon name='camera' color='#fff' size={18} style={{paddingTop:5}}/>
<Text style={{fontWeight:'bold', paddingTop : 5}}>  {adsGalleryCount}</Text>
</View>

		</View>
		{
			descContent		
		}
	</ScrollView>
</View>
		);
	}
}
