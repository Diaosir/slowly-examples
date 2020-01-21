var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const memfs_1 = require("../utils/memfs");
const fse = require('fs-extra');
const outputFileSync = require('output-file-sync');
const path = require("path");
const uri_1 = require("../utils/uri");
const glob = require('glob');
const downloadUrl = require('download');
class GithubService extends slowly_1.Service {
    constructor() {
        super(...arguments);
        this.localFileSystem = new memfs_1.default();
        this._gitDest = 'template-dist';
        this._gitUrl = 'https://github.com/Diaosir/slowly/archive/master.zip';
    }
    downloadGitRepo(template) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                downloadUrl(this._gitUrl, this._gitDest, {
                    extract: true,
                    strip: 1,
                    headers: {
                        accept: 'application/zip'
                    }
                })
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const list = glob.sync(`${this._gitDest}/**/*`, { dot: true });
                    yield Promise.all(list.map((filename) => __awaiter(this, void 0, void 0, function* () {
                        const stat = fse.statSync(filename);
                        const uri = uri_1.URI.parse(`loaclFs:${filename.replace(this._gitDest, '')}`);
                        if (stat.isDirectory()) {
                            yield this.localFileSystem.mkdir(uri);
                        }
                        else {
                            yield this.localFileSystem.writeFileAnyway(uri, fse.readFileSync(filename, { encoding: 'utf-8' }));
                        }
                    })));
                    fse.removeSync(this._gitDest);
                    resolve('success');
                }))
                    .catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getTemplate(dest, template) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.downloadGitRepo(template);
            const stat = yield this.localFileSystem.stat(uri_1.URI.parse(`loaclFs:${template}`));
            this._createFileToLocalFileSystem(dest, stat);
        });
    }
    _createFileToLocalFileSystem(dest, entry) {
        return __awaiter(this, void 0, void 0, function* () {
            fse.removeSync(dest);
            this.localFileSystem.walk(entry, (file, filename, isDirecttory) => __awaiter(this, void 0, void 0, function* () {
                if (isDirecttory) {
                    return;
                }
                outputFileSync(path.join(dest, filename), file.data, 'utf-8');
            }));
        });
    }
}
exports.default = GithubService;
