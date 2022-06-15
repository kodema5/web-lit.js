// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

let processBody = (data, type)=>{
    switch(type){
        case "any":
            return data;
        case "text":
            return data ? data.toString() : data;
        case "json":
            return JSON.stringify(data);
    }
    throw new Error('unknown request data type');
};
let processResponse = (res, type)=>{
    switch(type){
        case 'arrayBuffer':
            return res.arrayBuffer();
        case 'blob':
            return res.blob();
        case 'formData':
            return res.formData();
        case 'json':
            return res.json();
        case 'text':
            return res.text();
    }
    throw new Error('unknown response type');
};
function ajax({ url , data , input =(a)=>a , output =(a)=>a , headers ={} , body: body1 , method ='POST' , timeout =0 , requestType ='json' , responseType ='json' ,  } = {}) {
    if (!url) throw new Error('url required');
    url = url.indexOf('http') < 0 && ajax.base_href ? ajax.base_href + url : url;
    data = input(data);
    let opt = {
        method,
        headers: {
            ...ajax.headers || {},
            ...headers
        }
    };
    let hasBody = !(method === 'GET' || method === 'HEAD');
    if (hasBody) {
        opt.body = body1 || processBody(data, requestType);
    }
    let Abort = new AbortController();
    opt.signal = Abort.signal;
    let p = new Promise(async (ok, err)=>{
        let tId;
        if (timeout) {
            tId = setTimeout(()=>{
                Abort.abort();
            }, timeout);
        }
        opt.signal.onabort = ()=>{
            err(new Error('aborted'));
        };
        try {
            let res = await fetch(url, opt);
            if (tId) clearTimeout(tId);
            if (!res.ok) {
                await res.body.cancel();
                throw {
                    [res.status]: res.statusText
                };
            }
            let body = await processResponse(res, responseType);
            ok(await output(body));
        } catch (e) {
            err(e);
        }
    });
    p.abort = ()=>Abort.abort();
    return p;
}
ajax.base_href = '';
ajax.headers = {
    'Content-Type': 'application/json'
};
const isObject = (a)=>a !== null && a instanceof Object && a.constructor === Object;
const ajaxFn = (cfg)=>async (data)=>{
        let a = await ajax({
            ...cfg,
            data: {
                ...cfg.data || {},
                ...data
            }
        });
        if (isObject(a)) {
            let { data: d , errors  } = a;
            if (Boolean(d) ^ Boolean(errors)) {
                if (errors) throw errors;
                return d;
            }
        }
        return a;
    };
const mod = {
    ajax,
    ajaxFn
};
class PubSub {
    constructor({ broadcastChannelId  }){
        var me = this;
        me._id = 0;
        me.channels = {};
        if (broadcastChannelId) {
            let bc = new BroadcastChannel(broadcastChannelId);
            bc.onmessage = (ev)=>{
                let { channel , args  } = ev.data;
                me.publish_.apply(me, [
                    channel
                ].concat(args));
            };
            me.broadcastChannel = bc;
        }
    }
    reset() {
        this._id = 0;
        this.channels = {};
    }
    channelId(id) {
        let [ch, ...ns] = (id || '').split('.');
        return [
            ch,
            ns.join('.') || `_${++this._id}`
        ];
    }
    subscribe(id, fn, override = false) {
        let [ch, n] = this.channelId(id);
        if (!ch) return;
        let channels = this.channels;
        if (!channels[ch]) channels[ch] = {};
        let subs = channels[ch];
        if (subs[n] && !override) {
            throw new Error(`subscribe: ${id} already exists`);
        }
        subs[n] = fn;
        return [
            ch,
            n
        ].join('.');
    }
    unsubscribe() {
        let me = this;
        Array.from(arguments).flat().forEach((id)=>{
            let [ch, n] = me.channelId(id);
            if (!ch) return;
            let subs = me.channels[ch];
            if (!subs) return;
            delete subs[n];
        });
    }
    publish_(ch, ...args) {
        let subs = this.channels[ch];
        if (!subs) return;
        Object.values(subs).forEach((fn)=>{
            fn.apply(null, args);
        });
    }
    publish(channel, ...args) {
        let broadcast = channel.slice(-1) === '!';
        channel = broadcast ? channel.slice(0, -1) : channel;
        if (broadcast && this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                channel,
                args
            });
        }
        return this.publish_.apply(this, [
            channel
        ].concat(args));
    }
    async exec(ch, ...args) {
        let subs = this.channels[ch];
        if (!subs) return;
        let fns = Object.values(subs).map((fn)=>fn.apply(null, args));
        let arr = await Promise.all(fns);
        return Object.keys(subs).reduce((x, id, i)=>{
            x[id] = arr[i];
            return x;
        }, {});
    }
}
const WEB_PUBSUB_BROADCAST_CHANNEL_ID = globalThis.WEB_PUBSUB_BROADCAST_CHANNEL_ID || 'web-pubsub-broadcast-channel-id';
let pubsub = new PubSub({
    broadcastChannelId: WEB_PUBSUB_BROADCAST_CHANNEL_ID
});
pubsub.publish.bind(pubsub);
pubsub.subscribe.bind(pubsub);
pubsub.unsubscribe.bind(pubsub);
pubsub.exec.bind(pubsub);
let wrap = (w)=>{
    let _id = 0;
    let _cb = {};
    let fn = (...args)=>new Promise((ok, err)=>{
            let id = ++_id;
            w.postMessage({
                id,
                args
            });
            _cb[id] = {
                ok,
                err
            };
        });
    w.onmessage = (e)=>{
        if (!e) return;
        let { id , data , error  } = e.data || {};
        if (!id) return;
        let cb = _cb[id];
        if (!cb) return;
        delete _cb[id];
        let { ok , err  } = cb;
        return error ? err(error) : ok(data);
    };
    return new Proxy(fn, {
        get (_, prop) {
            return (...args)=>new Promise((ok, err)=>{
                    let id = ++_id;
                    w.postMessage({
                        id,
                        fn: prop,
                        args
                    });
                    _cb[id] = {
                        ok,
                        err
                    };
                });
        }
    });
};
let proxy = (arg, scope = null)=>{
    let Fn = {};
    if (typeof arg === 'function') {
        Fn._ = arg;
    } else if (arg !== null && arg instanceof Object && arg.constructor === Object) {
        Fn = arg;
    } else {
        throw 'please pass function/object';
    }
    globalThis.onmessage = function(e1) {
        if (!e1) return;
        let { id , fn ='_' , args  } = e1.data || {};
        {
            (async ()=>{
                var p = {
                    id
                };
                try {
                    let f = Fn[fn];
                    if (!f) throw 'undefined method';
                    let y = await f.apply(scope || Fn, args);
                    p.data = y;
                } catch (e) {
                    p.error = e;
                }
                globalThis.postMessage(p);
            })();
        }
    };
};
const mod1 = {
    wrap,
    proxy
};
export { pubsub as pubsub, PubSub as PubSub };
export { mod as Ajax };
export { mod1 as worker };
