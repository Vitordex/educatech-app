import React from 'react';
import Login from './LoginComponent/Login';
import Home from './Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'EducaTech' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Bem vindo!' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
