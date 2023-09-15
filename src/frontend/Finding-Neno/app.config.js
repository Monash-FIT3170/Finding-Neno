module.exports = () => {
  let config = {
    "expo": {
      "name": "Finding-Neno",
      "slug": "finding-neno",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.josiahschuller.findingneno"
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
        "config": {
          "googleMaps": {
            "apiKey": process.env.GOOGLE_MAPS_API_KEY
          }
        },
        "package": "com.josiahschuller.findingneno"
      },
      "web": {
        "favicon": "./assets/favicon.png"
      },
      "runtimeVersion": {
        "policy": "sdkVersion"
      }
    } 
  }

  if (process.env.EXPO_ENVIRONMENT === "build") {
    config.extra = {
      "eas": {
        "projectId": "6b02a04a-94c0-4b03-baee-2a3b9739dc63"
      }
    };
    config.owner = "josiahschuller";
    config.updates = {
      "url": "https://u.expo.dev/6b02a04a-94c0-4b03-baee-2a3b9739dc63"
    };
  }

  return config;
}