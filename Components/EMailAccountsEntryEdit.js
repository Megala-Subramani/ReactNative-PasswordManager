import React,{useState,useRef} from 'react';
import {  ScrollView,View,Text,StyleSheet,Dimensions,TouchableOpacity, TextInput,Image,KeyboardAvoidingView,Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

const EMailAccountsEntryEdit = ({navigation,route}) =>{
    const nameInputEl = useRef(null);
    const emailInputEl = useRef(null);
    const pwdInputEl = useRef(null);
    const hintInputEl = useRef(null);
    const dateInputEl = useRef(null);
    const routeAccDetails = route.params.details;
    const routeAccName = route.params.name;
    const [removeEditBtn,setEditBtn] = useState(routeAccName === ""?false:true);
    const [editTable,setEditable] = useState(routeAccName === ""?true:false);    
    const [encodePwd,setEncodePwd] = useState(true);
    const [encodeHint,setEncodeHint] = useState(true);
    const [AccDetails,setAccDetails] = useState({name:routeAccDetails.name,email:routeAccDetails.email,password:routeAccDetails.password,hint:routeAccDetails.hint,eDate:routeAccDetails.eDate,remainder:routeAccDetails.remainder});

    function isEmailAddress(str){
        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
        return str.match(pattern);  
    }
    function ValidateAccDetails(passWordManager){
        let name = AccDetails.name;
        if(name.length === 1 || !isNaN(name) || name.replace(/\s/g, '') === ""){
            alert("Fill Valid Account Name");
            nameInputEl.current.focus();
            return false;
        }
        if(passWordManager && passWordManager.email){
            let AccList = passWordManager.email;//For Edit
            let isNotExists= true;
            AccList.forEach(function(ele,index){
                if(ele.name.toLowerCase() !== routeAccName.toLowerCase() && ele.name.toLowerCase() === name.toLowerCase()){
                    alert("Account Name already Exists!");
                    nameInputEl.current.focus();
                    isNotExists = false;
                    return false;
                }
            })
            if(!isNotExists){
                return false;
            }
        }
        let email = AccDetails.email;
        if(email.length === 1 || email.replace(/\s/g, '') === "" || !isEmailAddress(email)){
            alert("Fill Valid Email");
            emailInputEl.current.focus();
            return false;
        }
        let pwd = AccDetails.password;
        if(pwd.length === 1 || pwd.replace(/\s/g, '') === ""){
            alert("Fill Valid Password");
            pwdInputEl.current.focus();
            return false;
        }
        let hint = AccDetails.hint;
        if(hint.length === 1 || hint.replace(/\s/g, '') === ""){
            alert("Fill Valid Hint");
            hintInputEl.current.focus();
            return false;
        }
        let date = AccDetails.eDate;
        console.log("Date String: ",date)
        if(!date || date.replace(/\s/g, '') === ""){
            alert("Fill Valid Date");
            dateInputEl.current.focus();
            return false;
        }
        return true;
    }
    const SaveAccDetails = async () => {
        let passWordManager = await AsyncStorage.getItem("passWordManager");
        if (passWordManager !== null) {
            // We have data!!
            passWordManager = JSON.parse(passWordManager);
            console.log("parsed passWordManager : ",passWordManager);
        }else{
            passWordManager = {};
        }
        if(ValidateAccDetails(passWordManager)){            
            console.log("Router params in Acc Save:",route.params)
            if(route.params.name !== ""){
                //Edit
                let AccList = passWordManager.email;
                AccList.forEach(function(ele,index){
                    if(ele.name === routeAccName){
                        passWordManager.email[index]={name:AccDetails.name,details:AccDetails}
                    }
                })
                await AsyncStorage.setItem("passWordManager",JSON.stringify(passWordManager));
                console.log("Edit Success: ",passWordManager);
            }else{
                //Entry
                if(passWordManager && passWordManager.email){
                    passWordManager.email[passWordManager.email.length]={name:AccDetails.name,details:AccDetails};
                }else{
                    //First Entry
                    passWordManager.email=[{
                        name:AccDetails.name,
                        details:AccDetails
                    }];
                }
                await AsyncStorage.setItem("passWordManager",JSON.stringify(passWordManager));
                console.log("Entry Success: ",passWordManager);
            }
            navigation.navigate("HomeComponent",{});
        }
    }
    return(<View style={styles.AccContainer}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}>
        <View style={styles.ContainerHeader}>
            {removeEditBtn && 
            <TouchableOpacity style={styles.EditBtn} onPress={()=>setEditable(true)} >
                <Text style={styles.EditBtnText}>Edit details</Text>
            </TouchableOpacity>
            }
        </View>
        <View style={styles.ContainerBody}>
        <ScrollView>
            <TextInput editable={editTable} placeholder="Account Name" ref={nameInputEl} value={AccDetails.name} onChangeText={(text)=>{ setAccDetails({...AccDetails,name:text})}}  numberOfLines={1} maxLength={30} style={[styles.EditBox,{marginTop:0}]} />
            <TextInput editable={editTable}  placeholder="Email" ref={emailInputEl} value={AccDetails.email} onChangeText={(text)=>{ setAccDetails({...AccDetails,email:text})}}  numberOfLines={1} maxLength={30} style={styles.EditBox} />
            <View style={styles.ViewPwd}>
            <TextInput editable={editTable}  placeholder="Password" ref={pwdInputEl}  value={AccDetails.password} onChangeText={(text)=>{ setAccDetails({...AccDetails,password:text})}} secureTextEntry={encodePwd}  numberOfLines={1} maxLength={30} style={styles.PwdEditBox} />
            <TouchableOpacity disabled={!editTable} style={{marginLeft:2+'%'}} onPressIn={()=>setEncodePwd(false)} onPressOut={()=>setEncodePwd(true)} >
                <Image style={{opacity:0.5}}  source={require('../images/eye.png')} />
            </TouchableOpacity>
            </View>
            <View style={styles.ViewPwd}>
            <TextInput editable={editTable}  placeholder="Hint" ref={hintInputEl}  value={AccDetails.hint} onChangeText={(text)=>{ setAccDetails({...AccDetails,hint:text})}}  secureTextEntry={encodeHint} numberOfLines={1} maxLength={30} style={styles.PwdEditBox} />
            <TouchableOpacity disabled={!editTable} style={{marginLeft:2+'%'}} onPressIn={()=>setEncodeHint(false)} onPressOut={()=>setEncodeHint(true)} >
                <Image style={{opacity:0.5}} source={require('../images/eye.png')} />
            </TouchableOpacity>
            </View>
            <DatePicker disabled={!editTable} ref={dateInputEl}
            style={[styles.EditBox,{opacity:!editTable?0.5 : 1}]}
          date={AccDetails.eDate} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Expiry Date"
          format="DD/MM/YYYY"
          minDate={new Date()}
          maxDate="01-01-2100"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel" 
          customStyles={{
            dateIcon: {
              display: 'none',
              position: 'absolute',
              right: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 0,
              borderWidth:0
            }
          }}
          onDateChange={(date) => {
            setAccDetails({...AccDetails,eDate:date});
          }}
        />
        <View  style={styles.ViewPwd}>
            <TextInput editable={false} placeholderTextColor={AccDetails.remainder ? (!editTable ? "silver" : "black") :"silver"} placeholder="Password expiry remainder"  numberOfLines={1} style={styles.PwdEditBox} />
            <View style={{marginLeft:2+'%'}} >
                <Checkbox disabled={!editTable} status={AccDetails.remainder ? 'checked' : 'unchecked'} onPress={() => { setAccDetails({...AccDetails,remainder:!AccDetails.remainder}); }} />
            </View>
        </View>
        
        
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={styles.DiscardBtn} onPress={()=>navigation.navigate("HomeComponent",{})} >
                <Text style={styles.EditBtnText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SaveBtn} onPress={SaveAccDetails} >
                <Text style={styles.EditBtnText}>Save</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        </View>
        </KeyboardAvoidingView>
    </View>)
}
const styles=StyleSheet.create({
    PwdEditBox:{
        height:100+'%',
        width:85+'%',
        fontSize:20
    },
    EditBox:{
        width:85+'%',
        height:50,
        borderWidth:2,
        borderColor:'gray',
        marginTop:20,
        alignSelf:'center',
        fontSize:20
    },
    ViewPwd:{
        width:85+'%',
        height:50,
        marginTop:20,
        alignSelf:'center',
        alignItems:'center',
        flexDirection:'row',
        borderWidth:2,
        borderColor:'gray'
    },
    AccContainer:{
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        backgroundColor:'white'
    },
    ContainerHeader:{
        width:100+'%',
        height:12+'%',
        flexDirection:'row',
        backgroundColor:'white'
    },
    ContainerBody:{
        width:100+'%',
        height:88+'%',
        flexDirection:'column',
        backgroundColor:'white'
    },
    SaveBtn:{
        width:150,
        height:50,
        borderWidth:2,
        backgroundColor:'#424bb2',
        borderColor:'#424bb2',
        borderRadius:4,
        marginLeft:10,
        marginTop:15
    },
    DiscardBtn:{
        width:150,
        height:50,
        borderWidth:2,
        backgroundColor:'#424bb2',
        borderColor:'#424bb2',
        borderRadius:4,
        marginLeft:30,
        marginTop:15
    },
    EditBtn:{
        width:180,
        height:50,
        borderWidth:2,
        backgroundColor:'#424bb2',
        borderColor:'#424bb2',
        borderRadius:4,
        marginTop:10,
        marginLeft:Dimensions.get('window').width-190
    },
    EditBtnText:{
        color:'white',
        fontSize:22,
        lineHeight:45,
        textAlign:'center'
    }
})
export default EMailAccountsEntryEdit;