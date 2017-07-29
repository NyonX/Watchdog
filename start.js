'use strict';
process.title = 'Watchdog';

/** @ignore */
const _ = require('lodash');
/** @ignore */
const Discordie = require('discordie');

global.app = require('./app');

app.logger.info(`Bootstraping Watchdog v${app.version}`);

app.logger.info(' - Loading configuration');

app.logger.info(' - Creating bot instance');
global.bot = new Discordie({
    autoReconnect: true
});

app.logger.info(` - Registering ${Object.keys(app.handlers).length} event handlers`);
bot.Dispatcher.onAny((type, socket) => {
    if (app.handlers.hasOwnProperty(type)) {
        return app.handlers[type].handle(socket);
    }
});

app.logger.info(` - Registered ${Object.keys(app.commands).length} commands`);

app.logger.info('Connecting to the Discord network...');
bot.connect({token: process.env.apiKey});
