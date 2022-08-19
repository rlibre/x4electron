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
/// <reference types="node/fs" />

import * as electron from "electron"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto";
import * as zlib from "zlib";

export let libs = {
	shell: electron.shell,
	renderer: electron.ipcRenderer,
	nativeImage: electron.nativeImage,
	path,
	fs,
	crypto,
	zlib,
}

/**
 * @example
 * {
 * 	'packed file' : 'report'
 * 	'json file': 'report.json'
 * }
 */

interface OpenSaveFilter {
	[name: string]: string | string[]; // 
}



/**
 * show openfile dialog
 * @param ext - string - ex: '.doc,.docx'
 * @param cb - callback to call when user select a file
 */

export function openFile(ext: OpenSaveFilter, cb: (filenames: string[]) => void, multiple = false) {

	const filters: any[] = [];
	for (const n in ext) {

		let f: string[];
		if (!Array.isArray(ext[n])) {
			f = [ext[n] as string];
		}
		else {
			f = ext[n] as string[];
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

/**
 * open saveas dialog
 * @param defFileName - string - proposed filename 
 * @param cb - callback to call when user choose the destination
 */

export function saveFile(defFileName: string, ext: OpenSaveFilter, cb: (filename: string) => void) {

	const filters: any[] = [];
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

/**
 * 
 * @param title 
 */

export function setWindowTitle(title: string) {
	sendAsyncIPC('setTitle', title);
}

/**
 * 
 * @param url 
 */

export function openExternal(url: string) {
	libs.shell.openExternal(url);
}

/**
 * 
 * @param path 
 * @returns 
 */

export function readBinary(path: string): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		libs.fs.readFile(path, (err, buff) => {
			if (err) { reject(err); }
			else { resolve(buff); }
		});
	});
}

/**
 * 
 * @param path 
 * @param data 
 * @returns 
 */

export function writeBinary(path: string, data: Uint8Array): Promise<boolean> {
	return new Promise((resolve, reject) => {
		libs.fs.writeFile(path, data, (err) => {
			if (err) { reject(err); }
			else { resolve(true); }
		});
	});
}

/**
 * 
 * @param path 
 * @returns 
 */

export function readUtf8(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		libs.fs.readFile(path, { encoding: 'utf8' }, (err, buff) => {
			if (err) { reject(err); }
			else { resolve(buff.toString()); }
		});
	});
}

/**
 * 
 * @param path 
 * @param data 
 * @returns 
 */

export function writeUtf8(path: string, data: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		libs.fs.writeFile(path, data, { encoding: 'utf8' }, (err) => {
			if (err) { reject(err); }
			else { resolve(true); }
		});
	});
}

/**
 * 
 * @param data 
 * @returns 
 */

export function compress(data: Uint8Array): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		libs.zlib.gzip(data, (err, Uint8Array) => {
			if (err) { reject(err); }
			else { resolve(Uint8Array); }
		});
	});
}

/**
 * 
 * @param data 
 * @returns 
 */

export function decompress(data: Uint8Array): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		libs.zlib.gunzip(data, (err, Uint8Array) => {
			if (err) { reject(err); }
			else { resolve(Uint8Array); }
		});
	});
}

/**
 * 
 * @param type 
 * @param parts 
 * @returns 
 */

export function getGlobalPath(type: string, ...parts ) {
	return libs.path.join( sendIPC('getPath', type), ...parts );
}

/**
 * 
 * @param cmd 
 * @param args 
 * @returns 
 */

export function sendIPC(cmd: string, ...args) {
	return libs.renderer.sendSync(cmd, ...args);
}

/**
 * 
 * @param cmd 
 * @param args 
 * @returns 
 */

export function sendAsyncIPC(cmd: string, ...args) {
	return libs.renderer.send(cmd, ...args);
}

/**
 * 
 * @param path 
 * @returns 
 */

export function readDir(path: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		libs.fs.readdir(path, (err, files) => {
			if (err) { reject(err); }
			else { resolve(files); }
		});
	});
}

/**
 * 
 * @returns 
 */

export function getCurDir(): string {
	return process.cwd();
}

/**
 * 
 * @returns 
 */

export function createCanvas() {
	return document.createElement('canvas');
}

/**
 * 
 * @param channel 
 * @param listener 
 */

export function defineElectronHandler(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
	libs.renderer.removeAllListeners(channel);
	libs.renderer.on(channel, listener);
}

/**
 * @returns the content of package.json
 * @deprecated use instead: import pkg from "package.json";
 */

export function getPackage() {
	return JSON.parse(libs.fs.readFileSync('package.json', 'utf8'));
}

/**
 * taken from live-server 
 * https://github.com/tapio/live-server
 * @param host 
 * @param port 
 */
export function installHMR(host = "127.0.0.1", port = "9876", reloadCallback?: Function ) {

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

		if( tm ) { clearTimeout(tm); }
		tm = setTimeout( () => {
			document.body.style.visibility = "unset";
		}, 50 );
	}

	const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
	const address = `${protocol}${host}:${port}/ws`;	
	const socket = new WebSocket(address);

	socket.onmessage = function (msg) {
		if (msg.data == 'reload') {
			if( reloadCallback ) {
				reloadCallback( );
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

/**
 * 
 * 
 */

type PartType = 'dirname' | 'basename' | 'filename' | 'extname';

export function getPathPart( pth: string, type: PartType ) : string {
	
	let els = path.parse( pth );
	switch ( type ) {
		case 'dirname': return els.dir;
		case 'basename': return els.base;
		case 'filename': return els.name;
		case 'extname': return els.ext;
	}
	
	return '';
}

/**
 * 
 * @param path 
 * @returns 
 */

export function requireFile( path ): any {
	return require( path );
}