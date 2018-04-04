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

import MKSpinner from "./Component/MKSpinner";
import Drawer from 'react-native-drawer';
import { doPost } from "./Component/MKActions";
import MKTextInput from "./Component/MKTextInput";

import DrawerMenu from './Component/menu/DrawerMenu';
import MyCustomizedNavBar from './Component/menu/MyCustomizedNavBar';
import Menu from "./Component/menu/Menu";

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
import AdPostPageTwo from "./Templates/AdPostPageTwo";


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
		var initialRoutes = 'HomeScreen';
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
				closedDrawerOffset={-3}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Apps Form Entry"} />
				<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
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
				closedDrawerOffset={-3}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Category"} />
				<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
					<Dashboard navigator={navigator} 
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'AdPostPageTwo':
			return <AdPostPageTwo navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />;

		case 'Signup':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<Signup navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'Login':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<Login navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'SearchAdsContent':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<SearchAdsContent navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'AdsGallery':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<AdsGallery navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;
		case 'Search':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<Search navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'SearchHistory':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<SearchHistory navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'ForgotPassword':
			return <View style={{ flex: 1 }}>
        			<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
			<ForgotPassword navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo}  updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />
				</View>;

		case 'ChangePassword':
			return <Drawer type="overlay" content={<DrawerMenu navigate={this.navigateToMenu} 
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={-3}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Change Password"} />
				<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
					<ChangePassword navigator={navigator} 
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />
			</Drawer>;

		case 'AdsView':
			return <Drawer type="overlay" content={<DrawerMenu navigate={this.navigateToMenu} 
				loginStatus={loginStatus} updateLoginStatus={this.updateLoginStatus}/>}
				tapToClose={true}
				openDrawerOffset={0.2} // 20% gap on the right side of drawer
				panCloseMask={0.2}
				closedDrawerOffset={-3}
				styles={drawerStyles}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>                          
				<MyCustomizedNavBar title={"Apps List"} />
				<MKSpinner visible={this.state.visible} cancelable={this.state.cancelable} textContent={"Please wait"}
					textStyle={{color: '#FFF'}} />
					<AdsView navigator={navigator} 
						{...route.passProps} 
						navigateTo={this.navigateTo} 
						updateLoginStatus={this.updateLoginStatus} 
						updateLoading={this.updateLoading} />
			</Drawer>;

		default:
			return <Login navigator={navigator} {...route.passProps} 
navigateTo={this.navigateTo} updateLoginStatus={this.updateLoginStatus} updateLoading={this.updateLoading} />;
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
