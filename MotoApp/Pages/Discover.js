/*=========================
Type: Page

Description:
The middle tab of the tab navigator, it includes all created rides
and the ability to create as well as search for rides.

Users Can View Participants to a specific ride.

In addition, users can subscribe and unsubscribe to/from rides.
Users who created rides can also edit and delete their created rides from its corresponding card
=========================*/

import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {Appbar, Text, FAB, Searchbar} from 'react-native-paper';
import GroupRideCard from '../components/GroupRideCard';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from '../components/Spinner';
import {getGroupRides, reset} from '../features/groupRides/groupRideSlice';

const Discover = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [scrollState, setScrollState] = useState(0);

  const [searchData, setSearchData] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const {groupRides, isLoading, isError, message} = useSelector(
    state => state.groupRide,
  );
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const renderItem = ({item}) => (
    <GroupRideCard
      rideName={item.rideName}
      riderCreator={item.riderCreator}
      riderProfile={item.riderProfile}
      rideDescription={item.rideDescription}
      rideLocation={item.rideLocation}
      rideCoordinates={item.routeCoordinates}
      rideID={item._id}
      removeCard={false}
      navigateToEdit={navigateToEditFromCard}
      hideDeletedCard={true}
    />
  );

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
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }

    dispatch(getGroupRides());
    dispatch(reset());
  }, [user, navigation, isError, message, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      dispatch(getGroupRides());
      setRefreshing(false);
    });
  }, [dispatch]);
  const flatList = useRef();

  const moveToTop = () => flatList.current.scrollToIndex({index: 0});
  const onScroll = event => {
    setScrollState(event.nativeEvent.contentOffset.y);
    return event.nativeEvent.contentOffset.y;
  };
  const showButton = () => {
    if (scrollState === 0 || scrollState < 0) {
      return false;
    }
    return true;
  };
  const updateSearch = text => {
    setSearchData([]);
    const newData = groupRides.filter(item => {
      const itemData = item.rideName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchData(newData);
    setSearch(text);
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#1E1F21'}}>
      <Appbar.Header style={{backgroundColor: '#010B12'}}>
        {showSearchBar ? (
          <Searchbar
            placeholder="Search"
            style={{flex: 1}}
            onChangeText={text => updateSearch(text)}
            value={search}
            clearButtonMode="while-editing"
          />
        ) : (
          <Appbar.Content
            title="Group Rides"
            subtitle="Check out existing rides or create your own"
          />
        )}

        <Appbar.Action
          icon="magnify"
          onPress={() => {
            setShowSearchBar(!showSearchBar);
            setSearchData(null);
            setSearch('');
          }}
          color="#39FF13"
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate('CreateGroupRideCard');
          }}
          color="#39FF13"
        />
      </Appbar.Header>
      {groupRides.length > 0 || !isLoading ? (
        <FlatList
          ref={flatList}
          data={searchData === null ? groupRides : searchData}
          renderItem={renderItem}
          keyExtractor={groupRides._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={onScroll}
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
      {showButton() && groupRides.length > 0 ? (
        <FAB
          onPress={moveToTop}
          label="To Top"
          icon="arrow-up"
          style={{
            position: 'absolute',
            top: 110,
            alignSelf: 'center',
            backgroundColor: '#39FF13',
          }}
        />
      ) : (
        <></>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignContent: 'center'},
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  inputText: {
    fontSize: 13,
    padding: 10,
    height: 20,
    backgroundColor: 'white',
  },
});
export default Discover;
