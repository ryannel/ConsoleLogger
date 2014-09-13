/**
 * Logger
 *
 * This logger attaches additional required functionality to the existing window.console.* functions.
 * These functions are altered to allow for console level message supression and server side logging with
 * full stack traces.
 *
 * @author Ryan Nel
 * @date 2014-08-25
 */
(function(window) {
  'use strict';

  var clientLogLevel = 5, // Set from config
    serverLogLevel = 0, // Set from config

    // Cache original console functions
    defaults = {
      log: console.log,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error
    },

    // Set log level thresh holds
    level = {
      log: 5,
      debug: 4,
      info: 3,
      warn: 2,
      error: 1
    };

  /**
   * @name initErrorListener
   * @description
   * Creates the listener for any uncaught errors.
   * The error catcher will capture all errors that bubble up to the window, logs them to the
   * console and server if appropriate.
   * When returning true will suppress all errors.
   * 
   * Please note that some browsers have yet to implement the new spec and 
   * will not provide an error object as a paramater.
   */
  function initErrorListener() {
    window.onerror = function(message, url, lineNumber, columnNumber, errObj) {
      var error = errObj;
      // If the error object does not exist create one.
      if (!error) {
        error = new Error();
        error.message = message;
        error.lineNumber = lineNumber;
      }

      // Log uncaught errors to screen if log level is correct
      if (!error.type && error.message) {
        defaults.error.apply(console, error.message);
        error.type = 'error';
      }

      // Log Message to the Server
      return logError(error);
    };
  }

  /**
   * @name logError
   * @param errObj
   * @returns {boolean}
   * @description
   * Populates the error object with support data and sends to the server if the log level requirement is met.
   * Returns a boolean which if false will suppress errors.
   */
  function logError(errObj) {
    // Log message to server
    if (serverLogLevel >= level[errObj.type]) {
      
    }

    // Suppress Errors
    return true;
  }

  /**
   * @name generateError
   * @param type the type of error to be sent to the server in JL
   * @param message the message to be sent to the server in JL
   * @throws Error
   * @description
   * Creates an error object with a message and type attribute in order to generate a full stack trace 
   * for every message being sent to the server.
   */
  function generateError(type, message) {
    var error = new Error();
    error.message = message;
    error.type = type;
    return logError(error);
  }

  /**
   * @name formatColours
   * @param curArguments
   * @returns {*}
   * @description
   * If the message contains a colour parameter, format it correctly to apply the colour in the console.
   */
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
      }
    }
    return curArguments;
  }

  /**
   * @name overridePrototypes
   * @description
   * Override all console functions to call the standard functionality if the log level allows,
   * then to log to the server if appropriate.
   */
  function overridePrototypes() {
    console.debug = overRide('debug');
    console.log = overRide('log');
    console.info = overRide('info');
    console.warn = overRide('warn');
    console.error = overRide('error');
  }

  /**
   * @name overRide
   * @param type the error message type
   * @returns {Function}
   * @description
   * Returns the appropriate override function based on the type passed in.
   */
  function overRide(type) {
    return (function(message) {
      if (clientLogLevel >= level[type]) {
        var curArguments = formatColours(arguments);
        defaults[type].apply(console, curArguments);
      }
      generateError(type, message);
    });
  }

  /**
   * @name init
   * @description
   * Starts up the logger
   */
  (function init() {
    initErrorListener();
    overridePrototypes();
  })();
