/*=========================
Type: Component

Description:
Allows user to insert group ride information (name,description,location,route coordinates)
Allows user to create group ride

=========================*/

// Hooks
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// Components
import {View, StyleSheet, ImageBackground} from 'react-native';
import {TextInput, Card, Title, HelperText, Button} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
// Custom Components
import MapWrite from './MapWrite';
// Functionalities
import {createGroupRide} from '../features/groupRides/groupRideSlice';
import axios from 'axios';
import {SERVER_IP} from '@env';
// =================================================================

// PROPS: navigation
const CreateGroupRideCard = ({navigation}) => {
  // Logic
  const [hasSubmit, setHasSubmit] = useState(false);
  const [visible, setVisible] = React.useState(false);
  // Redux
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {groupRides, isLoading, isSuccess} = useSelector(
    state => state.groupRide,
  );
  // Information
  const [rideName, setRideName] = useState('');
  const [rideDescription, setRideDescription] = useState('');
  const [location, setLocation] = React.useState(user.City);
  const [coordinates, setCoordinates] = React.useState([]);
  //Variables
  var nameHelpText = '';
  var descHelpText = '';
  var coordinatesHelpText = '';

  const CityArray = [
    {label: 'Beirut', value: 'Beirut'},
    {label: 'Tripoli', value: 'Tripoli'},
    {label: 'Sidon', value: 'Sidon'},
    {label: 'Tyre', value: 'Tyre'},
    {label: 'Jounieh', value: 'Jounieh'},
    {label: 'Byblos', value: 'Byblos'},
    {label: 'Aley', value: 'Aley'},
    {label: 'Nabatieh', value: 'Nabatieh'},
    {label: 'Baalbek', value: 'Baalbek'},
    {label: 'Zahle', value: 'Zahle'},
    {label: 'Zgharta-Ehden', value: 'Zgharta'},
    {label: 'Batroun', value: 'Batroun'},
  ];

  // =================================================================

  useEffect(() => {
    if (hasSubmit && isSuccess) {
      console.log('Group Ride Created');
      navigation.goBack();
    }
    // dispatch(reset());
  }, [isLoading, isSuccess, navigation, hasSubmit, dispatch]);

  // =================================================================

  const changeCoordinatesFromChildren = coor => {
    setCoordinates(coor);
  };

  // =================================================================
  const hasNameError = () => {
    for (let x = 0; x < groupRides.length; x++) {
      if (groupRides[x].rideName.toLowerCase() === rideName.toLowerCase()) {
        nameHelpText = 'A ride with such name already exits';
        return true;
      }
    }
    if (rideName === '') {
      nameHelpText = 'This field is required';
      return true;
    }
    return false;
  };

  // =================================================================

  const hasDescError = () => {
    if (rideDescription === '') {
      descHelpText = 'This field is required';
      return true;
    }
    return false;
  };

  // =================================================================

  const hasCoordinatesError = () => {
    if (coordinates.length === 0) {
      coordinatesHelpText = 'This field is required';
      return true;
    }
    return false;
  };

  // =================================================================
  const subscribeToCreatedRide = async () => {
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
      console.log(response.data);
      console.log('Subscribed to Created Ride');
    }
    return response.data;
  };
  // =================================================================
  const onSubmit = () => {
    const createdGroupRide = {
      rideName: rideName,
      rideDescription: rideDescription,
      rideLocation: location,
      routeCoordinates: coordinates,
      riderProfile: user.avatar,
    };
    dispatch(createGroupRide(createdGroupRide));
    subscribeToCreatedRide();
    setHasSubmit(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/create.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.cardView}>
          <Card style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
            <Card.Content>
              {/*================================================================= */}
              <Title style={styles.titleStyle}>Ride Name: </Title>

              <TextInput
                autoCorrect={false}
                style={styles.inputText}
                placeholder="Please Enter a Ride Name"
                clearButtonMode={'while-editing'}
                value={rideName}
                onChangeText={text => setRideName(text)}
                blurOnSubmit
                mode="outlined"
                activeOutlineColor="#5AFF15"
                error={hasNameError()}
              />
              <HelperText
                type="error"
                visible={hasNameError()}
                padding="normal"
                style={styles.text}>
                {nameHelpText}
              </HelperText>
            </Card.Content>
            {/*================================================================= */}
            <Card.Content>
              <Title style={styles.titleStyle}>Ride Description: </Title>

              <TextInput
                autoCorrect={false}
                style={styles.inputField}
                placeholder="Please Enter a Ride Description"
                clearButtonMode={'while-editing'}
                value={rideDescription}
                onChangeText={text => setRideDescription(text)}
                blurOnSubmit
                mode="outlined"
                error={hasDescError()}
                multiline={true}
                activeOutlineColor="#5AFF15"
              />
              <HelperText
                type="error"
                visible={hasDescError()}
                padding="normal"
                style={{fontSize: 12, lineHeight: 10, fontWeight: 'bold'}}>
                {descHelpText}
              </HelperText>
            </Card.Content>
            {/*================================================================= */}
            <Card.Content>
              <Title style={styles.titleStyle}>Ride Location: </Title>
              <DropDownPicker
                open={visible}
                value={location}
                items={CityArray}
                setOpen={setVisible}
                setValue={setLocation}
                style={styles.dropdownMenu}
                disableBorderRadius={true}
              />
            </Card.Content>
            {/*================================================================= */}
            {visible ? (
              <></>
            ) : (
              <>
                <Card.Content>
                  <Title style={styles.titleStyle}>Ride Route: </Title>
                  <MapWrite
                    cityName={location}
                    setParentCoordinates={changeCoordinatesFromChildren}
                  />

                  <HelperText
                    type="error"
                    visible={hasCoordinatesError()}
                    padding="normal"
                    style={styles.text}>
                    {coordinatesHelpText}
                  </HelperText>
                </Card.Content>

                <Card.Actions>
                  <View style={styles.actionButtons}>
                    <Button
                      onPress={() => navigation.goBack()}
                      labelStyle={{color: 'black'}}
                      mode="contained"
                      color="#FF0035">
                      Cancel
                    </Button>
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      onPress={() => onSubmit()}
                      disabled={
                        hasDescError() ||
                        hasNameError() ||
                        hasCoordinatesError()
                      }
                      mode="contained"
                      color="#5AFF15">
                      Create
                    </Button>
                  </View>
                </Card.Actions>
              </>
            )}
          </Card>
        </View>
      </ImageBackground>
    </View>
  );
};

//=================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    padding: 20,
  },
  image: {width: '100%', height: '100%', justifyContent: 'center'},
  actionButtons: {flex: 0.5, padding: 10},
  text: {
    fontSize: 12,
    lineHeight: 10,
    fontWeight: 'bold',
  },
  titleStyle: {
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  inputText: {
    fontSize: 13,
    padding: 10,
    height: 20,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  inputField: {
    fontSize: 13,
    padding: 1,
    height: 60,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    alignSelf: 'center',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
export default CreateGroupRideCard;
