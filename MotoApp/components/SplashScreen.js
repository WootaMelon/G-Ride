/*=========================
Type: Component

Description:
Heart Component That checks whether a user exists in local storage. If no user is found,
it renders the login and register pages only. If a user is found in local storage, it renders the app

=========================*/

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {checkStorage} from '../features/auth/authSlice';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home';
import LoginForm from '../Pages/LoginForm';
import RegisterForm from '../Pages/RegisterForm';
import ViewSubscriptions from '../Pages/ViewSubscriptions';
import NearbyProfile from './NearbyProfile';
import CreateGroupRideCard from './CreateGroupRideCard';
import UpdateGroupRideCard from './UpdateGroupRideCard';
import Garage from './Garage';

const Stack = createNativeStackNavigator();

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user, isLoading, isError, isSuccess} = useSelector(
    state => state.auth,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const getMyObject = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('user');
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // read error
        }

        console.log('Done.');
      };

      dispatch(checkStorage(getMyObject()));
      setLoading(false);
    }
    if (isLoading) {
      console.log('Loading');
    }
    if (isError) {
      console.log('Error');
    }
    if (isSuccess) {
    }
  }, [dispatch, loading, user, isSuccess, isError, isLoading]);
  if (loading || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FA8334" />
        <Text style={styles.text}>Splash Screen</Text>
      </View>
    );
  }
  return (
    <Stack.Navigator>
      {user === null ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginForm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterForm}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'card'}}>
            <Stack.Screen
              name="ViewSubscriptions"
              component={ViewSubscriptions}
              options={{
                headerBackTitle: 'Profile',
                headerStyle: {backgroundColor: '#1E1F21'},
                headerTitle: 'Subscriptions',
                headerTitleStyle: {color: 'white'},
              }}
            />
            <Stack.Screen
              name="NearbyProfile"
              component={NearbyProfile}
              options={{
                headerBackTitle: 'Nearby',
                headerStyle: {backgroundColor: '#1E1F21'},
                headerTitle: 'Profile',
                headerTitleStyle: {color: 'white'},
              }}
            />

            <Stack.Screen
              name="Garage"
              component={Garage}
              options={{
                headerBackTitle: 'Profile',
                headerStyle: {backgroundColor: '#1E1F21'},
                headerTitle: 'Garage',
                headerTitleStyle: {color: 'white'},
              }}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen
              name="CreateGroupRideCard"
              component={CreateGroupRideCard}
              options={{title: 'Create a Group Ride'}}
            />
            <Stack.Screen
              name="UpdateGroupRideCard"
              component={UpdateGroupRideCard}
              options={{title: 'Update your Group Ride'}}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
  },
});
export default SplashScreen;
