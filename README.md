ConsoleLogger
=============

A small JavaScript file to provide a global error catcher as well as to expand the console.* functions to provide
* Console supression based on log level
* Server side logging with stack traces

I wrote this file to capture, suppreess and reroute existing console.* messages and uncaught error's that occure in production. 

This approach allows us to implement the normal JavaScript work flow when error handling and logging to console, reducing learning curve for new developers as well as integrating seamlessly with existing libraries.

---

This solution is intended to be modified to leverage a more fully fledged logging library.

## Installation

This script has no dependancies and should be included as high up as possible in the load order to catch any errors that may occur.

## Configuration

Log levels will need to be specified from your configuration files. Variables can be found at the top of the file.

### Client Side Log Level

This will determine whether errors and console.* mesages are displayed in the console. 

```JavaScript
var clientLogLevel = 5, // Set from config
```

### Server Side Log Level

This will determine whether errors and console.* mesages are sent to the server. 

``` JavaScript
serverLogLevel = 0, // Set from config
```

### Configuration paramaters

* 1 - will display only error messages
* 2 - will display error and warn messages
* 3 - Will display error, warn, info messages
* 4 - Will display error, warn, info, debug messages
* 5 - Will display error, warn, info debug, log messages

## Enabling server side logging

Any server side loggin can be added into the logError method wich has access to the full error object. This is also a useful place to add any additionaly device data that may be needed for debugging. 

If this method returns true any uncaught exceptions from the window object will be supressed.

```JavaScript
function logError(errObj) {
  // Log message to server
  if (serverLogLevel >= level[errObj.type]) {
    
  }

  // Suppress Errors
  return true;
}
```

## Colour formatting

This library implements a rudermentary colour formatter to display colour formatting on console messages. This can be done by passing in a colour name as the second console.* paramater. 

Eg:
```
console.warn('You have been warned', 'red');
```

These colour paramaters can be expanded and customized in the formatColours method. Simply add additional colour names as follows. (Colours can be specified as hex values.)

```JavaScript
function formatColours(curArguments) {
    if (curArguments[1]) {
      curArguments[0] = '%c' + curArguments[0];
      if (curArguments[1] === 'green') {
        curArguments[1] = 'color: green;';
      } else if (curArguments[1] === 'orange') {
        curArguments[1] = 'color: orange;';
      } else if (curArguments[1] === 'blue') {
        curArguments[1] = 'color: blue;';
      } else if (curArguments[1] === 'red') {
        curArguments[1] = 'color: red;';
      } else if (curArguments[1] === 'MistyRose ') {
        curArguments[1] = 'color: #FFE4E1;';
      }
    }
    return curArguments;
  }
```
