import React,{useState,useRef,useContext} from 'react';
import { View ,TouchableOpacity , Text,StyleSheet,Dimensions,ScrollView,TextInput} from 'react-native';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io'
import AsyncStorage from "@react-native-async-storage/async-storage";

const CardDetailsEntry = ({navigation,route}) =>{
    const nameInputEl = useRef(null);
    const [editTable,setEditable] = useState(false);
    const [editName,setEditName] = useState(false);
    const [CardDetails,setCardDetails] = useState({name:"",type:"",number:"",eDate:"",cvv:"",redactedCardNumber:""});
    function scanCard() {
        CardIOModule.scanCard()
          .then(card => {
            console.log("the scanned card",card);
            setEditName(true);
            setCardDetails({name:card.cardholderName==null?"":card.cardholderName,type:card.cardType,number:card.cardNumber,eDate:card.expiryMonth+"/"+card.expiryYear,cvv:card.cvv,redactedCardNumber:card.redactedCardNumber})
          })
          .catch((e) => {
            console.log("the user cancelled",e);
          })
    }
    function onCardNameChange(name){
      setCardDetails(CardDetails => ({
        ...CardDetails,
        name : name
      })) 
    }
    function ValidateCardName(passWordManager){
      let name = CardDetails.name ;
      if(name.length === 1 || !isNaN(name) || name.replace(/\s/g, '') === ""){
        alert("Fill Valid Card Name");
        nameInputEl.current.focus();
        return false;
      }
      if(passWordManager && passWordManager.card){
          let CardList = passWordManager.card;
          let isNotExists= true;
          CardList.forEach(function(ele,index){
              if(ele.cNumber == CardDetails.number){
                  alert("Card Number already Exists!");
                  isNotExists = false;
                  return false;
              }
          })
          if(!isNotExists){
              return false;
          }
      }
      return true;
    }
    const SaveCardDetails = async () => {
      console.log("MEGALA===>SAVE CARD : ",CardDetails);
      let passWordManager = await AsyncStorage.getItem("passWordManager");
      if (passWordManager !== null) {
        // We have data!!
        passWordManager = JSON.parse(passWordManager);
        console.log("parsed passWordManager : ",passWordManager);
      }else{
          passWordManager = {};
      }
      if(ValidateCardName(passWordManager)){
        if(passWordManager && passWordManager.card){
          passWordManager.card[passWordManager.card.length]={cNumber:CardDetails.number,details:CardDetails};
        }else{
            //First Entry
            passWordManager.card=[{
              cNumber:CardDetails.number,
              details:CardDetails
            }];
        }
        await AsyncStorage.setItem("passWordManager",JSON.stringify(passWordManager));
        console.log("Card Details Save Successfully!");
        navigation.navigate("HomeComponent",{});
      }
    }    
    return(<View style={styles.CardContainer}>
        <View style={styles.ContainerHeader}>
            <TouchableOpacity style={styles.EditBtn} onPress={scanCard} >
                <Text style={styles.EditBtnText}>Scan Card</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.ContainerBody}>
          <ScrollView>
            <TextInput editable={editName} color="black" placeholder="Card Name" ref={nameInputEl} onChangeText={(text)=>{onCardNameChange(text)}} value={CardDetails.name} numberOfLines={1} maxLength={30} style={[styles.EditBox,{marginTop:0}]} />
            <TextInput editable={editTable} color="black" placeholder="Card Type - Visa/Master/Rupay" value={CardDetails.type} numberOfLines={1} maxLength={30} style={styles.EditBox} />
            <TextInput editable={editTable} color="black" placeholder="Card Number" value={CardDetails.number} numberOfLines={1} maxLength={30} style={styles.EditBox} />
            <TextInput editable={editTable} color="black" placeholder="Expiry Date" value={CardDetails.eDate} numberOfLines={1} maxLength={30} style={styles.EditBox} />
            <TextInput editable={editTable} color="black" placeholder="CVV" value={CardDetails.cvv} numberOfLines={1} maxLength={30} style={styles.EditBox} />
          
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={styles.DiscardBtn} onPress={()=>navigation.navigate("HomeComponent",{})} >
                    <Text style={styles.EditBtnText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!editName} style={[styles.SaveBtn,{opacity:!editName ? 0.5 : 1}]} onPress={SaveCardDetails} >
                    <Text style={styles.EditBtnText}>Save</Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
    </View>
    )
}

const styles=StyleSheet.create({
  CardContainer:{
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height
  },
  ContainerHeader:{
      width:100+'%',
      height:15+'%',
      flexDirection:'row',
      backgroundColor:'white'
  },
  ContainerBody:{
      width:100+'%',
      height:85+'%',
      flexDirection:'column',
      backgroundColor:'white'
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
    marginTop:10+'%',
    marginLeft:Dimensions.get('window').width-190
  },
  EditBtnText:{
      color:'white',
      fontSize:22,
      lineHeight:45,
      textAlign:'center'
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
  EditBox:{
      width:85+'%',
      height:58,
      borderWidth:2,
      borderColor:'gray',
      marginTop:30,
      alignSelf:'center',
      fontSize:20
  }
});
export default CardDetailsEntry;