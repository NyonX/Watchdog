/** @ignore */
const _ = require('lodash');

/**
 * The abstract command class, this class works as a simple wrapper for bot
 * commands, allowing commands to register simple things like prefixes,
 * triggers, aliases, middleware and more, and have it be accessable
 * throughout the application simply and universally.
 *
 * @abstract
 */
class Command {

    /**
     * Sets up the command by taking in the prefix, command trigger, any
     * aliases the command might have and additional options that
     * might be usfull for the command.
     *
     * @param  {String}  prefix   The command prefix.
     * @param  {String}  command  The main command trigger.
     * @param  {Array}   aliases  Any additional command triggers.
     * @param  {Object}  options  The command options.
     */
    constructor(prefix, command, aliases, options) {
        if (typeof command === 'undefined' || typeof prefix === 'undefined') {
            throw new TypeError('The command parameter can not be undefined!');
        }

        if (typeof options === 'undefined') {
            options = {};
        }

        /**
         * The command options property, anything related
         * to the command will be stored in this object.
         *
         * @type {Object}
         */
        this.options = options;
        this.options.prefix = prefix;
        this.options.command = command;
        let triggers = [command];

        if (typeof aliases !== 'undefined') {
            _.each(aliases, trigger => {
                triggers.push(trigger);
            });
        }
        this.options.triggers = triggers;
    }

    /**
     * Gets the command with the prefix for the given guild and the main command trigger.
     *
     * @return {String}
     */
    getCommandTrigger() {
        return this.getPrefix() + this.getTriggers()[0];
    }

    /**
     * Gets the command prefix.
     *
     * @return {String}
     */
    getPrefix() {
        return this.getOptions('prefix');
    }

    /**
     * Gets the command triggers.
     *
     * @return {Array}
     */
    getTriggers() {
        return this.getOptions('triggers', []);
    }

    /**
     * Gets the command description.
     *
     * @return {Array|String}
     */
    getDescription() {
        return this.getOptions('description', 'This command doesn\'t have a description yet...');
    }

    /**
     * Get the command usage.
     *
     * @return {Array|String}
     */
    getUsage() {
        return this.getOptions('usage', '');
    }

    /**
     * Gets the option with the given property name, if it doesn't
     * exists the fallback value will be returned instead.
     *
     * @param  {String}  property  The name of the property that should be fetched.
     * @param  {mixed}   fallback  The fallback value if the property doesn't exists.
     * @return {mixed}
     */
    getOptions(property, fallback) {
        if (typeof property === 'undefined') {
            return this.options;
        }

        let items = property.split('.');
        let option = this.options;
        for (let index in items) {
            let item = items[index];

            if (!option.hasOwnProperty(item)) {
                return fallback;
            }

            option = option[item];
        }

        return option;
    }

    /**
     * Executes the given command.
     *
     * @param  {IUser}     sender   The Discordie user object that ran the command.
     * @param  {IMessage}  message  The Discordie message object that triggered the command.
     * @param  {Array}     args     The arguments that was parsed to the command.
     * @return {mixed}
     */
    onCommand(sender, message, args) {
        return message.reply('This command has not yet implemented command handling functionality!');
    }
}

module.exports = Command;
