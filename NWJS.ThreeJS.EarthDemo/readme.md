# NodeJS NWJS ThreeJS Earth Demo
You can run in the browser or the build.bat for the desktop app (I've only set the build script for windows x64).

# Requirements
To build your applications you will require nw-builder:
https://www.npmjs.com/package/nw-builder
```
npm i -g nw-builder
build.bat
```

# Development (browser)
Will use webpack 1.x for dev build and watch.
```
npm run watch
```

# Production (browser)
Will use webpack 1.x for concatination and minification.
```
npm run pack
```

# Build Win64 Application
Will use webpack 1.x for production build of app.min.js
```
npm run build
```