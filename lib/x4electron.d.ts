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
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as zlib from "zlib";
export declare let libs: {
    shell: Electron.Shell;
    renderer: Electron.IpcRenderer;
    nativeImage: typeof Electron.NativeImage;
    path: path.PlatformPath;
    fs: typeof fs;
    crypto: typeof crypto;
    zlib: typeof zlib;
};
/**
 * @example
 * {
 * 	'packed file' : 'report'
 * 	'json file': 'report.json'
 * }
 */
interface OpenSaveFilter {
    [name: string]: string | string[];
}
/**
 * show openfile dialog
 * @param ext - string - ex: '.doc,.docx'
 * @param cb - callback to call when user select a file
 */
export declare function openFile(ext: OpenSaveFilter, cb: (filenames: string[]) => void, multiple?: boolean): void;
/**
 * open saveas dialog
 * @param defFileName - string - proposed filename
 * @param cb - callback to call when user choose the destination
 */
export declare function saveFile(defFileName: string, ext: OpenSaveFilter, cb: (filename: string) => void): void;
/**
 *
 * @param title
 */
export declare function setWindowTitle(title: string): void;
/**
 *
 * @param url
 */
export declare function openExternal(url: string): void;
/**
 *
 * @param path
 * @returns
 */
export declare function readBinary(path: string): Promise<Uint8Array>;
/**
 *
 * @param path
 * @param data
 * @returns
 */
export declare function writeBinary(path: string, data: Uint8Array): Promise<boolean>;
/**
 *
 * @param path
 * @returns
 */
export declare function readUtf8(path: string): Promise<string>;
/**
 *
 * @param path
 * @param data
 * @returns
 */
export declare function writeUtf8(path: string, data: string): Promise<boolean>;
/**
 *
 * @param data
 * @returns
 */
export declare function compress(data: Uint8Array): Promise<Uint8Array>;
/**
 *
 * @param data
 * @returns
 */
export declare function decompress(data: Uint8Array): Promise<Uint8Array>;
/**
 *
 * @param type
 * @param parts
 * @returns
 */
export declare function getGlobalPath(type: string, ...parts: any[]): string;
/**
 *
 * @param cmd
 * @param args
 * @returns
 */
export declare function sendIPC(cmd: string, ...args: any[]): any;
/**
 *
 * @param cmd
 * @param args
 * @returns
 */
export declare function sendAsyncIPC(cmd: string, ...args: any[]): void;
/**
 *
 * @param path
 * @returns
 */
export declare function readDir(path: string): Promise<string[]>;
/**
 *
 * @returns
 */
export declare function getCurDir(): string;
/**
 *
 * @returns
 */
export declare function createCanvas(): HTMLCanvasElement;
/**
 *
 * @param channel
 * @param listener
 */
export declare function defineElectronHandler(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void;
/**
 * @returns the content of package.json
 * @deprecated use instead: import pkg from "package.json";
 */
export declare function getPackage(): any;
/**
 * taken from live-server
 * https://github.com/tapio/live-server
 * @param host
 * @param port
 */
export declare function installHMR(host?: string, port?: string, reloadCallback?: Function): void;
/**
 *
 *
 */
declare type PartType = 'dirname' | 'basename' | 'filename' | 'extname';
export declare function getPathPart(pth: string, type: PartType): string;
/**
 *
 * @param path
 * @returns
 */
export declare function requireFile(path: any): any;
export {};
