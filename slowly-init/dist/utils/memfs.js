var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const path = require("path");
class File {
    constructor(name) {
        this.type = file_1.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
    }
}
class Directory {
    constructor(name) {
        this.type = file_1.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.entries = new Map();
    }
}
class InMemoryFileSystemProvider {
    constructor() {
        this.root = new Directory('');
        // --- manage file events
        this._bufferedChanges = [];
    }
    // --- manage file metadata
    writeFileAnyway(resource, content, opts = { create: true, overwrite: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            let dirname = this._dirname(resource.path);
            let parts = dirname.split('/');
            let file = '';
            for (const part of parts) {
                if (part === '') {
                    continue;
                }
                file += `/${part}`;
                const uri = resource.with({
                    path: file
                });
                const stat = yield this.stat(uri, true);
                if (!stat) { //不存在
                    yield this.mkdir(uri);
                }
            }
            yield this.writeFile(resource, content, opts);
        });
    }
    stat(resource, silent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._lookup(resource, silent);
        });
    }
    readdir(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = this._lookupAsDirectory(resource, false);
            let result = [];
            for (const [name, child] of entry.entries) {
                result.push([name, child.type]);
            }
            return result;
        });
    }
    // --- manage file contents
    readFile(resource, silent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this._lookupAsFile(resource, silent).data;
            if (data) {
                return data;
            }
            throw new file_1.FileSystemProviderError('file not found', file_1.FileSystemProviderErrorCode.FileNotFound);
        });
    }
    writeFile(resource, content, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let basename = this._basename(resource.path);
            let parent = this._lookupParentDirectory(resource);
            let entry = parent.entries.get(basename);
            if (entry instanceof Directory) {
                throw new file_1.FileSystemProviderError('file is directory', file_1.FileSystemProviderErrorCode.FileIsADirectory);
            }
            if (!entry && !opts.create) {
                throw new file_1.FileSystemProviderError('file not found', file_1.FileSystemProviderErrorCode.FileNotFound);
            }
            if (entry && opts.create && !opts.overwrite) {
                throw new file_1.FileSystemProviderError('file exists already', file_1.FileSystemProviderErrorCode.FileExists);
            }
            if (!entry) {
                entry = new File(basename);
                parent.entries.set(basename, entry);
                this._fireSoon({ type: 1 /* ADDED */, resource });
            }
            entry.mtime = Date.now();
            entry.size = 0;
            entry.data = content;
            this._fireSoon({ type: 0 /* UPDATED */, resource });
        });
    }
    // --- manage files/folders
    rename(from, to, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts.overwrite && this._lookup(to, true)) {
                throw new file_1.FileSystemProviderError('file exists already', file_1.FileSystemProviderErrorCode.FileExists);
            }
            let entry = this._lookup(from, false);
            let oldParent = this._lookupParentDirectory(from);
            let newParent = this._lookupParentDirectory(to);
            let newName = this._basename(to.path);
            oldParent.entries.delete(entry.name);
            entry.name = newName;
            newParent.entries.set(newName, entry);
            this._fireSoon({ type: 2 /* DELETED */, resource: from }, { type: 1 /* ADDED */, resource: to });
        });
    }
    delete(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            let dirname = resource.with({
                path: this._dirname(resource.path)
            });
            let basename = this._basename(resource.path);
            let parent = this._lookupAsDirectory(dirname, false);
            if (!parent.entries.has(basename)) {
                throw new file_1.FileSystemProviderError('file not found', file_1.FileSystemProviderErrorCode.FileNotFound);
            }
            parent.entries.delete(basename);
            parent.mtime = Date.now();
            parent.size -= 1;
            this._fireSoon({ type: 0 /* UPDATED */, resource: dirname }, { resource, type: 2 /* DELETED */ });
        });
    }
    mkdir(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            let basename = this._basename(resource.path);
            let dirname = resource.with({
                path: this._dirname(resource.path)
            });
            let parent = this._lookupAsDirectory(dirname, false);
            let entry = new Directory(basename);
            parent.entries.set(entry.name, entry);
            parent.mtime = Date.now();
            parent.size += 1;
            this._fireSoon({ type: 0 /* UPDATED */, resource: dirname }, { type: 1 /* ADDED */, resource });
        });
    }
    walk(root, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof callback !== 'function') {
                throw new Error('walk callback must be function');
            }
            function innerWalk(root, parentPath) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield callback(root, path.join(parentPath, root.name), root instanceof Directory);
                    if (root instanceof Directory && root.entries) {
                        yield Promise.all(Array.from(root.entries.values()).map((entry) => {
                            return innerWalk(entry, path.join(parentPath, root.name));
                        }));
                    }
                });
            }
            innerWalk(root || this.root, '');
        });
    }
    _lookup(uri, silent) {
        let parts = uri.path.split('/');
        let entry = this.root;
        for (const part of parts) {
            if (!part) {
                continue;
            }
            let child;
            if (entry instanceof Directory) {
                child = entry.entries.get(part);
            }
            if (!child) {
                if (!silent) {
                    throw new file_1.FileSystemProviderError('file not found', file_1.FileSystemProviderErrorCode.FileNotFound);
                }
                else {
                    return undefined;
                }
            }
            entry = child;
        }
        return entry;
    }
    _lookupAsDirectory(uri, silent) {
        let entry = this._lookup(uri, silent);
        if (entry instanceof Directory) {
            return entry;
        }
        throw new file_1.FileSystemProviderError('file not a directory', file_1.FileSystemProviderErrorCode.FileNotADirectory);
    }
    _lookupAsFile(uri, silent) {
        let entry = this._lookup(uri, silent);
        if (entry instanceof File) {
            return entry;
        }
        throw new file_1.FileSystemProviderError('file is a directory', file_1.FileSystemProviderErrorCode.FileIsADirectory);
    }
    _lookupParentDirectory(uri) {
        const dirname = this._dirname(uri.path);
        return this._lookupAsDirectory(uri.with({
            path: dirname
        }), false);
    }
    _fireSoon(...changes) {
        this._bufferedChanges.push(...changes);
        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }
        this._fireSoonHandle = setTimeout(() => {
            this._bufferedChanges.length = 0;
        }, 5);
    }
    _basename(path) {
        path = this._rtrim(path, '/');
        if (!path) {
            return '';
        }
        return path.substr(path.lastIndexOf('/') + 1);
    }
    _dirname(path) {
        path = this._rtrim(path, '/');
        if (!path) {
            return '/';
        }
        return path.substr(0, path.lastIndexOf('/'));
    }
    _rtrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        const needleLen = needle.length, haystackLen = haystack.length;
        if (needleLen === 0 || haystackLen === 0) {
            return haystack;
        }
        let offset = haystackLen, idx = -1;
        while (true) {
            idx = haystack.lastIndexOf(needle, offset - 1);
            if (idx === -1 || idx + needleLen !== offset) {
                break;
            }
            if (idx === 0) {
                return '';
            }
            offset = idx;
        }
        return haystack.substring(0, offset);
    }
}
exports.default = InMemoryFileSystemProvider;
