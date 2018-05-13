'use strict';
import React, {Component, PropTypes} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
    AsyncStorage
} from "react-native";

import MKSpinner from "../Component/MKSpinner";
import MKCard from "../Component/MKCard";
import Divider from '../Component/divider/Divider';
import ConfigVariable from '../Component/config/ConfigVariable';
import CommonStyle from "../Styles/CommonStyle";
import { doPost } from "../Component/MKActions";

export default class SearchAdsContent extends Component {

    constructor(props:Object) {

        super(props);
        this.state = {
            bookmarkAdd :true
        };

    }

    onPressToShowSingleAds(postJson) {
        this.props.navigation('AdsView', postJson);
        //this.props.navigation.navigate('AdsView', postJson);
    }

    async onPressToRemoveFromBookmark(action){

        var that = this;
        var userid = await AsyncStorage.getItem('userid');

        var postJson = new FormData();
        postJson.append("adsId", this.props.postJson.adsId);
        postJson.append("action", action);
        postJson.append("userid", userid);
        postJson.append("rf", "json");
        var subUrl = "addToMyBookmark";
        var response = await doPost(subUrl, postJson);
        if(response != null && response != "" && response != undefined){
            that.setState({
                bookmarkAdd : !that.state.bookmarkAdd
            })
            alert(response.message);
        }
    }

    render() {

        var adsTitle = this.props.postJson.adsTitle;
        var adsCode = this.props.postJson.adsCode;
        var userCode = this.props.postJson.userCode;
        var adsId = this.props.postJson.adsId;
        var adsAmt = this.props.postJson.offerPrice;
        var adsLocation = this.props.postJson.state + ', ' + this.props.postJson.city;
        var postedDate = this.props.postJson.createdAt;
        var fileName = this.props.postJson.file_name;
        var adsImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var fileImage = <Image source={{uri: filePath}}
                               style={{width: this.props.imgWidth, height: this.props.imgHeight, resizeMode: Image.resizeMode.contain, alignSelf:'center'}}/>
        if (fileName != null) {
            filePath = ConfigVariable.uploadedAdsFilePath + '/' + userCode + '/' + adsCode + '/' + fileName;
            fileImage = <Image source={{uri: filePath}}
                               style={{width: this.props.imgWidth, height: this.props.imgHeight, resizeMode: Image.resizeMode.contain, alignSelf:'center'}}/>

        }

        var dynamicContent = null;
        if(this.props.fromPage != null  && this.props.fromPage == "View My Bookmarked List"){

            if(!this.state.bookmarkAdd){
                dynamicContent =
                    <TouchableOpacity onPress={()=> this.onPressToRemoveFromBookmark('add')}>
                        <Text
                            style={[ {textAlign:'left', color:'blue'}]}>
                            Add to Bookmark
                        </Text>
                    </TouchableOpacity>;
            } else {
                dynamicContent =
                    <TouchableOpacity onPress={()=> this.onPressToRemoveFromBookmark('remove')}>
                        <Text
                            style={[ {textAlign:'left', color:'orange'}]}>
                            Remove from Bookmark
                        </Text>
                    </TouchableOpacity>;
            }
        }

        return (
            <MKCard>
                {fileImage}
                <Divider style={CommonStyle.divider}/>
                <Text style={[ CommonStyle.imageCardTitle,{fontWeight:'bold'}]}>{adsTitle}</Text>
                <Text style={[ CommonStyle.imageCardTitle]}>{adsLocation} | {postedDate} </Text>
                <View style={{flexDirection:'row'}}>
                    <Text
                        style={[ CommonStyle.imageCardTitle, {width: 80, textAlign:'left', fontWeight:'bold', color:'#F9CE0D'}]}>₹{adsAmt}</Text>
                    <TouchableOpacity onPress={()=> this.onPressToShowSingleAds(this.props.postJson)}>
                        <Text
                            style={[ CommonStyle.imageCardTitle, {width: this.props.imgWidth-100,textAlign:'right', color:'#489FDF'}]}>
                            View More Details »
                        </Text>
                    </TouchableOpacity>
                </View>
                { dynamicContent }
            </MKCard>
        );
    }
}
