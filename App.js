/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GetStartedPage from './Components/GetStartedPage';
import LoginPage from './Components/LoginPage';
import HomeComponent from './Components/HomeComponent';
import GeneratePassword from './Components/GeneratePassword';
import EMailAccountsEntryEdit from './Components/EMailAccountsEntryEdit';
import CardDetailsEntry from './Components/CardDetailsEntry';
import { UserProvider } from './Context';

const Stack = createStackNavigator();
/*<Stack.Screen name="GetStartedPage" component={GetStartedPage}  options={{headerShown:false}} />
        <Stack.Screen name="LoginPage" component={LoginPage}  options={{headerShown:false}} />
        */
const App  = () => {  

  return (
    <UserProvider value={{currentPage:"menu",search:[]}}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeComponent" component={HomeComponent}  options={{headerShown:false}} />          
        <Stack.Screen name="GeneratePassword" component={GeneratePassword}  options={{headerShown:false}} />
        <Stack.Screen name="EMailAccountsEntryEdit" component={EMailAccountsEntryEdit}  options={{headerShown:false}} />
        <Stack.Screen name="CardDetailsEntry" component={CardDetailsEntry}  options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>  
    </UserProvider>  
  );
};



export default App;
