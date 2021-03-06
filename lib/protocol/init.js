/**
 *
 * Create a new session. The server should attempt to create a session that most
 * closely matches the desired and required capabilities. Required capabilities
 * have higher priority than desired capabilities and must be set for the session
 * to be created.
 *
 * @param {Object} capabilities An object describing the session's [desired capabilities](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Desired_Capabilities).
 * @callbackParameter error, response
 *
 * @see  https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session
 * @type protocol
 *
 */

var ErrorHandler = require('../utils/ErrorHandler.js'),
    packageDotJson = require('../../package.json');

module.exports = function init (desiredCapabilities) {
    var merge = require('deepmerge'),
        callback = arguments[arguments.length - 1],
        commandOptions = {
            path: '/session',
            method: 'POST'
        };

    /*!
     * check if session was already established
     */
    if (this.requestHandler.sessionID) {
        return callback(new ErrorHandler.ProtocolError('Cannot init a new session, please end your current session first'));
    }

    if (typeof desiredCapabilities == 'function') {
        desiredCapabilities = null;
    } else {
        this.desiredCapabilities = merge(this.desiredCapabilities, desiredCapabilities);
        if (desiredCapabilities.sessionId) {
            this.sessionId = desiredCapabilities.sessionId;
        }
    }

    /**
     * report library identity to server
     * @see https://groups.google.com/forum/#!topic/selenium-developers/Zj1ikTz632o
     */
    this.desiredCapabilities = merge(this.desiredCapabilities, {
        requestOrigins: {
            url: packageDotJson.homepage,
            version: packageDotJson.version,
            name: packageDotJson.name
        }
    });

    this.requestHandler.create(
        commandOptions,
        {desiredCapabilities:this.desiredCapabilities},
        callback
    );

};