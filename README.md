Walking Dog
====
- TravisCI : TODO
- Codacy : [![Codacy Badge](https://api.codacy.com/project/badge/Grade/2949f2df09a142998b7d9a407d213142)](https://www.codacy.com/app/pao-esco/walkingdog-mobile?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Hubesco/walkingdog-mobile&amp;utm_campaign=Badge_Grade)
- Codecov : [![codecov](https://codecov.io/gh/Hubesco/walkingdog-mobile/branch/master/graph/badge.svg)](https://codecov.io/gh/Hubesco/walkingdog-mobile)

## Contribute

### Installation

- Install nodejs
- `npm install -g ionic`
- `npm install -g cordova`
- `git clone https://github.com/paoesco/walkingdog.git`
- `cd walkingdog`
- `git config user.name "xxx"`
- `git config user.email "xxx@xxx.com"`
- `cd walkingdog-mobile`
- `npm install`


#### Android platform


- `ionic platform add android` (inside walkingdog-mobile folder)
- Install Java 8 (JDK)
- Add JAVA_HOME variable (path/to/jdk)
- Add $JAVA_HOME/bin to $PATH
- Install Android Studio (SDK and AVD)
- Add ANDROID_HOME variable (path/to/sdk)
- Add $ANDROID_HOME/tools to $PATH
- Add $ANDROID_HOME/platform-tools to $PATH
- Install from SDK API 19 (SDK Platform, Google APIs Intel X86 Atom System Image, Sources for Android SDK)
- Install Intel HAXM (if not installed by Android Studio or Android SDK)

#### iOS platform

- Install Xcode
- `xcode-select --install` (after Xcode installation finished)
- `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
- `npm install -g ios-sim`
- `sudo npm install -g ios-deploy --unsafe-perm=true --allow-root`
- `ionic platform add ios` (inside walkingdog-mobile folder)


### Build

- `ionic serve`
- for prod mode : `` (https://github.com/driftyco/ionic-app-scripts/blob/master/CHANGELOG.md#entry-point-changes)

#### Android

- `ionic build android`
- `ionic emulate android` (needs AVD up and running)
- For prod mode, add prod param : `ionic run android --prod`

#### iOS

// TBC
