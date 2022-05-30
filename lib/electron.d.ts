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
import { FileStat, PathType, PartType, Host } from './host';
export * from './host';
export declare class ElectronHost extends Host {
    makePath(...els: string[]): string;
    readBinary(path: string): Promise<Uint8Array>;
    writeBinary(path: string, data: Uint8Array): Promise<boolean>;
    readUtf8(path: string): Promise<string>;
    writeUtf8(path: string, data: string): Promise<boolean>;
    compress(data: Uint8Array): Promise<Uint8Array>;
    decompress(data: Uint8Array): Promise<Uint8Array>;
    readLocalStorage(name: string): string;
    writeLocalStorage(name: string, data: string): void;
    stat(name: string): FileStat;
    readDir(path: string): Promise<string[]>;
    cwd(): string;
    get ipc(): Electron.IpcRenderer;
    getPath(type: PathType): string;
    getPathPart(pth: string, type: PartType): string;
    createCanvas: () => HTMLCanvasElement;
}
