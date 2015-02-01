global['gulp'] = require('gulp');
var $config = require('gulpsi');

$config.localPackages = ['packages/*'];
$config.pathNormalization = [
  [/^packages\//, ''],
  [/^node_modules\//, ''],
  [/\/angular(?![^/])/, ''],
  [/^bower_components\//, '']
];

$config.libs = ['packages/anguloop/primus.js'];

$config.watcherRebuildInterval = 5000;