/*=========================
Type: Component

Description:
Helper component for writing map data set by user

=========================*/

import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Modal} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps';

const MapWrite = ({cityName, setParentCoordinates}) => {
  const cityCoordinates = {
    Beirut: {
      latitude: 33.8938,
      longitude: 35.5018,
    },
    Tripoli: {
      latitude: 34.4346,
      longitude: 35.8362,
    },
    Sidon: {
      latitude: 33.5571,
      longitude: 35.3729,
    },
    Tyre: {
      latitude: 33.2705,
      longitude: 35.2038,
    },
    Jounieh: {
      latitude: 33.9843,
      longitude: 35.6344,
    },
    Byblos: {
      latitude: 34.123,
      longitude: 35.6519,
    },
    Aley: {
      latitude: 33.8069,
      longitude: 35.6024,
    },
    Nabatieh: {
      latitude: 33.3772,
      longitude: 35.4836,
    },
    Baalbek: {
      latitude: 34.0047,
      longitude: 36.211,
    },
    Zahle: {
      latitude: 33.8463,
      longitude: 35.902,
    },
    Zgharta: {
      latitude: 34.289,
      longitude: 35.9782,
    },
    Batroun: {
      latitude: 34.2498,
      longitude: 35.6643,
    },
  };

  const [coordinates, setCoordinates] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const renderMarkers = () => {
    return coordinates.map((coordinate, i) => {
      if (i === 0) {
        return <Marker key={i} coordinate={coordinate} pinColor="green" />;
      } else {
        return <Marker key={i} coordinate={coordinate} />;
      }
    });
  };

  return (
    <View style={styles.body}>
      <Button
        labelStyle={{color: '#5AFF15'}}
        style={{width: 100, alignSelf: 'center'}}
        mode="text"
        color="#5AFF15"
        onPress={() => setShowModal(true)}>
        Show
      </Button>

      <Modal visible={showModal} animationType={'fade'} transparent={true}>
        <View style={styles.modalContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            toolbarEnabled={false}
            zoomTapEnabled={false}
            style={styles.map}
            initialRegion={{
              latitude: cityCoordinates[cityName].latitude,
              longitude: cityCoordinates[cityName].longitude,
              latitudeDelta: 0.06,
              longitudeDelta: 0.01,
            }}
            onPress={e => {
              const clickedLocation = e.nativeEvent.coordinate;
              setCoordinates(prevLocations => {
                return [...prevLocations, clickedLocation];
              });
              setParentCoordinates(coordinates);
            }}>
            {renderMarkers()}
            <Polyline
              coordinates={coordinates}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={['#7F0000']}
              strokeWidth={6}
            />
          </MapView>
          <View style={styles.flexContainer}>
            <TouchableOpacity
              onPress={() => {
                setCoordinates(prevLocations => {
                  return prevLocations.filter(
                    loc =>
                      prevLocations.indexOf(loc) !== prevLocations.length - 1,
                  );
                });
                setParentCoordinates(coordinates);
              }}>
              <Icon size={16} color="red" name="undo" />
            </TouchableOpacity>

            <Button
              labelStyle={{color: 'black'}}
              style={{width: 75}}
              mode="contained"
              color="#5AFF15"
              onPress={() => {
                setParentCoordinates(coordinates);
              }}>
              Save
            </Button>
          </View>

          <Button
            labelStyle={{color: 'black'}}
            mode="contained"
            color="#FF0035"
            onPress={() => setShowModal(false)}>
            Hide
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexContainer: {
    width: 350,
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  map: {
    alignSelf: 'center',
    width: 500,
    height: 500,
  },
});

export default MapWrite;
