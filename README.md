# anguloop idea/poc of loopback 4 angular

***Searching for contributors*** 
Contact me: Skype: psitrax ; IRC: Psi|4ward@freenode ; wio[at]psitrax.de


* RESTapi accessable through Websockets [express-websocket](https://github.com/psi-4ward/express-websocket) 
* Requesting a list-endpoint (`/api/users`) via socket results in an update subscription
* Broadcast model changes to all subscribeders (like [SailsJS](http://sailsjs.org/#/documentation/reference/websockets/resourceful-pubsub))
* [$http](https://docs.angularjs.org/api/ng/service/$http) compatible [$httpSock](https://github.com/psi-4ward/anguloop-example/blob/master/packages/socket-test/angular/services/httpSock.js) angular service
* [ApiLoop](https://github.com/psi-4ward/anguloop-example/blob/master/packages/socket-test/angular/services/ApiLoop/ApiLoop) angular service as Model-Layer

* [JsonSchema](http://json-schema.org/) support for [angular-schema-form](https://github.com/Textalk/angular-schema-form) and validation 
* (npm-installable) Packages support containing Loopback and Angular code (like [MeanJS](http://learn.mean.io/#m-e-a-n-stack-packages-files-structure))
* Gulp based build system [Gulpsi](https://github.com/psi-4ward/gulpsi)
* generator to scaffold new apps (todo)

### Install and usage
You need [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) and [Bower](http://bower.io/#install-bower)
```
npm install psi-4ward/anguloop-example
npm start
```


### Todo
* Refactor [modelChange2socket.js](https://github.com/psi-4ward/anguloop-example/blob/master/packages/socket-test/loopback/boot/modelChange2socket.js)
* anguloop model/collection service

### RESTapi accessable through Websockets
[express-websocket](https://github.com/psi-4ward/express-websocket) pushes socket *json-web-requests* into the express routing

* every express route is also a socket route
* go through all middlewares so we dont bypass anything


### Model update boradcasts

See 
[modelChange2socket.js](https://github.com/psi-4ward/anguloop-example/blob/master/packages/socket-test/loopback/boot/modelChange2socket.js)
for an draft

### Packages

* [loopback-packageloader](https://github.com/psi-4ward/loopback-packageloader) loads loopback with model/configs aggregated from all package directories
* [Gulpsi](https://github.com/psi-4ward/loopback-packageloader) build the angular and aggregate bower deps from all package directories

suggested (but configurable) filestructure
```
├── packages
│   └── my-package
│       ├── angular
│       │   ├── templates
│       │   ├── providers
│       │   ├── controllers
│       │   ├── directives
│       │   ├── config.js
│       │   ├── routes.js
│       │   └── run.js
│       ├── assets
│       ├── less
│       ├── loopback
│       │   ├── boot
│       │   ├── models
│       │   ├── datasources.json
│       │   ├── middleware.json
│       │   └── model-config.json
│       ├── gulpsi.json
│       ├── package.json
│       └── README.md
├── public
├── config.json
├── package.json
└── server.js
```

Or split into angular and loopback packages? Whats your opinion?

### npm-installed Packages

* gulpsi findes it by searching for `gulpsi.json`
* loopback-packageloader inspects `package.json` and searches for `anguloopModule: true` key

### JsonSchema endpoint and validation

Define a JsonSchem in your `Model.json` using the `jsonSchema` property. You could also mark this
schema as **strict** using `strictJsonSchema: true`. A strict schema does not allow additional 
properties.

The Schema gets exposed via `_meta` endpoint for each Model. The fronend can request the Schema 
and hand it over to angular-schema-form.