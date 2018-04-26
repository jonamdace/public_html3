'use strict';
import React, {Component, PropTypes} from "react";
import {View,StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, Image, AsyncStorage} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';
import ConfigVariable from '../config/ConfigVariable';

const { width, height } = Dimensions.get('screen');


export default class DrawerMenu extends Component {
    constructor(props:Object) {
        super(props);
        var {height, width} = Dimensions.get('window');

        this.state = {
            height: height,
            width: width,
            username: null,
            lastlogin: null,
            name: null,
            img: null
        }
    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    onPressToRedirect(routes) {
        this.props.navigate(routes)
    }

    async onPressToLogout(){
        AsyncStorage.setItem("username", "");
        AsyncStorage.setItem("lastlogin", "");
        AsyncStorage.setItem("name", "");
        AsyncStorage.setItem("img", "");
        this.setStateOftheMenu(null, null, null, null);
        this.onPressToRedirect("HomeScreen");
    }

    setStateOftheMenu(username, lastlogin, name, img) {
        this.setState({
            username: username,
            lastlogin: lastlogin,
            name: name,
            img: img
        });
    }

    async componentDidMount() {

        var username = await AsyncStorage.getItem("username");
        var lastlogin = await AsyncStorage.getItem("lastlogin");
        var name = await AsyncStorage.getItem("name");
        var img = await AsyncStorage.getItem("img");
        this.setStateOftheMenu(username, lastlogin, name, img);
    }

    render() {
        var that = this;
        var {layoutHeight, layoutWidth } = Math.min(height, width) * 0.8;
        var userDispContent = [];
        var dataArray = [
            {'routes': 'Dashboard', title: 'Home'},
            {'routes': 'Login', title: 'Login'},
            {'routes': 'Signup', title: 'Signup'},
            {'routes': 'ContactUs', title: 'Contact Us'}
        ];

        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var imgContent = <Image source={{uri: filePath}} style={{width: 75, height: 75, resizeMode: Image.resizeMode.contain, alignSelf:'center'}} />
        var username = this.state.username;
        if (username != null) {
            var lastlogin = this.state.lastlogin;
            var name = this.state.name;
            var img = this.state.img;

            if(img != null){
                imgContent = <Image source={{uri: filePath}} style={{width: 75, height: 75, resizeMode: Image.resizeMode.contain, alignSelf:'center'}} />            } else {
            }

            userDispContent.push(
                <View key={'userProfile'} >
                    <View style={{justifyContent :'center', overflow:'hidden',width: 100, height:100, borderColor: "#FFF", backgroundColor: "#FFF", borderRadius:50, marginLeft : 30}}>
                        {imgContent}
                    </View>

                    <Text style={{textAlign:"left", paddingLeft : 15, paddingTop : 15, color: '#FFF', fontWeight:'bold'}}>
                        <Text style={{color:'#FFF'}}>Logged in As : </Text>{ this.state.username }
                    </Text>
                    { /* <Text style={{textAlign:"left", paddingLeft : 15, color: '#FFF', fontWeight:'bold'}}>
                     <Text style={{color:'#FFF'}}>Name : </Text>{ this.state.name }
                     </Text> */ }
                    <Text style={{textAlign:"left", paddingLeft : 15, color: '#FFF', fontWeight:'bold'}}>
                        <Text style={{color:'#FFF'}}>Last Login : </Text>{ this.state.lastlogin }
                    </Text>
                </View>
            );

            var dataArray = [
                {'routes': 'Dashboard', title: 'Home'},
                {'routes': 'AdPostPageOne', title: 'Ad Post'},
                {'routes': 'ViewAllMyAds', title: 'View All My Ads'},
                {'routes': 'nearByYouAds', title: 'Near By You Ads'},
                {'routes': 'Bookmarked', title: 'View All My Bookmarked'},
                {'routes': 'MyProfile', title: 'View My Profile'},
                {'routes': 'ChangePassword', title: 'Change Password'},
                {'routes': 'History', title: 'History'},
                {'routes': 'Logout', title: 'Sign out'},
                {'routes': 'ContactUs', title: 'Contact Us'},
            ];
        } else {
            userDispContent.push(
                <View key={'userProfile'} >
                    <View style={{justifyContent :'center', overflow:'hidden',width: 100, height:100, borderColor: "#FFF", backgroundColor: "#FFF", borderRadius:50, marginLeft : 30}}>
                        {imgContent}
                    </View>

                    <Text style={{textAlign:"left", paddingLeft : 15, paddingTop : 15, color: 'red'}}>
                        You are not Logged in!
                    </Text>
                </View>
            );
        }

        var objArray = [];
        dataArray.map(function (obj, index) {
            var route = obj.routes;
            var title = obj.title;
            if(route === "Logout"){
                objArray.push(
                    <View key={index}
                          style={{ borderBottomWidth : 0.5, paddingBottom: 15,paddingLeft: 15, paddingTop: 15, borderColor : '#16a085'}}>
                        <TouchableOpacity onPress={()=>that.onPressToLogout()}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontWeight : 'bold', color : 'grey'}}>{title}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                objArray.push(
                    <View key={index}
                          style={{ borderBottomWidth : 0.5, paddingBottom: 15,paddingLeft: 15, paddingTop: 15, borderColor : '#16a085'}}>
                        <TouchableOpacity onPress={()=>that.onPressToRedirect(route)}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontWeight : 'bold', color : 'grey'}}>{title}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }

        });

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth}]}
                  onLayout={()=> this.updateLayout()}>
                <View style={[{height : 180, width : layoutWidth, backgroundColor: "#16a085", paddingTop : 15}]}>
                    {userDispContent}
                </View>
                <ScrollView>
                    <View style={{ height : this.state.height-180,backgroundColor : "#FFF", borderRightWidth: 0.5, borderRightColor:'#16a085'}}>
                    {objArray}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
