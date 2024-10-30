import { RawInterpreter } from './snippets/dioxus-interpreter-js-ec619651cd4d8de4/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-ec619651cd4d8de4/src/js/common.js';
import { get_select_data } from './snippets/dioxus-web-1a00d2851221850e/inline0.js';
import { WebDioxusChannel } from './snippets/dioxus-web-1a00d2851221850e/src/js/eval.js';
import { get_stars, set_stars } from './snippets/dioxus_docs_site-3d7fa65fa73c445a/src/components/storage.js';
import * as __wbg_star0 from './snippets/dioxus-web-1a00d2851221850e/inline1.js';

let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_50(arg0, arg1, arg2) {
    wasm.closure349_externref_shim(arg0, arg1, arg2);
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_53(arg0, arg1, arg2) {
    wasm.closure368_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_56(arg0, arg1, arg2) {
    wasm.closure371_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_59(arg0, arg1) {
    wasm._ZN132__LT_dyn_u20_core__ops__function__FnMut_LT__LP__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17h74b847c77e256252E(arg0, arg1);
}

function getFromExternrefTable0(idx) { return wasm.__wbindgen_export_2.get(idx); }

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getFromExternrefTable0(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addToExternrefTable0(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const __wbindgen_enum_BinaryType = ["blob", "arraybuffer"];

const __wbindgen_enum_ReferrerPolicy = ["", "no-referrer", "no-referrer-when-downgrade", "origin", "origin-when-cross-origin", "unsafe-url", "same-origin", "strict-origin", "strict-origin-when-cross-origin"];

const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const __wbindgen_enum_RequestRedirect = ["follow", "error", "manual"];

const __wbindgen_enum_ResponseType = ["basic", "cors", "default", "error", "opaque", "opaqueredirect"];

const __wbindgen_enum_ScrollBehavior = ["auto", "instant", "smooth"];

const __wbindgen_enum_ScrollLogicalPosition = ["start", "center", "end", "nearest"];

const __wbindgen_enum_ScrollRestoration = ["auto", "manual"];

const JSOwnerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsowner_free(ptr >>> 0, 1));

export class JSOwner {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JSOwner.prototype);
        obj.__wbg_ptr = ptr;
        JSOwnerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSOwnerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsowner_free(ptr, 0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_navigator_3d3836196a5d8e62 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_platform_fadbd50c3abb31c3 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.platform;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_now_70af4fe37a792251 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_setscrollRestoration_30344d30df483020 = function() { return handleError(function (arg0, arg1) {
        arg0.scrollRestoration = __wbindgen_enum_ScrollRestoration[arg1];
    }, arguments) };
    imports.wbg.__wbg_pathname_f807053b46d955a7 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.pathname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_search_aaeccdb8c45f3efa = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_hash_acef7ae4422b13b0 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_state_ea7aeeadc8019f77 = function() { return handleError(function (arg0) {
        const ret = arg0.state;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_5419cf6b954aa11d = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_requestAnimationFrame_8c3436f4ac89bc48 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_movementX_468fdc7a7281744b = function(arg0) {
        const ret = arg0.movementX;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlDocument_f69229cb122d1154 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLDocument;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_domain_6514cbc057fbe4a9 = function(arg0, arg1) {
        const ret = arg1.domain;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_forward_6285325e2d53381c = function() { return handleError(function (arg0) {
        arg0.forward();
    }, arguments) };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_034f913e7636e987 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_push_36cf4d81d7da33d1 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_pushState_fd9ad18c3fdad921 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        var v0 = getCachedStringFromWasm0(arg2, arg3);
        var v1 = getCachedStringFromWasm0(arg4, arg5);
        arg0.pushState(arg1, v0, v1);
    }, arguments) };
    imports.wbg.__wbg_back_3aa3dfd5bab60f70 = function() { return handleError(function (arg0) {
        arg0.back();
    }, arguments) };
    imports.wbg.__wbg_new_e69b5f66fda8f13c = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_setcapture_216080a2de0d127c = function(arg0, arg1) {
        arg0.capture = arg1 !== 0;
    };
    imports.wbg.__wbg_setonce_9f2ce9d61cf01425 = function(arg0, arg1) {
        arg0.once = arg1 !== 0;
    };
    imports.wbg.__wbg_setpassive_b1f337166a79f6c5 = function(arg0, arg1) {
        arg0.passive = arg1 !== 0;
    };
    imports.wbg.__wbg_sethref_54265015953e6e04 = function() { return handleError(function (arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        arg0.href = v0;
    }, arguments) };
    imports.wbg.__wbg_getstars_a7986227de29549e = function(arg0, arg1, arg2) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
    if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
    const ret = get_stars(v0);
    getDataViewMemory0().setInt32(arg0 + 4 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};
imports.wbg.__wbg_setstars_bf510d577e6fbc44 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1, 1); }
set_stars(v0, arg2 >>> 0);
};
imports.wbg.__wbg_abort_c57daab47a6c1215 = function(arg0) {
    arg0.abort();
};
imports.wbg.__wbg_clearTimeout_541ac0980ffcef74 = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');
imports.wbg.__wbg_removeEventListener_4740f011c11e2737 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.removeEventListener(v0, arg3, arg4 !== 0);
}, arguments) };
imports.wbg.__wbindgen_cb_drop = function(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};
imports.wbg.__wbg_cancelAnimationFrame_f802bc3f3a9b2e5c = function() { return handleError(function (arg0, arg1) {
    arg0.cancelAnimationFrame(arg1);
}, arguments) };
imports.wbg.__wbg_setmethod_ce2da76000b02f6a = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.method = v0;
};
imports.wbg.__wbg_new_a9ae04a5200606a5 = function() { return handleError(function () {
    const ret = new Headers();
    return ret;
}, arguments) };
imports.wbg.__wbg_setheaders_f5205d36e423a544 = function(arg0, arg1) {
    arg0.headers = arg1;
};
imports.wbg.__wbg_setmode_4919fd636102c586 = function(arg0, arg1) {
    arg0.mode = __wbindgen_enum_RequestMode[arg1];
};
imports.wbg.__wbg_setcredentials_a4e661320cdb9738 = function(arg0, arg1) {
    arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
};
imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
};
imports.wbg.__wbg_buffer_ccaed51a635d8a2d = function(arg0) {
    const ret = arg0.buffer;
    return ret;
};
imports.wbg.__wbg_newwithbyteoffsetandlength_7e3eb787208af730 = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};
imports.wbg.__wbg_new_fec2611eb9180f95 = function(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};
imports.wbg.__wbg_setbody_aa8b691bec428bf4 = function(arg0, arg1) {
    arg0.body = arg1;
};
imports.wbg.__wbg_append_8b3e7f74a47ea7d5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    arg0.append(v0, v1);
}, arguments) };
imports.wbg.__wbg_new_75169ae5a9683c55 = function() { return handleError(function () {
    const ret = new AbortController();
    return ret;
}, arguments) };
imports.wbg.__wbg_signal_9acfcec9e7dffc22 = function(arg0) {
    const ret = arg0.signal;
    return ret;
};
imports.wbg.__wbg_setsignal_812ccb8269a7fd90 = function(arg0, arg1) {
    arg0.signal = arg1;
};
imports.wbg.__wbg_newwithstrandinit_4b92c89af0a8e383 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Request(v0, arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_has_bd717f25f195f23d = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.has(arg0, arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_fetch_bc7c8e27076a5c84 = typeof fetch == 'function' ? fetch : notDefined('fetch');
imports.wbg.__wbg_fetch_1fdc4448ed9eec00 = function(arg0, arg1) {
    const ret = arg0.fetch(arg1);
    return ret;
};
imports.wbg.__wbg_instanceof_Response_3c0e210a57ff751d = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Response;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_status_5f4e900d22140a18 = function(arg0) {
    const ret = arg0.status;
    return ret;
};
imports.wbg.__wbg_url_58af972663531d16 = function(arg0, arg1) {
    const ret = arg1.url;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_headers_1b9bf90c73fae600 = function(arg0) {
    const ret = arg0.headers;
    return ret;
};
imports.wbg.__wbg_arrayBuffer_144729e09879650e = function() { return handleError(function (arg0) {
    const ret = arg0.arrayBuffer();
    return ret;
}, arguments) };
imports.wbg.__wbg_length_9254c4bd3b9f23c4 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_new0_218ada33b570be35 = function() {
    const ret = new Date();
    return ret;
};
imports.wbg.__wbg_getTime_41225036a0393d63 = function(arg0) {
    const ret = arg0.getTime();
    return ret;
};
imports.wbg.__wbg_new_d550f7a7120dd942 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new WebSocket(v0);
    return ret;
}, arguments) };
imports.wbg.__wbg_setbinaryType_2befea8ba88b61e2 = function(arg0, arg1) {
    arg0.binaryType = __wbindgen_enum_BinaryType[arg1];
};
imports.wbg.__wbg_readyState_bc0231e8c43b0907 = function(arg0) {
    const ret = arg0.readyState;
    return ret;
};
imports.wbg.__wbg_send_f308b110e144e90d = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.send(v0);
}, arguments) };
imports.wbg.__wbg_send_fe006eb24f5e2694 = function() { return handleError(function (arg0, arg1, arg2) {
    arg0.send(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };
imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};
imports.wbg.__wbg_replaceState_590d6294219f655e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    arg0.replaceState(arg1, v0, v1);
}, arguments) };
imports.wbg.__wbg_scrollX_6e21c57bb4ccf11f = function() { return handleError(function (arg0) {
    const ret = arg0.scrollX;
    return ret;
}, arguments) };
imports.wbg.__wbg_scrollY_98f05c42fd875c30 = function() { return handleError(function (arg0) {
    const ret = arg0.scrollY;
    return ret;
}, arguments) };
imports.wbg.__wbg_saveTemplate_ccd11f3690b0fd78 = function(arg0, arg1, arg2, arg3) {
    var v0 = getArrayJsValueFromWasm0(arg1, arg2).slice();
    wasm.__wbindgen_free(arg1, arg2 * 4, 4);
    arg0.saveTemplate(v0, arg3);
};
imports.wbg.__wbg_createTextNode_3b33c97f8ef3e999 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createTextNode(v0);
    return ret;
};
imports.wbg.__wbg_createComment_91ba91f80deb16bd = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createComment(v0);
    return ret;
};
imports.wbg.__wbg_createElementNS_e51a368ab3a64b37 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = arg0.createElementNS(v0, v1);
    return ret;
}, arguments) };
imports.wbg.__wbg_appendChild_bc4a0deae90a5164 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.appendChild(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_setAttributeInner_847c617dc0828914 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    setAttributeInner(arg0, v0, arg3, v1);
};
imports.wbg.__wbg_new_0735e633db3552af = function(arg0) {
    const ret = new WebDioxusChannel(JSOwner.__wrap(arg0));
    return ret;
};
imports.wbg.__wbg_weak_954954e27a0e9701 = function(arg0) {
    const ret = arg0.weak();
    return ret;
};
imports.wbg.__wbg_newwithargs_54f5f31ff1323eb2 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new Function(v0, v1);
    return ret;
};
imports.wbg.__wbg_call_3bfa248576352471 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === undefined;
    return ret;
};
imports.wbg.__wbg_length_ace210b441c50e19 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_rustSend_eb7989d08e7df7d6 = function(arg0, arg1) {
    arg0.rustSend(arg1);
};
imports.wbg.__wbg_rustRecv_d49d34aa34d4a924 = function(arg0) {
    const ret = arg0.rustRecv();
    return ret;
};
imports.wbg.__wbindgen_boolean_get = function(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};
imports.wbg.__wbindgen_is_bigint = function(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
};
imports.wbg.__wbg_isSafeInteger_b9dff570f01a9100 = function(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};
imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
    const ret = arg0;
    return ret;
};
imports.wbg.__wbindgen_is_object = function(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};
imports.wbg.__wbg_length_f217bbbf7e8e4df4 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_iterator_695d699a44d6234c = function() {
    const ret = Symbol.iterator;
    return ret;
};
imports.wbg.__wbindgen_in = function(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};
imports.wbg.__wbg_entries_c02034de337d3ee2 = function(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};
imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};
imports.wbg.__wbg_String_88810dfeb4021902 = function(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
};
imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};
imports.wbg.__wbg_set_425e70f7c64ac962 = function(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};
imports.wbg.__wbg_new_7a87a0376e40533b = function() {
    const ret = new Map();
    return ret;
};
imports.wbg.__wbg_set_277a63e77c89279f = function(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};
imports.wbg.__wbg_set_841ac57cff3d672b = function(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};
imports.wbg.__wbg_instanceof_DragEvent_d060c9d7e145246e = function(arg0) {
    let result;
    try {
        result = arg0 instanceof DragEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_dataTransfer_b898af73237a967c = function(arg0) {
    const ret = arg0.dataTransfer;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_files_194ca113571d995f = function(arg0) {
    const ret = arg0.files;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_new_e282c42c5fc7a7b1 = function() { return handleError(function () {
    const ret = new FileReader();
    return ret;
}, arguments) };
imports.wbg.__wbg_readAsText_abb4898a82a4815a = function() { return handleError(function (arg0, arg1) {
    arg0.readAsText(arg1);
}, arguments) };
imports.wbg.__wbg_readAsArrayBuffer_467dfea5cb42f85c = function() { return handleError(function (arg0, arg1) {
    arg0.readAsArrayBuffer(arg1);
}, arguments) };
imports.wbg.__wbg_size_51012fd85f29376f = function(arg0) {
    const ret = arg0.size;
    return ret;
};
imports.wbg.__wbg_files_5738c8732c2fc992 = function(arg0) {
    const ret = arg0.files;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_type_0b40a977ba28a744 = function(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_value_0cffd86fb9a5a18d = function(arg0, arg1) {
    const ret = arg1.value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_checked_5c9846154b6119f6 = function(arg0) {
    const ret = arg0.checked;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_3d7305919124ce06 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLTextAreaElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_value_a8d0480de0da39cf = function(arg0, arg1) {
    const ret = arg1.value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_value_0b0cebe9335a78ae = function(arg0, arg1) {
    const ret = arg1.value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_textContent_389dd460500a44bd = function(arg0, arg1) {
    const ret = arg1.textContent;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_instanceof_HtmlFormElement_b7d5ed0355176c29 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLFormElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_entries_08a0332a9c4be547 = function(arg0) {
    const ret = arg0.entries();
    return ret;
};
imports.wbg.__wbg_getselectdata_19e9720fb8f76fad = function(arg0, arg1) {
    const ret = get_select_data(arg1);
    const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_instanceof_HtmlSelectElement_66dfc08c717b1515 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLSelectElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlInputElement_ee25196edbacced9 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLInputElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlElement_aab18e065dc9207d = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_clientX_0e075d664eb70517 = function(arg0) {
    const ret = arg0.clientX;
    return ret;
};
imports.wbg.__wbg_clientY_32b24b7be6b2e79d = function(arg0) {
    const ret = arg0.clientY;
    return ret;
};
imports.wbg.__wbg_screenX_66fdb34b7f1552ac = function(arg0) {
    const ret = arg0.screenX;
    return ret;
};
imports.wbg.__wbg_screenY_0949c88f98db641e = function(arg0) {
    const ret = arg0.screenY;
    return ret;
};
imports.wbg.__wbg_pageX_f570d523d89c16ec = function(arg0) {
    const ret = arg0.pageX;
    return ret;
};
imports.wbg.__wbg_pageY_ff077f56016c03aa = function(arg0) {
    const ret = arg0.pageY;
    return ret;
};
imports.wbg.__wbg_identifier_b858c904e1c72507 = function(arg0) {
    const ret = arg0.identifier;
    return ret;
};
imports.wbg.__wbg_force_5af67f6cd0b9c097 = function(arg0) {
    const ret = arg0.force;
    return ret;
};
imports.wbg.__wbg_radiusX_f00767113c0e51ea = function(arg0) {
    const ret = arg0.radiusX;
    return ret;
};
imports.wbg.__wbg_radiusY_c4043b226e03d720 = function(arg0) {
    const ret = arg0.radiusY;
    return ret;
};
imports.wbg.__wbg_rotationAngle_e35c1b560312ec61 = function(arg0) {
    const ret = arg0.rotationAngle;
    return ret;
};
imports.wbg.__wbg_instanceof_Element_1a81366cc90e70e2 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Element;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_altKey_e0ebf3eabcb13e08 = function(arg0) {
    const ret = arg0.altKey;
    return ret;
};
imports.wbg.__wbg_ctrlKey_606cbe2c4322ed56 = function(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};
imports.wbg.__wbg_metaKey_3b977a6e61a731d7 = function(arg0) {
    const ret = arg0.metaKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_863ca71f9f2722ab = function(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};
imports.wbg.__wbg_touches_092e96ce3221acbc = function(arg0) {
    const ret = arg0.touches;
    return ret;
};
imports.wbg.__wbg_length_1b6ac4894265d4e6 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_changedTouches_ee3dabea7d95ebf2 = function(arg0) {
    const ret = arg0.changedTouches;
    return ret;
};
imports.wbg.__wbg_targetTouches_faffde5127036c13 = function(arg0) {
    const ret = arg0.targetTouches;
    return ret;
};
imports.wbg.__wbg_deltaMode_f31810d86a9defec = function(arg0) {
    const ret = arg0.deltaMode;
    return ret;
};
imports.wbg.__wbg_deltaX_10154f810008c0a0 = function(arg0) {
    const ret = arg0.deltaX;
    return ret;
};
imports.wbg.__wbg_deltaY_afd77a1b9e0d9ccd = function(arg0) {
    const ret = arg0.deltaY;
    return ret;
};
imports.wbg.__wbg_deltaZ_ec44501c143f6d88 = function(arg0) {
    const ret = arg0.deltaZ;
    return ret;
};
imports.wbg.__wbg_borderBoxSize_4ceb90aca6152049 = function(arg0) {
    const ret = arg0.borderBoxSize;
    return ret;
};
imports.wbg.__wbg_contentBoxSize_407a04b6289dbaa7 = function(arg0) {
    const ret = arg0.contentBoxSize;
    return ret;
};
imports.wbg.__wbg_inlineSize_bdd9c1683673d79e = function(arg0) {
    const ret = arg0.inlineSize;
    return ret;
};
imports.wbg.__wbg_blockSize_5d28da4852a3728e = function(arg0) {
    const ret = arg0.blockSize;
    return ret;
};
imports.wbg.__wbg_scrollLeft_3f023c2dbf3b616f = function(arg0) {
    const ret = arg0.scrollLeft;
    return ret;
};
imports.wbg.__wbg_scrollTop_e2854bd166cf1dba = function(arg0) {
    const ret = arg0.scrollTop;
    return ret;
};
imports.wbg.__wbg_scrollWidth_d6158a79a3a2b5fa = function(arg0) {
    const ret = arg0.scrollWidth;
    return ret;
};
imports.wbg.__wbg_scrollHeight_477449b53cdc9083 = function(arg0) {
    const ret = arg0.scrollHeight;
    return ret;
};
imports.wbg.__wbg_getBoundingClientRect_5ad16be1e2955e83 = function(arg0) {
    const ret = arg0.getBoundingClientRect();
    return ret;
};
imports.wbg.__wbg_left_324ad4ce0086311f = function(arg0) {
    const ret = arg0.left;
    return ret;
};
imports.wbg.__wbg_top_5f4586313f3e086f = function(arg0) {
    const ret = arg0.top;
    return ret;
};
imports.wbg.__wbg_width_28175f04c07458aa = function(arg0) {
    const ret = arg0.width;
    return ret;
};
imports.wbg.__wbg_height_dbd0616ae39a99b1 = function(arg0) {
    const ret = arg0.height;
    return ret;
};
imports.wbg.__wbg_setbehavior_e58c14ac43ed56a1 = function(arg0, arg1) {
    arg0.behavior = __wbindgen_enum_ScrollBehavior[arg1];
};
imports.wbg.__wbg_scrollIntoView_006062858903bbd0 = function(arg0, arg1) {
    arg0.scrollIntoView(arg1);
};
imports.wbg.__wbg_blur_d7e0bcc31c40e996 = function() { return handleError(function (arg0) {
    arg0.blur();
}, arguments) };
imports.wbg.__wbg_focus_6b6181f7644f6dbc = function() { return handleError(function (arg0) {
    arg0.focus();
}, arguments) };
imports.wbg.__wbg_pointerId_93f7e5e10bb641ad = function(arg0) {
    const ret = arg0.pointerId;
    return ret;
};
imports.wbg.__wbg_width_e219d480687cf6e6 = function(arg0) {
    const ret = arg0.width;
    return ret;
};
imports.wbg.__wbg_height_43c0ad624a17f405 = function(arg0) {
    const ret = arg0.height;
    return ret;
};
imports.wbg.__wbg_pressure_ad8dacbd14c9076f = function(arg0) {
    const ret = arg0.pressure;
    return ret;
};
imports.wbg.__wbg_tangentialPressure_a096181c7325f997 = function(arg0) {
    const ret = arg0.tangentialPressure;
    return ret;
};
imports.wbg.__wbg_tiltX_d85abdd3d6e11865 = function(arg0) {
    const ret = arg0.tiltX;
    return ret;
};
imports.wbg.__wbg_tiltY_c890264354ac05d2 = function(arg0) {
    const ret = arg0.tiltY;
    return ret;
};
imports.wbg.__wbg_twist_7843b7e5e0e2d69d = function(arg0) {
    const ret = arg0.twist;
    return ret;
};
imports.wbg.__wbg_pointerType_6d91ef0da43639d3 = function(arg0, arg1) {
    const ret = arg1.pointerType;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_isPrimary_2ee404d1f136ff46 = function(arg0) {
    const ret = arg0.isPrimary;
    return ret;
};
imports.wbg.__wbg_altKey_ebf03e2308f51c08 = function(arg0) {
    const ret = arg0.altKey;
    return ret;
};
imports.wbg.__wbg_ctrlKey_f592192d87040d94 = function(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};
imports.wbg.__wbg_metaKey_0735ca81e2ec6c72 = function(arg0) {
    const ret = arg0.metaKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_cb120edc9c25950d = function(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};
imports.wbg.__wbg_key_001eb20ba3b3d2fd = function(arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_code_bec0d5222298000e = function(arg0, arg1) {
    const ret = arg1.code;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_location_a7e2614c5720fcd7 = function(arg0) {
    const ret = arg0.location;
    return ret;
};
imports.wbg.__wbg_repeat_1f81f308f5d8d519 = function(arg0) {
    const ret = arg0.repeat;
    return ret;
};
imports.wbg.__wbg_isComposing_527cd20b8f4c31d2 = function(arg0) {
    const ret = arg0.isComposing;
    return ret;
};
imports.wbg.__wbg_animationName_841417bb5df8825f = function(arg0, arg1) {
    const ret = arg1.animationName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_pseudoElement_b2234158091018ae = function(arg0, arg1) {
    const ret = arg1.pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_elapsedTime_2a54081e9269631d = function(arg0) {
    const ret = arg0.elapsedTime;
    return ret;
};
imports.wbg.__wbg_propertyName_44ca202b08d008f3 = function(arg0, arg1) {
    const ret = arg1.propertyName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_pseudoElement_f3ba1319b33578fa = function(arg0, arg1) {
    const ret = arg1.pseudoElement;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_elapsedTime_476a4e01c4f63fda = function(arg0) {
    const ret = arg0.elapsedTime;
    return ret;
};
imports.wbg.__wbg_data_86e77dc14916d155 = function(arg0, arg1) {
    const ret = arg1.data;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_detail_283e6c7e14db88ea = function(arg0) {
    const ret = arg0.detail;
    return ret;
};
imports.wbg.__wbg_target_b0499015ea29563d = function(arg0) {
    const ret = arg0.target;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_getAttribute_8ac49f4186f4cefd = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = arg1.getAttribute(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
};
imports.wbg.__wbg_parentElement_bf013e6093029477 = function(arg0) {
    const ret = arg0.parentElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_bubbles_c48a1056384e852c = function(arg0) {
    const ret = arg0.bubbles;
    return ret;
};
imports.wbg.__wbg_preventDefault_eecc4a63e64c4526 = function(arg0) {
    arg0.preventDefault();
};
imports.wbg.__wbg_getElementById_734c4eac4fec5911 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.getElementById(v0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_error_53abcd6a461f73d8 = typeof console.error == 'function' ? console.error : notDefined('console.error');
imports.wbg.__wbg_ownerDocument_1ff29e4c967e4d78 = function(arg0) {
    const ret = arg0.ownerDocument;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_new_5572359242c59cc0 = function(arg0) {
    const ret = new RawInterpreter(arg0 >>> 0);
    return ret;
};
imports.wbg.__wbg_initialize_2d00f71006c54dc0 = function(arg0, arg1, arg2) {
    arg0.initialize(arg1, arg2);
};
imports.wbg.__wbg_updatememory_e4306c8d76c527a4 = function(arg0, arg1) {
    arg0.update_memory(arg1);
};
imports.wbg.__wbg_run_caa7af5fc6ca604d = function(arg0) {
    arg0.run();
};
imports.wbg.__wbg_getNode_ee0abc1bd18c366f = function(arg0, arg1) {
    const ret = arg0.getNode(arg1 >>> 0);
    return ret;
};
imports.wbg.__wbg_error_71d6845bf00a930f = function(arg0, arg1) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4, 4);
    console.error(...v0);
};
imports.wbg.__wbg_instanceof_Error_a0af335a62107964 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Error;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_name_aa32a0ae51232604 = function(arg0) {
    const ret = arg0.name;
    return ret;
};
imports.wbg.__wbg_message_00eebca8fa4dd7db = function(arg0) {
    const ret = arg0.message;
    return ret;
};
imports.wbg.__wbg_toString_4b677455b9167e31 = function(arg0) {
    const ret = arg0.toString();
    return ret;
};
imports.wbg.__wbg_code_9d4413f8b44b70c2 = function(arg0) {
    const ret = arg0.code;
    return ret;
};
imports.wbg.__wbg_reason_ae1d72dfda13e899 = function(arg0, arg1) {
    const ret = arg1.reason;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_wasClean_cf2135191288f963 = function(arg0) {
    const ret = arg0.wasClean;
    return ret;
};
imports.wbg.__wbg_data_134d3a704b9fca32 = function(arg0) {
    const ret = arg0.data;
    return ret;
};
imports.wbg.__wbg_setcode_a0c5900000499842 = function(arg0, arg1) {
    arg0.code = arg1;
};
imports.wbg.__wbg_setreason_7efb82dfa8a2f404 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.reason = v0;
};
imports.wbg.__wbg_newwitheventinitdict_e04d4cf36ab15962 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new CloseEvent(v0, arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_removeEventListener_4c13d11156153514 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.removeEventListener(v0, arg3);
}, arguments) };
imports.wbg.__wbg_dispatchEvent_d3978479884f576d = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.dispatchEvent(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_setTimeout_7d81d052875b0f4f = function() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(arg0, arg1);
    return ret;
}, arguments) };
imports.wbg.__wbindgen_is_string = function(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};
imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};
imports.wbg.__wbg_call_a9ef466721e824f2 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_charCodeAt_b8a738ac743eeff4 = function(arg0, arg1) {
    const ret = arg0.charCodeAt(arg1 >>> 0);
    return ret;
};
imports.wbg.__wbg_next_b06e115d1b01e10b = function() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };
imports.wbg.__wbg_done_983b5ffcaec8c583 = function(arg0) {
    const ret = arg0.done;
    return ret;
};
imports.wbg.__wbg_value_2ab8a198c834c26a = function(arg0) {
    const ret = arg0.value;
    return ret;
};
imports.wbg.__wbg_get_ef828680c64da212 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_next_13b477da1eaa3897 = function(arg0) {
    const ret = arg0.next;
    return ret;
};
imports.wbg.__wbg_self_bf91bf94d9e04084 = function() { return handleError(function () {
    const ret = self.self;
    return ret;
}, arguments) };
imports.wbg.__wbg_window_52dd9f07d03fd5f8 = function() { return handleError(function () {
    const ret = window.window;
    return ret;
}, arguments) };
imports.wbg.__wbg_globalThis_05c129bf37fcf1be = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return ret;
}, arguments) };
imports.wbg.__wbg_global_3eca19bb09e9c484 = function() { return handleError(function () {
    const ret = global.global;
    return ret;
}, arguments) };
imports.wbg.__wbg_newnoargs_1ede4bf2ebbaaf43 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return ret;
};
imports.wbg.__wbg_isArray_6f3b47f09adb61b5 = function(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};
imports.wbg.__wbg_instanceof_ArrayBuffer_74945570b4a62ec7 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_stringify_eead5648c09faaf8 = function() { return handleError(function (arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
}, arguments) };
imports.wbg.__wbg_set_ec2fcf81bc573fd9 = function(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};
imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};
imports.wbg.__wbg_instanceof_Uint8Array_df0761410414ef36 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_then_748f75edfb032440 = function(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};
imports.wbg.__wbg_queueMicrotask_c5419c06eab41e73 = typeof queueMicrotask == 'function' ? queueMicrotask : notDefined('queueMicrotask');
imports.wbg.__wbg_then_4866a7d9f55d8f3e = function(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};
imports.wbg.__wbg_queueMicrotask_848aa4969108a57e = function(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};
imports.wbg.__wbg_resolve_0aad7c1484731c99 = function(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};
imports.wbg.__wbg_instanceof_Window_6575cd7f1322f82f = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_createElement_e4523490bd0ae51d = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createElement(v0);
    return ret;
}, arguments) };
imports.wbg.__wbg_type_739ef24b64f58229 = function(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_addEventListener_4357f9b7b3826784 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.addEventListener(v0, arg3);
}, arguments) };
imports.wbg.__wbg_addEventListener_0ac72681badaf1aa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.addEventListener(v0, arg3, arg4);
}, arguments) };
imports.wbg.__wbg_name_e30efb33291e0016 = function(arg0, arg1) {
    const ret = arg1.name;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_length_21a3493916831b15 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_item_e35a9206ab7dd263 = function(arg0, arg1) {
    const ret = arg0.item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_result_5cc84600fc64bf35 = function() { return handleError(function (arg0) {
    const ret = arg0.result;
    return ret;
}, arguments) };
imports.wbg.__wbg_setonload_0e9d43ec0cbb3987 = function(arg0, arg1) {
    arg0.onload = arg1;
};
imports.wbg.__wbg_screenX_a30d4e116ae70c94 = function(arg0) {
    const ret = arg0.screenX;
    return ret;
};
imports.wbg.__wbg_screenY_8325b64f4724a798 = function(arg0) {
    const ret = arg0.screenY;
    return ret;
};
imports.wbg.__wbg_clientX_a8eebf094c107e43 = function(arg0) {
    const ret = arg0.clientX;
    return ret;
};
imports.wbg.__wbg_clientY_ffe0a79af8089cd4 = function(arg0) {
    const ret = arg0.clientY;
    return ret;
};
imports.wbg.__wbg_offsetX_79b2d23b78682ab7 = function(arg0) {
    const ret = arg0.offsetX;
    return ret;
};
imports.wbg.__wbg_offsetY_39cb724403a8302f = function(arg0) {
    const ret = arg0.offsetY;
    return ret;
};
imports.wbg.__wbg_ctrlKey_4015247a39aa9410 = function(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_6d843f3032fd0366 = function(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};
imports.wbg.__wbg_altKey_c9401b041949ea90 = function(arg0) {
    const ret = arg0.altKey;
    return ret;
};
imports.wbg.__wbg_metaKey_5d680933661ea1ea = function(arg0) {
    const ret = arg0.metaKey;
    return ret;
};
imports.wbg.__wbg_button_d8226b772c8cf494 = function(arg0) {
    const ret = arg0.button;
    return ret;
};
imports.wbg.__wbg_buttons_2cb9e49b40e20105 = function(arg0) {
    const ret = arg0.buttons;
    return ret;
};
imports.wbg.__wbg_instanceof_Node_db422d75160b3c20 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Node;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_get_4d863ed1d42a2b7d = function(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_pageX_163dc6047071b51f = function(arg0) {
    const ret = arg0.pageX;
    return ret;
};
imports.wbg.__wbg_pageY_302e6265933ebb59 = function(arg0) {
    const ret = arg0.pageY;
    return ret;
};
imports.wbg.__wbg_close_9e3b743c528a8d31 = function() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };
imports.wbg.__wbg_document_d7fa2c739c2b191a = function(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_location_72721055fbff81f2 = function(arg0) {
    const ret = arg0.location;
    return ret;
};
imports.wbg.__wbg_history_95935eecf7ecc279 = function() { return handleError(function (arg0) {
    const ret = arg0.history;
    return ret;
}, arguments) };
imports.wbg.__wbg_scrollTo_348ad9b3fa67341f = function(arg0, arg1, arg2) {
    arg0.scrollTo(arg1, arg2);
};
imports.wbg.__wbindgen_closure_wrapper1896 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 350, __wbg_adapter_50);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper2114 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 370, __wbg_adapter_53);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper2939 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 372, __wbg_adapter_56);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4179 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 372, __wbg_adapter_59);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4181 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 372, __wbg_adapter_56);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4182 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 372, __wbg_adapter_56);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4475 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 350, __wbg_adapter_59);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4544 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 350, __wbg_adapter_53);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper4738 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 377, __wbg_adapter_59);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper5885 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 372, __wbg_adapter_56);
    return ret;
};
imports.wbg.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};
imports['./snippets/dioxus-web-1a00d2851221850e/inline1.js'] = __wbg_star0;

return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }


    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;