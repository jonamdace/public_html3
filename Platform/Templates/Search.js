'use strict';
import React, {Component, PropTypes} from "react";
import {
	View, 
	ToastAndroid, 
	StyleSheet, 
	Animated, 
	Text, 
	TextInput, 
	ScrollView, 
	Dimensions, 
	TouchableOpacity, 
	Image, 
	ListView, 
	AsyncStorage
	} from "react-native";

import MKSpinner from "../Component/MKSpinner";
import SearchAdsContent from "./SearchAdsContent";
import { doPost } from "../Component/MKActions";

export default class Search extends Component {

  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
	    	super(props);
		 const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			isLoading : false,
			height : height,
			width : width,
			searchText : "",
			ds:ds,
			categoryId:3,
	    		listItems : ds.cloneWithRows([]),
			searchResultJson : {},
			page : "0",
			leftRecord : 0,
			previousPage : -1,
			nextPage : ""
		};
		this.navigate=this.props.navigateTo;
	}

	getValueFromArray(arraName, arrayIndex){
	if(arraName[arrayIndex] != "" && arraName[arrayIndex] != null && arraName[arrayIndex] != "null" && arraName[arrayIndex] != undefined){
		return arraName[arrayIndex];
	}
	return "";	
	}

	async componentDidMount() {
		var paramsArray = this.props.value;
		if(paramsArray != null){
			var searchText = this.getValueFromArray(paramsArray, 'searchText');
			var categoryId = this.getValueFromArray(paramsArray, 'categoryId');
			await this.setState({categoryId: categoryId, searchText : searchText});
		}
		await this.dataLoading();
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

	async onNext(){
		await this.dataLoading();
	}

	async onPrevious(){
		var previousPage = this.state.previousPage;
		await this.updateMyState(previousPage,'page');
		await this.dataLoading();
	}
	
	async dataLoading(){
		var searchResultJson = {};
		var that = this;
		var postJson = new FormData();
		postJson.append("page", that.state.page);
		postJson.append("getListFromPage", "adsList");
		postJson.append("city", "");
		postJson.append("categoryId", this.state.categoryId);
		postJson.append("SubcategoryId", "");
		postJson.append("searchText", this.state.searchText);
		postJson.append("searchUserId", "");
		postJson.append("rf", "json");
		var subUrl = "searchAdsAjax";
		that.updateMyState(true, 'isLoading');
		var response = await doPost(subUrl, postJson);
		setTimeout(function(){ 
			that.updateMyState(false, 'isLoading');
		}, 1000);

		if(response != null){
			//alert(JSON.stringify(response));
			var searchData = response['searchData'];
			var page = parseInt(response['page']);
			var leftRecord = parseInt(response['left_rec']);
        	        var nextPage = page + 1;
			var previousPage = page - 1 ;
			if(searchData != null){
				that.updateMyState(response,'searchResultJson');
				if(leftRecord > 0)
					that.updateMyState(nextPage,'page');
				that.updateMyState(previousPage,'previousPage');
				that.updateMyState(leftRecord,'leftRecord');
				that.updateMyState(nextPage,'nextPage');
				that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
			}
		}


	}

	constructTemplate(item){
		return <SearchAdsContent imgWidth={this.state.width-50} 
					imgHeight={150} 
					navigation={this.props.navigateTo}
					postJson={item}/>;
	}

	render() { 

		var inputWidth = this.state.width-30;
		var layoutWidth = this.state.width;
		var nextBtn = null;
		var previousBtn = null;
		if(this.state.leftRecord > 0){
			nextBtn = <TouchableOpacity onPress={()=>this.onNext()}><Text style={{textAlign : 'left'}}>Next</Text></TouchableOpacity>;
		}
		if(this.state.previousPage >= 0){
			previousBtn = <TouchableOpacity onPress={()=>this.onPrevious()}><Text style={{textAlign : 'right'}}>Previous / </Text></TouchableOpacity>;
		}

    		return ( 
			<View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]} 
				onLayout={()=> this.updateLayout()} >
				<ScrollView >
					<ListView style={{paddingBottom:15}} dataSource={this.state.listItems} 
						renderRow={(item) => this.constructTemplate(item)} 
						enableEmptySections={true}/>
					<View style={{flexDirection:"row", width : layoutWidth, paddingBottom : 20}}>
						<View style={ {width : layoutWidth/2}}>{ previousBtn }</View>
						<View style={ {width : layoutWidth/2}}>{ nextBtn }</View>
					</View>
					<MKSpinner visible={this.state.isLoading} textContent={"Please wait"} 
						cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}} />
					
				</ScrollView>
			</View>
		);
	}
}
