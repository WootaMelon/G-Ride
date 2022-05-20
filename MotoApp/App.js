import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {store} from './app/store';
import {Provider} from 'react-redux';

import SplashScreen from './components/SplashScreen';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
