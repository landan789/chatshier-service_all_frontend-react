/*! wordfreq - Text corpus calculation in Javascript.
  Author: timdream <http://timc.idv.tw/>
*/

(function (global) {
    let WordFreq = function WordFreq(options) {
        // Public API object
        let wordfreq = {};

        // options: here, we only worry about workerUrl
        options = options || {};
        options.workerUrl = options.workerUrl || 'wordfreq.worker.js';

        // worker reference will be put here by init();
        let worker;

        // message queue
        // Note: since Javascript Web Workers itself is a single threaded
        // first-in-first-out event queue, the management here
        // (send the next message only till the current one is processed)
        // seems to be an overkill. This should be written if we are sure of
        // the behavior is reliable.
        let messageQueue = [];
        let message = null;

        // closed flag means the worker is terminated.
        let closed = false;

        // add message to queue; if there is no ongoing message,
        // start sending the message.
        let addQueue = function addQueue(msg) {
            messageQueue.push(msg);

            if (!message) sendMessage();
        };
        // send message to worker
        let sendMessage = function sendMessage() {
            message = messageQueue.shift();

            worker.postMessage({
                method: message.method,
                params: message.params
            });

            // Remove thing that is not needed anymore.
            delete message.method;
            delete message.params;
        };

        // process message received from worker
        let gotMessage = function gotMessage(evt) {
            // unset message reference first
            // so callback cannot be called twice in stop(),
            // and doing init() in the callback() will not result overwritting
            // message.
            let callback = message.callback;
            message = null;

            if (callback) callback.call(wordfreq, evt.data);
            // Set the message to null, since we have finished processing
            if (messageQueue.length) sendMessage();
        };

        let gotError = function gotError(evt) {
            // Detach callback with global message reference
            // so it cannot be called twice in stop()
            let callback = message.callback;
            delete message.callback;

            if (callback) callback.call(wordfreq, evt.data);
            // Set the message to null, since we have finished processing
            message = null;
            if (messageQueue.length) sendMessage();
        };

        let methods = ['process', 'empty', 'getList', 'getLength', 'getVolume'];
        methods.forEach(function buildAPI(method) {
            wordfreq[method] = function addMessage() {
                if (closed) return;

                let argLength = arguments.length;

                let callback;
                if ('function' === typeof arguments[arguments.length - 1]) {
                    callback = arguments[arguments.length - 1];
                    // exclude the callback from being put into params.
                    argLength--;
                }

                let params = [];
                let i = 0;
                while (i < argLength) {
                    params[i] = arguments[i];
                    i++;
                }

                addQueue({
                    method: method,
                    params: params,
                    callback: callback
                });

                return wordfreq;
            };
        });

        // uninit
        let uninit = function uninit() {
            // set closed flag
            closed = true;

            // terminate the worker
            worker.terminate();

            // unattach functions
            worker.onmessage = null;
            worker.onerror = null;
            worker = null;
        };

        // stop
        wordfreq.stop = function stop(triggerCallbacks) {
            if (closed) return;

            uninit();

            if (!triggerCallbacks) {
                message = null;
                messageQueue = [];

                return wordfreq;
            }

            // tell all pending callbacks that the work has stopped
            if (message && message.callback) message.callback.call(wordfreq);
            message = null;
            while (messageQueue.length) {
                let msg = messageQueue.shift();
                if (msg.callback) msg.callback.call(wordfreq);
            }

            return wordfreq;
        };

        // initialize the web workers
        let init = function init() {
            // start the worker
            worker = new Worker(options.workerUrl);

            // Attach the handlers
            worker.onmessage = gotMessage;
            worker.onerror = gotError;

            // init the worker with option data
            addQueue({
                method: 'init',
                params: [options]
            });
        };

        // all set, initialize!
        init();

        return wordfreq;
    };

    WordFreq.isSupported = !!(global.Worker &&
        Array.prototype.push &&
        Array.prototype.indexOf &&
        Array.prototype.forEach &&
        Array.isArray &&
        Object.create);

    // Expose the library as an AMD module
    if ('function' === typeof window.define && window.define.amd) {
        window.define('wordfreq', [], function() { return WordFreq; });
    } else {
        global.WordFreq = WordFreq;
    }
})(this);
