import React from 'react';
import { StyleSheet,Dimensions,View,TouchableOpacity,Text } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetStartedPage = ({navigation,route}) =>{

    const moveToLoginPage = async () => {
        //await AsyncStorage.setItem("test","1222");
        console.log("moveToLoginPage : ");
        navigation.navigate("LoginPage",{});
    }

    return(<View style={styles.container} >
        <SliderBox disableOnPress={true} sliderBoxHeight={Dimensions.get('window').height} images={[
          require('../images/nature.jpg'),
          require('../images/tree.jpg'),
          require('../images/water.jpg')]}  autoplay autoplayInterval={3000} circleLoop dotColor="black" inactiveDotColor="gray" />
          <View style={styles.getStartedBtn}>
          <TouchableOpacity onPress={moveToLoginPage} ><Text style={styles.BtnText} >Get Started</Text></TouchableOpacity>
          </View>
       </View>)
}

const styles = StyleSheet.create({
    container: {
     flex:1
    },
    getStartedBtn:{
      position:'absolute',
      height:50,
      width:98+'%',
      top:Dimensions.get('window').height - 100,
      marginLeft:1+'%',
      backgroundColor:'#4d96ff'
    },
    BtnText:{
      color:'whitesmoke',
      fontWeight:'bold',
      fontSize:22,
      textAlign:'center',
      lineHeight:50
    }
  });

export default GetStartedPage;