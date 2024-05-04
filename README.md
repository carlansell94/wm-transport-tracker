# WM Transport Tracker

<p align="center">
  <img height="100" src="screenshots/icon.png?raw=true">
</p>

A transport tracking application for the West Midlands, using React Native and the Transport for West Midlands (TfWM) API.

This app serves as a demonstration of how to create a simple React Native application, as well as showing how to use some of the calls available in the TfWM API.

## Features

* Search for routes
* View live route tracking information
* Check nearby stops and departures
* View route alerts and updates
* See details of companies operating in the West Midlands
* Save a list of your favourite routes
* Both light and dark themes are available (defaults to your system preference)

Operator details are bundled with the application, and can be found in ```src/storage/data.json```.

Application storage is implemented using MMKV.

## Requirements

Before you can use this application, you will need to generate API keys for the [TfWM API](https://api-portal.tfwm.org.uk). These keys should be added to the file ```src/api/auth.js```.

In addition, mapping functionality requires a Google Maps API key. For Android, the key should be added to ```android/app/src/main/AndroidManifest.xml```. Add the key to the currently empty ```android:value``` parameter.

This app is configured to use the new React Native architecture, and requires React Native 0.74 or above. For older versions, check out commits prior to the 0.74 updates.

## How To Use

Once the requirements are fulfilled, the application can be executed in debug mode like any other React Native application.

To build an Android release version, run

```cd android && ./gradlew assembleRelease```

Note that this application has only been tested on Android. While it should function correctly on iOS, this has not been tested. If you want to build the app for iOS, you're on your own.

Unfortunately, due to requiring API keys it is not possible to provide pre-built packages. I might look into adding prompts to add TfWM keys in-app in the future, though this is not possible to do with the Google Maps key.

## Future Work

I plan to switch this app over to TypeScript at some point, and possibly look to make use of further endpoints the TfWM API has to offer.

There are also currently a few minor bugs (mostly related to navigation flow) due to the app originally having a slightly different set of features.

## Screenshots

Route viewer (showing light and dark themes):

![Route viewer](screenshots/route.webp?raw=true "Route viewer")

Route and stop timing viewers:

![Timing viewer](screenshots/timing.webp?raw=true "Timing viewer")
