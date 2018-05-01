'use strict';
import React, {Component, PropTypes} from "react";
import {
    View,
    ListView,
    StyleSheet,
    Animated,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    Image
} from "react-native";
import Geocoder from 'react-native-geocoder';

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import MKSpinner from "../Component/MKSpinner";

import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MultiSelect from 'react-native-multiple-select';
var ImagePicker = require('react-native-image-picker');

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class AdPostPageOne extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            initialPosition: null,
            lastPosition: null,
            stage: 0,
            selectedItems: [],
            isDateTimePickerVisible: false,
            isLoading: false,
            isCancelable: true,
            height: height,
            width: width,
            adsTitle : '',
            startDate : '',
            noOfDaysToActive : '',
            adsDescription : '',
            avatarSource  : null,
            avatarSourceArray  : [],
            avatarSourcePostArray  : [],
            categoryId: '0',
            subCategoryId: "0",
            listItems: ds.cloneWithRows([]),
            listItemsSubCategoryJson: ds.cloneWithRows([]),
            ds:ds,
            country : '1',
            state : 'Tamil Nadu',
            city : 'Chennai',
            countryId : '1',
            stateId : '1',
            cityId: '1',
            address : '',
            colorArray : ['','#dd0908','#ff9e29','#3fb7d2','#dd0908','#c119ce', '#1963ce','#7fbad8', '#df8012', '#dd0908', '#070c1f', '#f49ecf', '#1ca39d'],
            errorsJson: {
                adsTitle : null,
                noOfDaysToActive : null,
                startDate : null,
                adsDescription : null,
                stateId: null,
                cityId: null,
                categoryId: null,
                subCategoryId: null
            }
        };
	this.navigate=this.props.navigateTo;
        this.onFocus = this.onFocus.bind(this);
        this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    }
    watchID: number = null;

    updateMyState(value, keyName) {
        this.setState({
            [keyName]: value
        });
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

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    onPressRedirect(routes) {
        this.navigate(routes);
    }

    pickImage(){

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
                // alert(response.uri);
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                var avatarSourceArray = this.state.avatarSourceArray;
                var avatarSourcePostArray = this.state.avatarSourcePostArray;
                avatarSourceArray.push(source);
                avatarSourcePostArray.push({
                    uri: response.uri,
                    type : response.type,
                    name : response.fileName
                });


                this.setState({
                    avatarSource: source,
                    avatarSourceArray : avatarSourceArray,
                    avatarSourcePostArray : avatarSourcePostArray
                });
            }
        });
    }

    removeImage(key){
        var avatarSourceArray = this.state.avatarSourceArray;
        var avatarSourcePostArray = this.state.avatarSourcePostArray;
        avatarSourceArray.splice(key, 1);
        avatarSourcePostArray.splice(key, 1);
        this.setState({
            avatarSourceArray : avatarSourceArray,
            avatarSourcePostArray : avatarSourcePostArray
        });
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (currentDate) => {
        //console.log('A date has been picked: ', currentDate);
        var date = currentDate.getDate();
        var month = currentDate.getMonth(); //Be careful! January is 0 not 1
        var year = currentDate.getFullYear();

        var dateString = date + "-" +(month + 1) + "-" + year;
        this.setState({
            startDate: dateString
        });
        this._hideDateTimePicker();
    };

    async doContinue() {
        var that = this;
        var isValid = 1;
        var stateArray = that.state;
        var errorsJson = that.state.errorsJson;
        Object.keys(errorsJson).forEach(function (key) {
            var stateArrayValue = stateArray[key];
            if (stateArrayValue == null || stateArrayValue == "") {
                errorsJson[key] = "This field is required";
                isValid = 0;
            } else {
                errorsJson[key] = null;
            }
        });
        await that.updateMyState(errorsJson, 'errorsJson');

        if (isValid == 1) {
            this.onPressRedirect("AdPostPageTwo");
        }

    }

    onSelectedItemsChange(keyName, selectedItems) {
        this.setState({[keyName]: selectedItems});
    }

;

    async componentDidMount() {

        var that = this;
        const categoryJson = await AsyncStorage.getItem('categoryJson');
        if (categoryJson == null) {
            await this.getCategoryListFromApps();
        } else {
            that.updateMyState(that.state.ds.cloneWithRows(JSON.parse(categoryJson)), 'listItems');
        }

        MessageBarManager.registerMessageBar(this.refs.alert);
        this.getCurrentLocation();
    }

    getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
           // const initialPosition = JSON.stringify(position);
            this.setState({ initialPosition : position});
        },
        (error) => {
            MessageBarManager.showAlert({
                title: "Error!",
                message: error.message,
                alertType: "error",
                position: 'bottom',
            });
        },
        { enableHighAccuracy: true }
        );

        this.watchID = navigator.geolocation.watchPosition((position) => {
            //const lastPosition = JSON.stringify(position);
            this.setState({ lastPosition : position});
        });
    }

    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID);
        MessageBarManager.unregisterMessageBar();
    }

    getCurrentLocationAsString(){
        var that = this;
        var coords = this.state.lastPosition.coords;
        var latitude = coords['latitude'];
        var longitude = coords['longitude'];
        //alert(JSON.stringify(this.state.lastPosition) + latitude + "-" + longitude)
        var NY = {
            lat: latitude,
            lng: longitude
        };

        Geocoder.geocodePosition(NY).then(res => {
            //alert(JSON.stringify(res))
            if(res.length > 0){
                var fullAddress = res[0];

                that.setState({
                    country : fullAddress.country,
                    state : fullAddress.adminArea,
                    city : fullAddress.subAdminArea,
                    //address : fullAddress.formattedAddress
                    address : JSON.stringify(res[2])
                });
            }
            //alert(JSON.stringify(res))
        }).catch(err => console.log(err))

        return <Text>{JSON.stringify(this.state.address)}</Text>;
    }

    async getCategoryListFromApps() {
        var that = this;
        var subUrl = "getCategoryListFromApps";
        that.setState({isLoading: true});
        var categoryJson = await doPost(subUrl, null);
        if (categoryJson != null) {
            categoryJson = categoryJson.sort(function (a, b) {
                return parseInt(a.categoryId) - parseInt(b.categoryId);
            });
            alert(that.state.ds.cloneWithRows(categoryJson))
            that.updateMyState(that.state.ds.cloneWithRows(categoryJson), 'listItems');
            await AsyncStorage.setItem('categoryJson', JSON.stringify(categoryJson));
        }
        that.setState({isLoading: false});
    }

    async onPressToSetSubCategory(categoryId, subCategoryId, subCategory){
        var that = this;

        await that.setState({
            subCategoryId : subCategoryId,
            subCategory : subCategory,
            isLoading: true
        });

        setTimeout(function(){
            that.setState({isLoading: false});
        }, 500);

    }

   async onPressToSelectSubCategory(categoryId, category){

        await this.setState({
            categoryId : categoryId,
            category : category,
            subCategoryId : "0",
            isLoading: true
        });

       var that = this;
       var subUrl = "Frontend/getCommonJsonData";
       var postJson = new FormData();
       postJson.append("categoryId", that.state.categoryId);
       postJson.append("subCategoryId", that.state.subCategoryId);
       postJson.append("divId", "subCategoryIdDiv");
        var data = await doPost(subUrl, postJson);
        if (data != null) {
            var subCategoryJson = data['jsonArrayData'];
            subCategoryJson = subCategoryJson.sort(function (a, b) {
                return parseInt(a.subCategoryId) - parseInt(b.subCategoryId);
            });
            that.updateMyState(that.state.ds.cloneWithRows(subCategoryJson), 'listItemsSubCategoryJson');
        }
        that.setState({isLoading: false});

    }

    async doAdPost(){
        var that = this;
        var isValid = 1;
        var stateArray = that.state;
        var errorsJson = that.state.errorsJson;
        Object.keys(errorsJson).forEach(function(key) {
            var stateArrayValue = stateArray[key];
            if(stateArrayValue == null || stateArrayValue==""){
                errorsJson[key] = "This field is required";
                isValid = 0;
            } else {
                errorsJson[key] = null;
            }
        });
        alert(JSON.stringify(errorsJson))
        await that.updateMyState(errorsJson, 'errorsJson');
        if(isValid == 1){
            var mobileNumber = await AsyncStorage.getItem('username');
            var userId = await AsyncStorage.getItem('userid');
            var userCode = await AsyncStorage.getItem('userCode');

            var subUrl = "createBackendAdPost";

            var postJson = new FormData();
            for(var i=0; i<that.state.avatarSourcePostArray.length; i++){
                postJson.append('fileselect[]', that.state.avatarSourcePostArray[i])
            }
            postJson.append('fileSubmit','Post');
            postJson.append('adsTitle',that.state.adsTitle);
            postJson.append('description',that.state.adsDescription);
            postJson.append('noOfDaysToActive',that.state.noOfDaysToActive);
            postJson.append('startDate',that.state.startDate);
            postJson.append('categoryId',that.state.categoryId);
            postJson.append('subCategoryId',that.state.subCategoryId);
            postJson.append('itemId', "");
            postJson.append('stateId',that.state.stateId);
            postJson.append('cityId',that.state.cityId);
            postJson.append('latitude','');
            postJson.append('longitude','');
            postJson.append('countryId','1');
            postJson.append('actualPrice',that.state.cityId);
            postJson.append('offerPrice','1');
            postJson.append('address','1/96 chennai');
            postJson.append('mobileNumber', mobileNumber);
            postJson.append('userId', userId);
            postJson.append('userCode', userCode);

            postJson.append('rf', "json");

            var response = await doPost(subUrl, postJson);
            alert(JSON.stringify(response));

            /*
             postJson.append("username", that.state.inputMobileNumber);
             postJson.append("password", that.state.inputPassword);
             var subUrl = "getLoginFromApps";
             that.setState({isLoading : true});
             var response = await doPost(subUrl, postJson);
             if(response != null){

             }
             */
        }

    }

    renderGridItem(item){
        var categoryId = item.categoryId;
        var category = item.category;
        var icons = item.icons;
        var color = this.state.colorArray[categoryId];
        if(color == null)
            color = "red";
        if(icons != null)
            icons = icons.replace("fa fa-", "");
        return (
            <View style={{ width: 75, height: 100, alignItems:'center', marginTop : 5}}>
                <TouchableOpacity onPress={()=>this.onPressToSelectSubCategory(categoryId, category)} >
                    <View style={{flexDirection: 'row', backgroundColor: '#FFF', borderRadius:25, width: 50, height: 50, alignItems:'center', justifyContent:'center'}}>
                        <Icon name={icons} color={color} size={20} />
                    </View>
                </TouchableOpacity>
                <Text style={{marginTop: 7, fontSize : 10, color: '#59C2AF', textAlign:'center', fontWeight: 'bold'}}>{category}</Text>
            </View>
        );
    }

    renderSubCategoryGridItem(item) {
        var subCategoryId = item.subCategoryId;
        var categoryId = item.categoryId;
        var subCategory = item.subCategory;
        var icons = item.icons;
        var color = this.state.colorArray[subCategoryId%12 + 1];
        if(color == null)
            color = "red";
        if(icons != null)
            icons = icons.replace("fa fa-", "");
        return (
            <View style={{ width: 75, height: 100, alignItems:'center', marginTop : 5}}>
                <TouchableOpacity onPress={()=>this.onPressToSetSubCategory(categoryId, subCategoryId, subCategory)} >
                    <View style={{flexDirection: 'row', backgroundColor: color, borderRadius:25, width: 50, height: 50, alignItems:'center', justifyContent:'center'}}>
                        { /*<Icon name={icons} color={color} size={20} /> */}
                    </View>
                </TouchableOpacity>
                <Text style={{marginTop: 7, fontSize : 10, color: '#59C2AF', textAlign:'center', fontWeight: 'bold'}}>{subCategory}</Text>
            </View>
        );
    }

    render() {
        var inputWidth = this.state.width - 30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";
        const { selectedItems } = this.state;

        //Error Block Code start
        var adsTitleError = null;
        if (this.state.errorsJson.adsTitle != null) {
            adsTitleError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.adsTitle}</Text>;
        }
        var startDateError = null;
        if (this.state.errorsJson.startDate != null) {
            startDateError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.startDate}</Text>;
        }
        var noOfDaysToActiveError = null;
        if (this.state.errorsJson.noOfDaysToActive != null) {
            noOfDaysToActiveError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.noOfDaysToActive}</Text>;
        }
        var descriptionError = null;
        if (this.state.errorsJson.adsDescription != null) {
            descriptionError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.adsDescription}</Text>;
        }
        var stateIdError = null;
        if (this.state.errorsJson.stateId != null) {
            stateIdError = <Text
                style={[CommonStyle.errorText, {paddingBottom : 20, paddingTop : -10}]}>{this.state.errorsJson.stateId}</Text>;
        }
        var cityIdError = null;
        if (this.state.errorsJson.cityId != null) {
            cityIdError = <Text
                style={[CommonStyle.errorText, {paddingBottom : 20, paddingTop : -10}]}>{this.state.errorsJson.cityId}</Text>;
        }

        var items = [{
            id: '92iijs7yta',
            name: 'Ondo',
        }, {
            id: 'a0s0a8ssbsd',
            name: 'Ogun',
        }, {
            id: '16hbajsabsd',
            name: 'Calabar',
        }, {
            id: 'nahs75a5sg',
            name: 'Lagos',
        }, {
            id: '667atsas',
            name: 'Maiduguri',
        }, {
            id: 'hsyasajs',
            name: 'Anambra',
        }, {
            id: 'djsjudksjd',
            name: 'Benue',
        }, {
            id: 'sdhyaysdj',
            name: 'Kaduna',
        }, {
            id: 'suudydjsjd',
            name: 'Abuja',
        }];

        var resContentImg = [];

        var that = this;
        this.state.avatarSourceArray.map(function (value, key) {
            if (value != null) {
                resContentImg.push(
                    <View key={"image"+key}
                          style={{ width: 120, height : 120, margin:5, borderRadius : 10, borderWidth: 1, borderColor: 'grey'}}>
                        {
                            value != null ? <View>
                                <Image source={value} style={{width : 120, height : 120, borderRadius : 10}}/>
                                <Icon name='times-circle' color='red' size={30}
                                      style={{position : "absolute", top: 5, right : 5}}
                                      onPress={()=> that.removeImage(key)}/>
                            </View> : <Text style={{textAlign:"center"}}>Select a photo</Text>
                        }
                    </View>
                )
            }
        });

        var displayContent = <View>
            <MKTextInput label={'Ads Title'} highlightColor={inputHighlightColor}
                         multiline={true}
                         onChangeText={(adsTitle) => this.updateMyState(adsTitle, 'adsTitle')}
                         value={this.state.adsTitle}
                         inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                         returnKeyType={'next'} ref="adsTitle"
                         onSubmitEditing={(event) => this.focusNextField('startDate')}
                         onFocus={()=>this.onFocus()}
                />
            { adsTitleError }
            <View style={{ flexDirection: "row" }}>
                <MKTextInput label={'Start Date'} highlightColor={inputHighlightColor}
                             editable={false}
                             onChangeText={(startDate) => this.updateMyState(startDate, 'startDate')}
                             value={this.state.startDate}
                             inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth - 50}}
                             returnKeyType={'next'} ref="startDate"
                             onSubmitEditing={(event) => this.focusNextField('noOfDaysToActive')}
                             onFocus={this._showDateTimePicker}
                    />
                <TouchableOpacity onPress={this._showDateTimePicker} style={{marginTop : 40, paddingLeft : 20 }}>
                    <Icon name='calendar' color='#59C2AF' size={25}/>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        />
                </TouchableOpacity>
            </View>
            { startDateError }
            <MKTextInput label={'No Of Days To Active'} highlightColor={inputHighlightColor}
                         keyboardType={'numeric'} maxLength={2}
                         onChangeText={(noOfDaysToActive) => this.updateMyState(noOfDaysToActive, 'noOfDaysToActive')}
                         value={this.state.noOfDaysToActive}
                         inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                         returnKeyType={'next'} ref="noOfDaysToActive"
                         onSubmitEditing={(event) => this.focusNextField('adsDescription')}
                         onFocus={()=>this.onFocus()}
                />
            { noOfDaysToActiveError }
            <MKTextInput label={'Description'} highlightColor={inputHighlightColor}
                         multiline={true}
                         onChangeText={(adsDescription) => this.updateMyState(adsDescription, 'adsDescription')}
                         value={this.state.adsDescription}
                         inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                         returnKeyType={'next'} ref="description"
                         onSubmitEditing={(event) => this.focusNextField('adsDescription')}
                />
            { descriptionError }
            <View style={{paddingTop: 30}}></View>
            {
                resContentImg
            }
            <TouchableOpacity onPress={()=>that.pickImage()}>
                <View
                    style={{ width: 150, padding: 10, height : 50, borderRadius : 10, borderWidth: 1,  marginTop:5, marginBottom:10, borderColor: '#59C2AF', justifyContent : 'center', flexDirection: "row"}}>
                    <Icon name='camera' color='#59C2AF' size={25}/>
                    <Text style={{textAlign:"center", padding : 3, color : "#59C2AF"}}> Select a photo</Text>
                </View>
            </TouchableOpacity>
        </View>;

        var dynamicBtn = null;
        {
         /*
        dynamicBtn = <MKButton onPress={()=> this.doContinue()}
                               style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}}
                               textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}
                               btndisabled={this.state.isLoading}>CONTINUE</MKButton>;

        */
        }

        dynamicBtn = <MKButton onPress={()=> this.doAdPost()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} btndisabled={this.state.isLoading}>
            POST AD
        </MKButton>;


        var subCategoryContent = [];
        if(this.state.categoryId != "0"){
            subCategoryContent.push(<Text key={"categoryText"} style={{fontWeight : "bold", paddingBottom : 15, paddingTop : 15}}>
                {this.state.category}
            </Text>);
            subCategoryContent.push(<ListView key={1}
                horizontal={true}
                pageSize = {2}
                style={{flex:1}}
                enableEmptySections={true}
                dataSource={this.state.listItemsSubCategoryJson}
                renderRow={(data) => this.renderSubCategoryGridItem(data)}
                />);

        }

        var afterSubCategory = [];
        if(this.state.subCategoryId != "0"){
            afterSubCategory.push(<Text key={"subCategoryText"} style={{fontWeight : "bold", paddingBottom : 5, paddingTop : 15}}>
                {this.state.category + " "} <Icon name={"chevron-right"} color={"#59C2AF"} size={15} /> {" " +this.state.subCategory}
            </Text>);
        }

        var displayLocationContent = null;
        if(that.state.lastPosition != null){
            //displayLocationContent = that.getCurrentLocationAsString();
        }
        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth}]}
                  onLayout={()=> this.updateLayout()}>
                <ScrollView style={{ flex: 1, padding : 10}}>
                    <Text style={{fontWeight : "bold",  paddingBottom : 15, paddingTop : 15}}>Please choose Category</Text>
                    {
                        displayLocationContent
                    }
                    <ListView
                        horizontal={true}
                        pageSize = {2}
                        style={{flex:1}}
                        enableEmptySections={true}
                        dataSource={this.state.listItems}
                        renderRow={(data) => this.renderGridItem(data)}
                        />
                    {subCategoryContent}
                    {afterSubCategory}
                    {displayContent}
                    <View style={{paddingTop: 30}}></View>
                </ScrollView>
                {dynamicBtn}
                <MKSpinner visible={this.state.isLoading} textContent={"Please wait"} cancelable={this.state.isCancelable} textStyle={{color: '#FFF'}}/>
                <MessageBarAlert ref="alert" />
            </View>
        );

    }

}
