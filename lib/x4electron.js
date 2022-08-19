"use strict";
/**
*  ___  ___ __
*  \  \/  /  / _
*   \    /  /_| |_
*   /    \____   _|
*  /__/\__\   |_|
*
*
* @file electron.ts
* @author Etienne Cochard
* @license
* Copyright (c) 2019-2022 R-libre ingenierie
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireFile = exports.getPathPart = exports.installHMR = exports.getPackage = exports.defineElectronHandler = exports.createCanvas = exports.getCurDir = exports.readDir = exports.sendAsyncIPC = exports.sendIPC = exports.getGlobalPath = exports.decompress = exports.compress = exports.writeUtf8 = exports.readUtf8 = exports.writeBinary = exports.readBinary = exports.openExternal = exports.setWindowTitle = exports.saveFile = exports.openFile = exports.libs = void 0;
/// <reference types="electron" />
/// <reference types="node/fs" />
const electron = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
exports.libs = {
    shell: electron.shell,
    renderer: electron.ipcRenderer,
    nativeImage: electron.nativeImage,
    path,
    fs,
    crypto,
    zlib,
};
/**
 * show openfile dialog
 * @param ext - string - ex: '.doc,.docx'
 * @param cb - callback to call when user select a file
 */
function openFile(ext, cb, multiple = false) {
    const filters = [];
    for (const n in ext) {
        let f;
        if (!Array.isArray(ext[n])) {
            f = [ext[n]];
        }
        else {
            f = ext[n];
        }
        filters.push({ name: n, extensions: f });
    }
    let result = sendIPC('showOpenDialog', {
        filters,
        multiple
    });
    console.log(result);
    if (result) {
        cb(result);
    }
}
exports.openFile = openFile;
/**
 * open saveas dialog
 * @param defFileName - string - proposed filename
 * @param cb - callback to call when user choose the destination
 */
function saveFile(defFileName, ext, cb) {
    const filters = [];
    for (const n in ext) {
        filters.push({ name: n, extensions: [ext[n]] });
    }
    let result = sendIPC('showSaveDialog', {
        defaultPath: defFileName,
        filters
    });
    console.log(result);
    if (result) {
        cb(result);
    }
}
exports.saveFile = saveFile;
/**
 *
 * @param title
 */
function setWindowTitle(title) {
    sendAsyncIPC('setTitle', title);
}
exports.setWindowTitle = setWindowTitle;
/**
 *
 * @param url
 */
function openExternal(url) {
    exports.libs.shell.openExternal(url);
}
exports.openExternal = openExternal;
/**
 *
 * @param path
 * @returns
 */
function readBinary(path) {
    return new Promise((resolve, reject) => {
        exports.libs.fs.readFile(path, (err, buff) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buff);
            }
        });
    });
}
exports.readBinary = readBinary;
/**
 *
 * @param path
 * @param data
 * @returns
 */
function writeBinary(path, data) {
    return new Promise((resolve, reject) => {
        exports.libs.fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.writeBinary = writeBinary;
/**
 *
 * @param path
 * @returns
 */
function readUtf8(path) {
    return new Promise((resolve, reject) => {
        exports.libs.fs.readFile(path, { encoding: 'utf8' }, (err, buff) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buff.toString());
            }
        });
    });
}
exports.readUtf8 = readUtf8;
/**
 *
 * @param path
 * @param data
 * @returns
 */
function writeUtf8(path, data) {
    return new Promise((resolve, reject) => {
        exports.libs.fs.writeFile(path, data, { encoding: 'utf8' }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.writeUtf8 = writeUtf8;
/**
 *
 * @param data
 * @returns
 */
function compress(data) {
    return new Promise((resolve, reject) => {
        exports.libs.zlib.gzip(data, (err, Uint8Array) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(Uint8Array);
            }
        });
    });
}
exports.compress = compress;
/**
 *
 * @param data
 * @returns
 */
function decompress(data) {
    return new Promise((resolve, reject) => {
        exports.libs.zlib.gunzip(data, (err, Uint8Array) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(Uint8Array);
            }
        });
    });
}
exports.decompress = decompress;
/**
 *
 * @param type
 * @param parts
 * @returns
 */
function getGlobalPath(type, ...parts) {
    return exports.libs.path.join(sendIPC('getPath', type), ...parts);
}
exports.getGlobalPath = getGlobalPath;
/**
 *
 * @param cmd
 * @param args
 * @returns
 */
function sendIPC(cmd, ...args) {
    return exports.libs.renderer.sendSync(cmd, ...args);
}
exports.sendIPC = sendIPC;
/**
 *
 * @param cmd
 * @param args
 * @returns
 */
function sendAsyncIPC(cmd, ...args) {
    return exports.libs.renderer.send(cmd, ...args);
}
exports.sendAsyncIPC = sendAsyncIPC;
/**
 *
 * @param path
 * @returns
 */
function readDir(path) {
    return new Promise((resolve, reject) => {
        exports.libs.fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
exports.readDir = readDir;
/**
 *
 * @returns
 */
function getCurDir() {
    return process.cwd();
}
exports.getCurDir = getCurDir;
/**
 *
 * @returns
 */
function createCanvas() {
    return document.createElement('canvas');
}
exports.createCanvas = createCanvas;
/**
 *
 * @param channel
 * @param listener
 */
function defineElectronHandler(channel, listener) {
    exports.libs.renderer.removeAllListeners(channel);
    exports.libs.renderer.on(channel, listener);
}
exports.defineElectronHandler = defineElectronHandler;
/**
 * @returns the content of package.json
 * @deprecated use instead: import pkg from "package.json";
 */
function getPackage() {
    return JSON.parse(exports.libs.fs.readFileSync('package.json', 'utf8'));
}
exports.getPackage = getPackage;
/**
 * taken from live-server
 * https://github.com/tapio/live-server
 * @param host
 * @param port
 */
function installHMR(host = "127.0.0.1", port = "9876", reloadCallback) {
    let tm;
    function refreshCSS() {
        document.body.style.visibility = "hidden";
        let sheets = [].slice.call(document.getElementsByTagName("link"));
        let head = document.getElementsByTagName("head")[0];
        for (let i = 0; i < sheets.length; ++i) {
            let elem = sheets[i];
            head.removeChild(elem);
            let rel = elem.rel;
            if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                let url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
            }
            head.appendChild(elem);
        }
        if (tm) {
            clearTimeout(tm);
        }
        tm = setTimeout(() => {
            document.body.style.visibility = "unset";
        }, 50);
    }
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const address = `${protocol}${host}:${port}/ws`;
    const socket = new WebSocket(address);
    socket.onmessage = function (msg) {
        if (msg.data == 'reload') {
            if (reloadCallback) {
                reloadCallback();
            }
            else {
                window.location.reload();
            }
        }
        else if (msg.data == 'refreshcss') {
            refreshCSS();
        }
    };
    console.log('Live reload enabled.');
}
exports.installHMR = installHMR;
function getPathPart(pth, type) {
    let els = path.parse(pth);
    switch (type) {
        case 'dirname': return els.dir;
        case 'basename': return els.base;
        case 'filename': return els.name;
        case 'extname': return els.ext;
    }
    return '';
}
exports.getPathPart = getPathPart;
/**
 *
 * @param path
 * @returns
 */
function requireFile(path) {
    return require(path);
}
exports.requireFile = requireFile;
