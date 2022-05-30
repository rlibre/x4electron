"use strict";
/**
* @file host/electron.ts
* @author Etienne Cochard
* @license
* Copyright (c) 2019-2021 R-libre ingenierie
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
**/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronHost = void 0;
const x4dom_1 = require("x4js/lib/x4dom");
const host_1 = require("./host");
__exportStar(require("./host"), exports);
const fs = require("fs");
const path = require("path");
const electron = require("electron");
const process = require("process");
class ElectronHost extends host_1.Host {
    makePath(...els) {
        return path.join(...els);
    }
    readBinary(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, buff) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(buff);
                }
            });
        });
    }
    writeBinary(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    readUtf8(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { encoding: 'utf8' }, (err, buff) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(buff.toString());
                }
            });
        });
    }
    writeUtf8(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, { encoding: 'utf8' }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    compress(data) {
        return new Promise((resolve, reject) => {
            let zlib = this.require('zlib');
            zlib.gzip(data, (err, Uint8Array) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(Uint8Array);
                }
            });
        });
    }
    decompress(data) {
        return new Promise((resolve, reject) => {
            let zlib = this.require('zlib');
            zlib.gunzip(data, (err, Uint8Array) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(Uint8Array);
                }
            });
        });
    }
    readLocalStorage(name) {
        return localStorage.getItem(name);
    }
    writeLocalStorage(name, data) {
        localStorage.setItem(name, data);
    }
    stat(name) {
        let stat = fs.statSync(name);
        if (!stat) {
            return null;
        }
        return {
            atime: stat.atimeMs,
            isDir: stat.isDirectory()
        };
    }
    readDir(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    }
    //require( name: string ): any {
    //	return host_require( name );
    //} 
    cwd() {
        return process.cwd();
    }
    get ipc() {
        return electron.ipcRenderer;
    }
    getPath(type) {
        return this.ipc.sendSync('getPath', type);
    }
    getPathPart(pth, type) {
        let els = path.parse(pth);
        switch (type) {
            case 'dirname': return els.dir;
            case 'basename': return els.base;
            case 'filename': return els.name;
            case 'extname': return els.ext;
        }
        return '';
    }
    createCanvas = () => {
        return x4dom_1.x4document.createElement('canvas');
    };
}
exports.ElectronHost = ElectronHost;
new ElectronHost();
