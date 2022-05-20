/*=========================
Type: Component

Description:
Contains information about a group ride (route,name,creater) 
Allows user to view participants and subscribe to ride
Allows creater to edit/delete ride

=========================*/

// Hooks
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// Components
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
// Custom Components
import ParticipantsModal from './ParticipantsModal';
import MapRead from './MapRead';
// Functionalities
import axios from 'axios';
import {deleteGroupRide} from '../features/groupRides/groupRideSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateSubscribedRides} from '../features/auth/authSlice';
import {SERVER_IP} from '@env';

// PROPS: ride information, navigate to edit function
const GroupRideCard = ({
  rideName,
  riderCreator,
  riderProfile,
  rideDescription,
  rideLocation,
  rideCoordinates,
  rideID,
  removeCard,
  navigateToEdit,
  hideDeletedCard,
}) => {
  // Logic
  const [allowSubscribe, setAllowSubscribe] = useState(true);
  const [text, setText] = useState('subscribe');
  const [modalVisible, setModalVisible] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [buttonColor, setButtonColor] = useState('#39FF13');
  const [showDeletedCard, setShowDeletedCard] = useState(true);
  // Redux
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  // Used to merge new user (after subscribing/unsubscribing/deleting ride) with old user in async storage
  const mergeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem('user', jsonValue);
      console.log('Merge DATA: ', jsonValue);
    } catch (e) {}
  };
  const getMyObject = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }

    console.log('Done.');
  };

  // =================================================================
  const deleteRide = async () => {
    dispatch(deleteGroupRide(rideID));
  };

  // =================================================================

  const subscribeToRide = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await axios.post(
      `http://${SERVER_IP}:8080/api/users/subscribeToRide/${user._id}`,
      {rideName: rideName},
      config,
    );
    if (response.data) {
      mergeData(response.data);
      dispatch(updateSubscribedRides(getMyObject()));
      console.log('Subscribed to Ride:', response.data);
      setText('unsubscribe');
      setAllowSubscribe(true);
    }
    return response.data;
  };

  // =================================================================

  const unsubscribeToRide = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const deleteResponse = await axios.post(
      `http://${SERVER_IP}:8080/api/users/unsubscribeToRide/${user._id}`,
      {rideName: rideName},
      config,
    );
    if (deleteResponse.data) {
      mergeData(deleteResponse.data);
      dispatch(updateSubscribedRides(getMyObject()));
      console.log('UnSubscribed to Ride: ', deleteResponse.data);
      setAllowSubscribe(true);
      setText('subscribe');
    }
    return deleteResponse.data;
  };

  // =================================================================

  useEffect(() => {
    if (riderCreator === user.name) {
      setAllowSubscribe(false);
    }

    if (
      (user.subscribedRides.includes(rideID) && riderCreator !== user.name) ||
      removeCard
    ) {
      setButtonColor('#FF0035');
      setText('unsubscribe');
    }
  }, [user, riderCreator, rideID, removeCard, hideDeletedCard]);

  if ((!showCard && removeCard) || (hideDeletedCard && !showDeletedCard)) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <Card elevation={2} style={{margin: 30, backgroundColor: '#2E3033'}}>
        <MapRead coordinates={rideCoordinates}></MapRead>
        <Card.Title
          titleStyle={styles.cardContent}
          subtitleStyle={styles.cardContent}
          title={rideName}
          subtitle={riderCreator}
          left={
            riderProfile !== ''
              ? () => <Avatar.Image size={48} source={{uri: riderProfile}} />
              : () => (
                  <Avatar.Image
                    size={48}
                    source={{
                      uri: 'https://res.cloudinary.com/dp1ppfi7c/image/upload/c_scale,w_256/v1651452445/biker_vwjaxx.jpg',
                    }}
                  />
                )
          }
          //Group Ride Profile Picture on left content
        />
        <Card.Content>
          <Title style={styles.cardContent}>{rideLocation}</Title>
          <Paragraph style={styles.cardContent}>{rideDescription}</Paragraph>
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() => setModalVisible(!modalVisible)}
            color="#39FF13">
            View Participants
          </Button>
          {modalVisible ? (
            <ParticipantsModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              rideName={rideName}
              rideID={rideID}
            />
          ) : (
            <></>
          )}

          {allowSubscribe ? (
            <Button
              color={buttonColor}
              onPress={
                text === 'subscribe'
                  ? () => {
                      setButtonColor('#FF0035');
                      subscribeToRide();
                    }
                  : () => {
                      setButtonColor('#39FF13');
                      setShowCard(false);
                      unsubscribeToRide();
                    }
              }>
              {text}
            </Button>
          ) : (
            <Button
              color={'#FF0035'}
              onPress={() => {
                setShowDeletedCard(false);
                deleteRide();
              }}>
              Delete
            </Button>
          )}
          {riderCreator === user.name ? (
            <TouchableOpacity
              onPress={() =>
                navigateToEdit(
                  rideID,
                  rideName,
                  riderCreator,
                  rideDescription,
                  rideLocation,
                  rideCoordinates,
                )
              }>
              <Icon size={16} color="white" name="edit" />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
  },
  cardContent: {
    color: '#ffffff',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  inputText: {
    fontSize: 13,
    padding: 10,
    height: 20,
    backgroundColor: 'white',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    alignSelf: 'center',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
export default GroupRideCard;
