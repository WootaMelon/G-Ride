/*=========================
Type: Component

Description:
Helper Component for viewing users that are subscribed to the corresponding group ride

=========================*/
import React, {useEffect, useState} from 'react';
import {View, Modal, StyleSheet, Text, FlatList} from 'react-native';
import {Button, Chip, Avatar} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';

import {SERVER_IP} from '@env';
const ParticipantsModal = ({
  modalVisible,
  setModalVisible,
  rideName,
  rideID,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [Participants, setParticipants] = useState(null);
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    const getParticipants = async () => {
      const response = await axios.get(
        `http://${SERVER_IP}:8080/api/users/getParticipatingUsers/${rideID}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      if (response.data) {
        console.log('Participants Array:', response.data);
        setParticipants(response.data);
        setIsLoading(false);
      }
    };
    getParticipants();
  }, [rideID, user.token, isLoading]);

  const Item = ({name, avatar}) => (
    <View style={styles.ItemPadding}>
      <Chip
        avatar={
          avatar === '' ? (
            <Avatar.Image size={24} source={require('../images/biker.jpg')} />
          ) : (
            <Avatar.Image size={24} source={{uri: avatar}} />
          )
        }>
        {name}
      </Chip>
    </View>
  );
  const renderItem = ({item}) => <Item name={item.name} avatar={item.avatar} />;
  // if (isLoading) {
  //   return <Spinner />;
  // }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.text}>{rideName}</Text>

          <View style={styles.ListContainer}>
            {!isLoading && Participants.length > 0 ? (
              <FlatList
                data={Participants}
                renderItem={renderItem}
                keyExtractor={Participants.name}
              />
            ) : (
              <></>
            )}
          </View>

          <Button
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            color="#FF0035"
            mode="contained">
            Dismiss
          </Button>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  text: {textAlign: 'center', fontSize: 24, fontWeight: 'bold', flex: 0.15},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    paddingLeft: 70,
    paddingRight: 70,
    flex: 0.3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  ListContainer: {
    flex: 0.9,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  ItemPadding: {padding: 5},
});
export default ParticipantsModal;
