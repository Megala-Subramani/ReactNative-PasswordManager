import React,{useState,useRef} from 'react';
import { SafeAreaView,Image, View,StyleSheet,Dimensions,Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const GeneratePassword = ({navigation,route}) =>{
    const [pwdObj,setPwdObj] = useState({len:"",caps:"",small:"",int:"",schar:""});
    const [pwdType,setPwdType] = useState({easy:true,medium:false,strong:false});
    const [password,setPassword] = useState("");
    const lenInputEl = useRef(null);
   function RefreshPassword(){
        setPwdObj({len:"",caps:"",small:"",int:"",schar:""})
        setPwdType({easy:true,medium:false,strong:false})
        setPassword("")
   }
   function selectPwdType(type){
       switch(type){
            case "easy":
                setPwdType({easy:true,medium:false,strong:false});
                break;
            case "medium":
                setPwdType({easy:false,medium:true,strong:false});
                break;
            case "strong":
                setPwdType({easy:false,medium:false,strong:true});
                break;
            default:
                break;
       }    
   }
   function GetRandomCapsLetter(length){
        let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
   }
   function GetRandomSmallLetter(length){
        let charset = "abcdefghijklmnopqrstuvwxyz",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;  
   }
   function GetRandomNumber(length){
        let charset = "0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;  
   }
   function GetRandomSpecialChar(length){
        let charset = "`~!@#$%^&*()_+-=[]{}\|;:',./<>?",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;  
   }
   function ShufflePwd(str){  
        var a = str.split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }
   function GeneratePassword(){
        let pwdLen = parseInt(pwdObj.len == "" ? 0 : pwdObj.len ,10);
        let caps = parseInt(pwdObj.caps == "" ? 0 : pwdObj.caps,10);
        let small = parseInt(pwdObj.small == "" ? 0 : pwdObj.small,10);
        let int = parseInt(pwdObj.int == "" ? 0 : pwdObj.int,10);
        let schar = parseInt(pwdObj.schar == "" ? 0 :pwdObj.schar,10);
        let total = caps+small+schar+int;
        if(pwdLen != total){
            alert("Total Mistake!");
            lenInputEl.current.focus();
            return false;
        }
        let getRandomCapsLetter = GetRandomCapsLetter(caps);
        let getRandomSmallLetter = GetRandomSmallLetter(small);
        let getRandomNumber = GetRandomNumber(int)
        let getRandomSpecialChar = GetRandomSpecialChar(schar);
        let password = ShufflePwd(getRandomCapsLetter+getRandomSmallLetter+getRandomNumber+getRandomSpecialChar);
        setPassword(password);
   }
   const SavePassword = async () => {
       if(password == ""){
           alert("No Data Available!");
           return false;
       }
        let passWordManager = await AsyncStorage.getItem("passWordManager");
        if (passWordManager !== null) {
            // We have data!!
            passWordManager = JSON.parse(passWordManager);
            console.log("parsed passWordManager : ",passWordManager);
        }else{
            passWordManager = {};
        }
        passWordManager.password = password;
        await AsyncStorage.setItem("passWordManager",JSON.stringify(passWordManager));
        console.log("Saved Password : ",password);
        navigation.navigate("HomeComponent",{});
   }
   function updateValues(text,name){
        let reg = new RegExp(/^\d+$/);
        let data = reg.test(text) ? text : "";
        setPwdObj({...pwdObj,[name]:data});
   }
    return(<SafeAreaView style={styles.safeContainer} >
    <ScrollView  contentContainerStyle={{ flexGrow: 1 }}  contentInsetAdjustmentBehavior="automatic">
        <View style={styles.ContainerBody}>
            <View style={{width:100+'%',height:50}}>
                <TouchableOpacity style={{marginLeft:5,marginTop:10}} onPress={()=>navigation.goBack()} >
                    <Image style={{width:40,height:40}} source={require('../images/back.png')} />
                </TouchableOpacity>
            </View>
            <View style={[styles.row]}>
                <Text style={styles.textStr}>
                    Length of Password Required
                </Text>
                <TextInput ref={lenInputEl} style={styles.textInput} numberOfLines={1} maxLength={2} keyboardType='number-pad' value={pwdObj.len} onChangeText={(text)=>updateValues(text,'len')} />
            </View>
            <View style={styles.row}>
                <Text style={styles.textStr}>
                    Number of Captial letters
                </Text>
                <TextInput style={styles.textInput} numberOfLines={1} maxLength={2} keyboardType='number-pad' value={pwdObj.caps} onChangeText={(text)=>updateValues(text,'caps')} />
            </View>
            <View style={styles.row}>
                <Text style={styles.textStr}>
                    Number of Small letters
                </Text>
                <TextInput style={styles.textInput} numberOfLines={1} maxLength={2} keyboardType='number-pad' value={pwdObj.small} onChangeText={(text)=>updateValues(text,'small')}  />
            </View>
            <View style={styles.row}>
                <Text style={styles.textStr}>
                    Number of Intergers
                </Text>
                <TextInput style={styles.textInput} numberOfLines={1} maxLength={2} keyboardType='number-pad' value={pwdObj.int} onChangeText={(text)=>updateValues(text,'int')}  />
            </View>
            <View style={styles.row}>
                <Text style={styles.textStr}>
                    Number of Special charecters
                </Text>
                <TextInput style={styles.textInput} numberOfLines={1} maxLength={2} keyboardType='number-pad' value={pwdObj.schar} onChangeText={(text)=>updateValues(text,'schar')}  />
            </View>
            <View style={styles.BtnRow1}>
                <TouchableOpacity style={[styles.BtnOptions1,{backgroundColor:pwdType.easy ? 'blue':'gray'}]} onPress={()=>selectPwdType('easy')} ><Text style={styles.TextRow}>Easy</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.BtnOptions1,{backgroundColor:pwdType.medium ? 'blue':'gray'}]} onPress={()=>selectPwdType('medium')} ><Text style={styles.TextRow}>Medium</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.BtnOptions1,{backgroundColor:pwdType.strong ? 'blue':'gray'}]} onPress={()=>selectPwdType('strong')} ><Text style={styles.TextRow}>Strong</Text></TouchableOpacity>
            </View>
            <View style={{alignSelf:'center'}}>
                <TouchableOpacity style={styles.BtnOptions2} onPress={GeneratePassword} ><Text style={styles.TextRow}>Generate Password</Text></TouchableOpacity>
            </View>
            <View style={styles.BtnRow1}>
                <TextInput showSoftInputOnFocus={false} style={[styles.textInput,{width:80+'%',marginLeft:10+'%',color:'black'}]}  onPress={(e)=>e.preventDefault()} numberOfLines={1}  value={password}  />
            </View>
            <View style={{alignSelf:'center'}}>
                <TouchableOpacity style={styles.refreshPwdBox} onPress={RefreshPassword}>
                <Text style={{color:'blue',fontSize:18}}>Refresh Password</Text>
                </TouchableOpacity>
            </View>
            <View style={{alignSelf:'center'}}>
                <TouchableOpacity style={styles.BtnOptions2} onPress={SavePassword} ><Text style={styles.TextRow}>Save Password</Text></TouchableOpacity>
            </View> 
            
        </View>   
    </ScrollView>
    </SafeAreaView>)
}
const styles=StyleSheet.create({
    safeContainer:{
        flex:1
    },
    ContainerBody:{
        width:100+'%',
        paddingBottom:20
    },
    row:{
        width:100+'%',
        height:70,
        flexDirection:'row'
    },
    textStr:{
        fontSize:20,
        width:70+'%',
        lineHeight:65,
        marginLeft:10
    },
    textInput:{
        borderWidth:1,
        borderColor:'gray',
        fontSize:20,
        width:90,
        height:52,
        marginTop:10,
        textAlign:'center'
    },
    BtnRow1:{
        width:100+'%',
        flexDirection:'row',
        alignSelf:'center',
        marginTop:20
    },
    BtnOptions1:{
        width:Dimensions.get('window').width/3 - 30,
        height:60,
        backgroundColor:'gray',
        marginLeft:20,
        borderRadius:5
    },
    TextRow:{
        color:'white',
        fontSize:20,
        alignSelf:'center',
        lineHeight:50
    },
    BtnOptions2:{
        width:200,
        height:60,
        backgroundColor:'blue',
        borderRadius:5,
        marginTop:20
    },
    refreshPwdBox:{
        elevation: 10
    }
});
export default GeneratePassword;