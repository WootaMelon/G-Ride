# G-Ride
 Graduate Project done using React-Native

***************************
Note:
Steps on how to configure the application are included below.  
******************************

******************************
==================================
How to setup react native application
==================================
To setup the react native application, follow the following documentation:
https://reactnative.dev/docs/environment-setup
After the application is running, simply copy the data from the MotoApp folder to the react native application folder.
The ios file contains the storyboard and icon for the application, in the case of building on an ios device.
******************************

******************************
========================
How to configure the map
========================
The application uses the Google Maps API for android and ios
The application needs to be configured depending on the platform being used as per the following:
https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md
An api key must be requested from https://console.cloud.google.com/ and used to the above steps.
******************************

******************************
=================================
IMPORTANT: How to configure the env variables
=================================
the .env variable found in the main folder directory contains environmental variables for the backend
make sure to use your own cloudinary key and secret so that file uploads work
.env variable found inside the motoapp folder corresponds to the server ip hosting the backend (localhost if you will run app on the same machine or pass the host IP if running on physical device)
In addition, the following should be present in the babel.config.js when the react native application is built:
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  "plugins": [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ]
};

******************************

******************************
=======================
Installing Dependencies
=======================
The package.json for the backend and the react-native app are included
In order to install the project dependencies, run npm install from the parent directory and in the react native app to install all required dependencies needed for the project.
if running an ios application, make sure to run pod install inside the initialized project's ios folder. 
******************************

******************************
==================
How to run backend
==================
Navigate to the backend folder and run the following command:
node server.js or npm run server
******************************

