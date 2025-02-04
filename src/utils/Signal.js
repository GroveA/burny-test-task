export default class Signal {
    constructor() {
        this.paused = false;
        this.listeners = [];
    }

    add(cb, context) {
        this.listeners.push({
            data: {
                cb,
                context
            },
            signalCallback: function () {
                cb.call(context, ...[].slice.call(arguments));
            }
        });
    }

    addOnce(cb, context) {
        this.listeners.push({
            data: {
                cb,
                context
            },
            signalCallback: function () {
                cb.call(context, ...[].slice.call(arguments));
                this.remove(cb, context);
            }
        });
    }

    remove(cb, context) {
        const { listeners } = this;

        let listener = null;

        if (context) {
            listener = listeners.filter(
                (listener) => listener.data.cb === cb && listener.data.context === context
            )[0];
        } else {
            listener = listeners.filter((listener) => listener.data.cb === cb)[0];
        }
        const index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    removeAll() {
        this.listeners.length = 0;
    }

    dispatch(...args) {
        if (this.paused) {
            return;
        }
        this.listeners.slice().forEach((listener) => {
            listener.signalCallback.call(this, ...args);
        });
    }
}
