/*=========================
Type: Page

Description:
View Subscriptions Page where users have the ability to view their subscribed and created rides.
They can do the same functionalities they can in the Discover Page. However,no search bar and no create button is
present
=========================*/

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import GroupRideCard from '../components/GroupRideCard';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Spinner from '../components/Spinner';
import {SERVER_IP} from '@env';

const ViewSubscriptions = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState(null);
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    if (isLoading) {
      const getSubscriptions = async () => {
        const response = await axios.get(
          `http://${SERVER_IP}:8080/api/users/getMySubscriptions/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        if (response.data) {
          setSubscriptions(response.data);
          setIsLoading(false);
        }
      };
      getSubscriptions();
    }
  }, [user._id, user.token, isLoading]);

  console.log('Subscribed user rides from view subs:', user.subscribedRides);

  const navigateToEditFromCard = (
    rideID,
    rideName,
    riderCreator,
    rideDescription,
    rideLocation,
    rideCoordinates,
  ) => {
    navigation.navigate('UpdateGroupRideCard', {
      rideID: rideID,
      rideName: rideName,
      riderCreator: riderCreator,
      rideDescription: rideDescription,
      rideLocation: rideLocation,
      rideCoordinates: rideCoordinates,
    });
  };

  const renderItem = ({item}) => (
    <GroupRideCard
      rideName={item.rideName}
      riderCreator={item.riderCreator}
      riderProfile={item.riderProfile}
      rideDescription={item.rideDescription}
      rideLocation={item.rideLocation}
      rideID={item._id}
      removeCard={true}
      rideCoordinates={item.routeCoordinates}
      navigateToEdit={navigateToEditFromCard}
      hideDeletedCard={true}
    />
  );
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#1E1F21'}}>
      {subscriptions.length > 0 || !isLoading ? (
        <FlatList
          data={subscriptions}
          renderItem={renderItem}
          keyExtractor={subscriptions._id}
        />
      ) : (
        <Text
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'center',
          }}>
          No Group Rides Found
        </Text>
      )}
    </View>
  );
};

export default ViewSubscriptions;
