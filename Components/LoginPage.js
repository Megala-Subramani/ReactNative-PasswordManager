import React,{useRef} from 'react';
import { View,Dimensions,Image } from 'react-native';
import Codepin from 'react-native-pin-code'

const LoginPage = ({navigation,route}) =>{
    const reference = useRef();
    function moveToHomeComponent(){
        console.log("moveToHomeComponent : ");
        navigation.navigate("HomeComponent",{});
    }
    return(<View style={{backgroundColor:'white',width:Dimensions.get('window').width,height:Dimensions.get('window').height}} >
        <Image style={{position:'absolute',top:Dimensions.get('window').height/2-170,zIndex:1,left:Dimensions.get('window').width/2-100}} source={require("../images/user.png")} />
        <Codepin blurOnSubmit={false} ref={reference} number={4} checkPinCode={(code, callback) => callback(code === '0000')}
        success={moveToHomeComponent}
        text="Set Your Offline Pin" 
        error="INVALID PIN"
        containerStyle={{height: Dimensions.get('window').height/2 ,marginTop:Dimensions.get('window').height/2-200,
        width:Dimensions.get('window').width,
        backgroundColor : 'white' }}
        containerPinStyle={{flexDirection: 'row', 
        justifyContent: 'space-around',
        alignItems: 'center', marginTop: (Dimensions.get('window').height/2)-140 ,
        marginLeft: 0}}
        textStyle={{position:'absolute', color: 'black',fontWeight:'bold',fontSize: 38, 
        fontFamily:'Arial',
        top:  (Dimensions.get('window').height/2)-250 ,
        left:(Dimensions.get('window').width/2)-170}}
        pinStyle={{ height:60,fontSize:22,borderWidth:2,borderColor:'silver',backgroundColor:'white',
         textAlign: 'center', flex: 1, marginLeft: 25, marginRight: 0, borderRadius: 5,
          shadowColor: '#000000', shadowOffset: {width: 1,height : 1}, 
          shadowRadius: 5, shadowOpacity : 0.4 }}
        errorStyle={{position:'absolute', color: 'red',fontWeight:'bold',fontSize: 20, 
        fontFamily:'Arial',
        top:  -100 ,
        left:(Dimensions.get('window').width/2)-60}}
        autoFocusFirst={false} 
        keyboardType="numeric" />
    </View>)
}

export default LoginPage;