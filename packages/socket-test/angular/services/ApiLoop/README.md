# ApiLoop

* do we need a collection registry ?
* more hooks / events ?
* how to add business logic into models / collections ?


## Provider

* Config
* * `$http`-like interface
* * eventListener
* * `urlPrefix`

* API
* * Wrap all `$http` methods (get, post, put ...)
* * `createService([config])` create a new ApiLoop instance with custom config
* * `collection(name, [filter], [config])` create a collection instance
* * ??? `model()` ???


## Collection

* Api
* * `models` array with models
* * `find(what)` 
* * `findById(id)`
* * `findOrCreate(id)`
* * `add(Model)`
* * `remove(Model)`
* * `removeById(id)`
* * `createModel(data)`
* * `fetch()`
* * `collection(name, [filter, config])` retrieve a subcollection
* * all `$http` methods (get, post, put ...)


## Model
* Api
* * `Model(name, data, config)`
* * `save()`
* * `destroy()`
* * `updateData(data)`
* * `toJSON()`
* * `getCollection()`
* * `collection(name, [filter, config])` retrieve a subcollection
* * all `$http` methods (get, post, put ...)
