import React,{useState,useEffect,useContext} from 'react';
import {Linking ,Platform,KeyboardAvoidingView, View,Text,StyleSheet,Dimensions,Image,TouchableOpacity, TextInput, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserContext} from '../Context';
import MenuDrawer from 'react-native-side-drawer';
import openURLInBrowser from '../node_modules/react-native/Libraries/Core/Devtools/openURLInBrowser';

const HomeComponent = ({navigation,route}) =>{
    const [open,setOpen] = useState(false);
    const gblData = useContext(UserContext);
    const [MenuOption,setMenuOption] = useState({showDefaultMenu:true,showSearchResult:false,showEMailAcc:false,showCardDetails:false,searchData:""})
    const DefaultMenuList = [{name:"eMail Accounts",component:"EMailAccounts"},
                            {name:"Cards",component:"CardDetails"},{name:"Generate Password",component:"GeneratePassword"}];
    const [PwdList,setPwdList] = useState({email:[],card:[]});
    const SideBarList = ["About Us","Contact Us","FAQ's","T&C"];
    
    function moveToSettingsOption() {
        alert("Not Implemented!!!");
    }
    const moveToMenuOption = async (screenName) => {
        let passWordManager = await AsyncStorage.getItem("passWordManager");
        if (passWordManager !== null) {
            // We have data!!
            passWordManager = JSON.parse(passWordManager);
            console.log("parsed passWordManager : ",passWordManager);
        }else{
            passWordManager = {};
        }
        
        let email =  passWordManager.email || [];
        let card =  passWordManager.card || [];
        console.log(screenName,": ScreenName got Clicked");
        switch(screenName){
            case "EMailAccounts":
                gblData.currentPage="email";
                updateSearchValues(email,card);
                break;
            case "CardDetails":
                gblData.currentPage="card";
                updateSearchValues(email,card);
                break;
            case "GeneratePassword":
                navigation.navigate(screenName,{});
                setMenuOption({...MenuOption,searchData:""});
                break;
            default:
                console.log("No Case Match!!!");
                break;
        }
    }
    function moveToEmailOption(AccDetailsObj){
        if(AccDetailsObj){
            navigation.navigate("EMailAccountsEntryEdit",AccDetailsObj);
        }else{
            navigation.navigate("EMailAccountsEntryEdit",{name:"",details:{name:"",email:"",password:"",hint:"",eDate:"",remainder:false}});
        }        
        setMenuOption({...MenuOption,searchData:""})
    }
    function moveToCardOption(CardDetailsObj){
        if(!CardDetailsObj){
            navigation.navigate("CardDetailsEntry",{});
            setMenuOption({...MenuOption,searchData:""})
        }
        else{
            alert("Edit Not Implemented!!!");
        }
    }
    const getMailAccountList = ()=>{
        let eMailAccList = PwdList.email;
        console.log("getMailAccountList : ",eMailAccList);
        return(eMailAccList.map((ele,index)=>{ return(
            <View key={index} style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                <TouchableOpacity style={{width:100+'%',flexDirection:'row'}} onPress={()=>moveToEmailOption(ele)} >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65,marginLeft:5}}>{ele.name}</Text>
                    <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                </TouchableOpacity>
            </View>
        )}))        
    }
    const getCardDetailsList = ()=>{
        let cardDetailsList = PwdList.card;
        return (cardDetailsList.map((ele,index)=>{ return(
            <View key={index} style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                <TouchableOpacity style={{width:100+'%',flexDirection:'row'}} onPress={()=>moveToCardOption(ele)} >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65,marginLeft:5}}>{ele.cNumber}</Text>
                    <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                </TouchableOpacity>
            </View>
        )}))
    }
    function getDefaultMenuList(){
        console.log("MEGALA===>DefaultMenuList",DefaultMenuList)
        return (
        DefaultMenuList.map((ele,index)=>{ return(
            <View key={index} style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                <TouchableOpacity style={{width:100+'%',flexDirection:'row'}} onPress={()=>moveToMenuOption(ele.component)}  >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65}}> {ele.name}</Text>
                    <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                </TouchableOpacity>
            </View>
        )}))
    }
    function getSearchList(){
        let searchList = gblData.search || []; 
        return (
            searchList.map((ele,index)=>{ return(
                ele.name.toLowerCase().startsWith(MenuOption.searchData.toLowerCase()) &&
                    <View key={index} style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                        <TouchableOpacity style={{width:100+'%',flexDirection:'row'}} onPress={()=>moveToRelaventOption(ele)} >
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65,marginLeft:5}}> {ele.name}</Text>
                            <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                        </TouchableOpacity>
                    </View> 
            )})
            )
    }
    function moveToRelaventOption(ele){
        if(ele.type === "menu"){
            switch(ele.name){
                case "eMail Accounts":
                    moveToMenuOption("EMailAccounts");
                    break;
                case "Cards":
                    moveToMenuOption("CardDetails");
                    break;
                case "Generate Password":
                    moveToMenuOption("GeneratePassword");
                    break;
            }            
        }else if(ele.type === "email"){
            moveToEmailOption(ele);
        }else if(ele.type === "card"){
            moveToCardOption(ele);
        }
    }
    useEffect(() =>  {
        const listerner = navigation.addListener('focus', async () => {
            
            //await AsyncStorage.setItem("passWordManager","{}");
            let passWordManager = await AsyncStorage.getItem("passWordManager");
            if (passWordManager !== null) {
                // We have data!!
                passWordManager = JSON.parse(passWordManager);
                console.log("parsed passWordManager : ",passWordManager);
            }else{
                passWordManager = {};
            }
            console.log("=====addListener Called from Home Screen",passWordManager);
            
            if(passWordManager){
                let email =  passWordManager.email || [];
                let card =  passWordManager.card || [];
                updateSearchValues(email,card);
                console.log("in Listener : ",gblData.search)
                setPwdList({email:email,card:card})
            }  
        });
        return listerner;
      }, [navigation]);
    function updateSearchValues(email,card){
        gblData.search = [{name:"eMail Accounts",type:"menu"},{name:"Cards",type:"menu"},{name:"Generate Password",type:"menu"}];
        if(gblData.currentPage == "menu"){
            email.forEach(function(ele,index){
                gblData.search[gblData.search.length] = {name:ele.name,type:"email",details:ele.details}
            })
            card.forEach(function(ele,index){
                gblData.search[gblData.search.length] = {name:ele.cNumber,type:"card",details:ele.details}
            })
            setMenuOption({...MenuOption,showDefaultMenu:true,showCardDetails:false,showEMailAcc:false,showSearchResult:false,searchData:""})
        }else if(gblData.currentPage == "email" ){
            gblData.search=[];
            email.forEach(function(ele,index){
                gblData.search[gblData.search.length] = {name:ele.name,type:"email",details:ele.details}
            })
            setMenuOption({...MenuOption,showDefaultMenu:false,showCardDetails:false,showEMailAcc:true,showSearchResult:false,searchData:""})
        }else if(gblData.currentPage == "card"){
            gblData.search=[];
            card.forEach(function(ele,index){
                gblData.search[gblData.search.length] = {name:ele.cNumber,type:"card",details:ele.details}
            })
            setMenuOption({...MenuOption,showDefaultMenu:false,showCardDetails:true,showEMailAcc:false,showSearchResult:false,searchData:""})
        }        
    }
    const goBack = async () => {        
        console.log("MEGALA===>goBack clicked",MenuOption.showDefaultMenu)
        let passWordManager = await AsyncStorage.getItem("passWordManager");
        if (passWordManager !== null) {
            // We have data!!
            passWordManager = JSON.parse(passWordManager);
            console.log("parsed passWordManager : ",passWordManager);
        }else{
            passWordManager = {};
        }        
        let email =  passWordManager.email || [];
        let card =  passWordManager.card || [];
        gblData.currentPage="menu";
        updateSearchValues(email,card);
    }
    function OnSearchUpdate(text){
        //let passWordManager = await AsyncStorage.getItem("passWordManager");
        if(text=="" && gblData.currentPage == "menu"){
            setMenuOption({...MenuOption,showDefaultMenu:true,showEMailAcc:false,showCardDetails:false,showSearchResult:false,searchData:text});
        }else if(text == "" && gblData.currentPage == "email"){
            setMenuOption({...MenuOption,showDefaultMenu:false,showEMailAcc:true,showCardDetails:false,showSearchResult:false,searchData:text});
        }else if(text == "" && gblData.currentPage == "card"){
            setMenuOption({...MenuOption,showDefaultMenu:false,showEMailAcc:false,showCardDetails:true,showSearchResult:false,searchData:text});
        }else{
            setMenuOption({...MenuOption,showDefaultMenu:false,showEMailAcc:false,showCardDetails:false,showSearchResult:true,searchData:text});
        }
        console.log("Megala=>>> : ",gblData.currentPage , gblData.search)
        
    }
    function OpenBrowser(){
        let url="http://www.google.com"
        openURLInBrowser(url);
    }
    function GetSideBarListData(){
        return (
            SideBarList.map((ele,index)=>{ return(
                <View key={index} style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}} >
                    <TouchableOpacity style={{width:100+'%',flexDirection:'row'}} onPress={()=>OpenBrowser()} >
                            <Text style={{ fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65}}> {ele}</Text>
                            <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                    </TouchableOpacity>
                </View>
            )})
        )
    }
    const drawerContent = () => {
        return (
        <View style={{width:100+'%',height:100+'%',backgroundColor:'white'}}>
            <View style={styles.HomeHeader} >
                <TouchableOpacity style={{marginLeft:15,marginTop:43}}  onPress={()=>moveToSideBar()}  >
                    <Image style={{width:50,height:50}} source={require('../images/close.png')} />
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <ScrollView>
                    {GetSideBarListData()}
                </ScrollView>
            </View>
        </View>
        );
    };
    function moveToSideBar() {
        setOpen(!open);
    }
    return(<View style={styles.HomeContainer} >
        <View style={styles.HomeHeader} >
           {gblData.currentPage === "menu" && 
            <MenuDrawer
                open={open} 
                drawerContent={drawerContent()}
                drawerPercentage={100}
                animationTime={250}
                overlay={true}
                opacity={1}
                >
                <TouchableOpacity style={{marginLeft:15,marginTop:33}} onPress={()=>moveToSideBar()} >
                    <Image style={{width:50,height:50}} source={require('../images/menu.png')} />
                </TouchableOpacity>
           </MenuDrawer>
           }
           {gblData.currentPage === "menu" && 
                <TouchableOpacity style={{marginLeft:Dimensions.get('window').width-80,marginTop:30}} onPress={()=>moveToSettingsOption()} >
                    <Image style={{width:50,height:50}} source={require('../images/settings.png')} />
                </TouchableOpacity>
           }
           {gblData.currentPage !== "menu" &&
           <TouchableOpacity style={{marginLeft:15,marginTop:30}} onPress={()=>goBack()} >
                <Image style={{width:50,height:50}}  source={require('../images/back.png')} />
            </TouchableOpacity>
            }
            
        </View>
        <View style={styles.HomeBody}>
            <View style={styles.HomeSearch}>
                <Image source={require('../images/search.png')} />
                <TextInput maxLength={30} placeholder="Search" value={MenuOption.searchData} style={styles.HomeSearchTextInput} onChangeText={(text) => OnSearchUpdate(text)} ></TextInput>
            </View>
            <ScrollView>
            {MenuOption.showDefaultMenu &&             
            <View style={styles.DefaultMenuContainer}>
                {getDefaultMenuList()}
            </View>
            }
            {MenuOption.showSearchResult &&
            <View style={styles.DynamicContainer}>
                {getSearchList()}
            </View>}
            {MenuOption.showEMailAcc &&
            <View style={styles.DynamicContainer}>
                <View style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                    <TouchableOpacity style={{width:100+'%',flexDirection:'row'}}  onPress={()=>moveToEmailOption()} >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65,marginLeft:5}}>New Entry</Text>
                        <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}} >&gt;</Text>
                    </TouchableOpacity>
                </View>
                {getMailAccountList()}
            </View>}
            {MenuOption.showCardDetails &&
            <View style={styles.DynamicContainer}>
                <View style={{width:80+'%',height:70,borderWidth:2,borderColor:'black',marginLeft:10+'%',marginTop:20,flexDirection:'row'}}>
                    <TouchableOpacity style={{width:100+'%',flexDirection:'row'}}  onPress={()=>moveToCardOption()} >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily:'Calibri',width:80+'%', fontSize:24,lineHeight:65,marginLeft:5}}>New Entry</Text>
                        <Text style={{flex:1,fontSize:24,lineHeight:65,textAlign:'center'}}  >&gt;</Text>
                    </TouchableOpacity>
                </View>
                {getCardDetailsList()}
            </View>}
            </ScrollView>
        </View>        
    </View>)
}

const styles = StyleSheet.create({
    HomeContainer:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        flex:1
    },
    HomeHeader:{
        width:100+'%',
        height:20+'%',
        flexDirection:'row'
    },
    HomeBody:{
        height:78+'%',
        width:100+'%'
    },
    HomeSearch:{
        width:80+'%',
        marginLeft:10+'%',
        alignItems:'center',
        flexDirection:'row',
        borderWidth:2,
        borderColor:'gray',        
        backgroundColor:'white'
    },
    HomeSearchTextInput:{
        flex:1,
        borderWidth:0,
        fontSize:24,
        fontFamily:'Calibri'
    },
    DefaultMenuContainer:{
        flex:1,
        marginTop:10
    },
    DynamicContainer:{
        flex:1,
        marginTop:10
    }

})
export default HomeComponent;