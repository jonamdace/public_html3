import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  DrawerLayoutAndroid,
  Navigator,
  ToolbarAndroid,
  TouchableOpacity,
  Image,
  BackAndroid,
  StyleSheet, AsyncStorage, ToastAndroid
} from 'react-native';

import Drawer from 'react-native-drawer';
import { doPost } from "./Component/MKActions";
import MKTextInput from "./Component/MKTextInput";

import DrawerMenu from './Component/menu/DrawerMenu';
import MyCustomizedNavBar from './Component/menu/MyCustomizedNavBar';

import Login from "./Templates/Login";
import ForgotPassword from "./Templates/ForgotPassword";
import HomeScreen from "./Templates/HomeScreen";
import Signup from "./Templates/Signup";
import Dashboard from "./Templates/Dashboard";
import SearchHistory from "./Templates/SearchHistory";
import Search from "./Templates/Search";
import AdsView from "./Templates/AdsView";
import SearchAdsContent from "./Templates/SearchAdsContent";
import AdsGallery from "./Templates/AdsGallery";
import AdPostPageOne from "./Templates/AdPostPageOne";



import ContactUs from "./Templates/ContactUs";
import EditMyProfile from "./Templates/EditMyProfile";
import ViewHistory from "./Templates/ViewHistory";
import MyProfile from "./Templates/MyProfile";
import ViewAllMyAds from "./Templates/ViewAllMyAds";
import NearByYouAds from "./Templates/NearByYouAds";
import Bookmarked from "./Templates/Bookmarked";
import ChangePassword from "./Templates/ChangePassword";


const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			drawerClosed: true,
			loginStatus : [ {
					loggedStatus:'',
					loggedUserType:''
					}],
			cancelable : true,
			visible : false,
			checkLoggedUserType : '',
		}
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.setDrawerState = this.setDrawerState.bind(this);
		this.handlesBackButton = this.handlesBackButton.bind(this);
		this.updateLoginStatus = this.updateLoginStatus.bind(this);
		this.navigateTo = this.navigateTo.bind(this);
		this.navigateToMenu = this.navigateToMenu.bind(this);
		this.updateLoading = this.updateLoading.bind(this);
	}

	// Common functions Start
	toggleDrawer() {
		if (this.state.drawerClosed) {
			this.DRAWER.openDrawer();
		} else {
			this.DRAWER.closeDrawer();
		}
	}
	setDrawerState() {
		this.setState({
			drawerClosed: !this.state.drawerClosed
		});
	}
	handlesBackButton() {
		if (this._navigator && this._navigator.getCurrentRoutes().length > 1) {
			try {
				this._navigator.pop();          
			} catch(e) {
			}
			return true;
		}
		return false;
	}
	async updateLoginStatus(data,userType){
		var subUsertype="";
		if(userType=="user") {
			subUsertype = await AsyncStorage.getItem("loggedSubUserType");
		}
		this.setState({
			loginStatus : [ { loggedStatus:data, loggedUserType:userType,subUsertype:subUsertype }] 
		});
	}

	updateLoading(status){	
		this.setState({
			visible : status
		});
	}

	navigateToMenu(route,props) {
		this.setDrawerState();
		if(route=="Login"){
			this._navigator.resetTo(
				{
					index: 0,
					name: route ,
					reset: true,	
					passProps: {
					   value:props
					}		
				}
			);
               } else {
			this._navigator.push(
				{
					name: route ,	
					passProps: {
					   value:props
					}		
				}
			);
		}
	}

	navigateTo(route,props) {
		this._navigator.push({
			name: route ,
			passProps: {
			   value:props
			}
		});
	}

	componentWillMount(){
		BackAndroid.addEventListener('hardwareBackPress', this.handlesBackButton);
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress', this.handlesBackButton);
	}
	// Common functions End

	render() {
		//var initialRoutes = 'HomeScreen';
		var initialRoutes = 'ContactUs';

		const  loginStatus  = this.state.loginStatus;
    		return(

		<Navigator initialRoute={{ name: initialRoutes }} renderScene={(route, navigator) => {
			const routeName = route.name;
			switch (routeName) {

		case 'HomeScreen':
			return <HomeScreen navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />;

		case 'AdPostPageOne':		
			return <Drawer type="overlay" content={<DrawerMenu navigate={this.navigateToMenu} 
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Post your ads"} />
					<AdPostPageOne navigator={navigator} 
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'Dashboard':		
			return <Drawer type="overlay" content={<DrawerMenu navigate={this.navigateToMenu} 
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Home"} />
				<Dashboard navigator={navigator}
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'Signup':
			return <View style={{ flex: 1 }}>
			<Signup navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'Login':
			return <View style={{ flex: 1 }}>
			<Login navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'SearchAdsContent':
			return <View style={{ flex: 1 }}>
			<SearchAdsContent navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'AdsGallery':
			return <View style={{ flex: 1 }}>
			<AdsGallery navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'Search':
			return <View style={{ flex: 1 }}>
			<Search navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'SearchHistory':
			return <View style={{ flex: 1 }}>
			<SearchHistory navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'ForgotPassword':
			return <View style={{ flex: 1 }}>
			<ForgotPassword navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo}  updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'ChangePassword':
			return <Drawer type="overlay" content={<DrawerMenu navigate={this.navigateToMenu} 
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"Change Password"} />
					<ChangePassword navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'ViewAllMyAds':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"View All My Ads"} />
					<ViewAllMyAds navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'Bookmarked':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"Bookmark"} />
					<Bookmarked navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'NearByYouAds':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"Near By You Ads"} />
					<NearByYouAds navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'MyProfile':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"My Profile"} />
					<MyProfile navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'EditMyProfile':
			return <View style={{ flex: 1 }}>
						<EditMyProfile navigator={navigator} {...route.passProps} navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
					</View>;

		case 'ContactUs':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"Contact Us"} />
					<ContactUs navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'ViewHistory':
			return <Drawer type="overlay" content={ <DrawerMenu navigate={this.navigateToMenu}
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={0}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
				<MyCustomizedNavBar title={"History"} />
					<ViewHistory navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'AdsView':
			return <AdsView navigator={navigator}
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />;

		default:
			return <Login navigator={navigator}
						{...route.passProps}
						navigateTo={this.navigateTo}
						updateLoginStatus={this.updateLoginStatus}
						updateLoading={this.updateLoading} />;

                    	}
            	}}
		configureScene={(route, routeStack) =>
			Navigator.SceneConfigs.FadeAndroid
		}
       		ref={(nav) => { this._navigator = nav; }}
       		/>

		);
	}
}
