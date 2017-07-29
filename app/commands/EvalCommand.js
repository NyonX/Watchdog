/** @ignore */
const util = require('util');
/** @ignore */
const _ = require('lodash');
/** @ignore */
const Command = require('./../Command');

class EvalCommand extends Command {

    /**
     * Sets up the command by providing the prefix, command trigger, any
     * aliases the command might have and additional options that
     * might be usfull for the abstract command class.
     */
    constructor() {
        super('-', 'e');
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
        message.edit('**Input:**\n```javascript\n' + args.join(' ') + '```');

        let evalString = args.join(' ');
        let evalArray = evalString.split('\n');

        if (_.startsWith(evalArray[0], '```') && _.startsWith(evalArray[evalArray.length - 1], '```')) {
            delete evalArray[0];
            delete evalArray[evalArray.length - 1];
        }

        evalString = evalArray.join('\n');

        try {
            let evalObject = eval(evalString);
            if (evalObject !== undefined && evalObject !== null && typeof evalObject.then === 'function') {
                evalObject.then(() => {
                    return this.sendEvalMessage(message, this.inspect(evalObject));
                }).catch(err => this.sendEvalMessage(message, this.inspect(err)));
            }
            return this.sendEvalMessage(message, this.inspect(evalObject));
        } catch (err) {
            return this.sendEvalMessage(message, this.inspect(err));
        }
    }

    /**
     * Sends the eval result using the given IMessage object.
     *
     * @param  {IMessage}  message  The Discordie message object to send the result to.
     * @param  {String}    result   The result of the code eval.
     * @return {Promise}
     */
    sendEvalMessage(message, result) {
        return message.channel.sendMessage('**Output:**\n' + result);
    }

    /**
     * Inspects and formats the given message.
     *
     * @param  {mixed}  message  The message object that should be inspected.
     * @return {String}
     */
    inspect(message) {
        message = util.inspect(message, {depth: 1});
        message = this.hideElemenets(message);

        if (message.length > 1890) {
            message = message.substr(0, 1890).trim() + '...';
        }

        return '```xl\n' + message + '```';
    }

    /**
     * Hides sensitive elements from the given message.
     *
     * @param  {String}  message  The message that should have elements hidden.
     * @return {String}
     */
    hideElemenets(message) {
        message = message.replace(new RegExp(process.env.apiKey, 'gim'), '----- BOT TOKEN IS HIDDEN -----');

        return message;
    }
}

module.exports = EvalCommand;
