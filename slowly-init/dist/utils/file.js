Object.defineProperty(exports, "__esModule", { value: true });
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType = exports.FileType || (exports.FileType = {}));
var FileSystemProviderErrorCode;
(function (FileSystemProviderErrorCode) {
    FileSystemProviderErrorCode["FileExists"] = "EntryExists";
    FileSystemProviderErrorCode["FileNotFound"] = "EntryNotFound";
    FileSystemProviderErrorCode["FileNotADirectory"] = "EntryNotADirectory";
    FileSystemProviderErrorCode["FileIsADirectory"] = "EntryIsADirectory";
    FileSystemProviderErrorCode["FileExceedsMemoryLimit"] = "EntryExceedsMemoryLimit";
    FileSystemProviderErrorCode["FileTooLarge"] = "EntryTooLarge";
    FileSystemProviderErrorCode["NoPermissions"] = "NoPermissions";
    FileSystemProviderErrorCode["Unavailable"] = "Unavailable";
    FileSystemProviderErrorCode["Unknown"] = "Unknown";
})(FileSystemProviderErrorCode = exports.FileSystemProviderErrorCode || (exports.FileSystemProviderErrorCode = {}));
class FileSystemProviderError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.FileSystemProviderError = FileSystemProviderError;
class NotImplementedError extends Error {
    constructor(message) {
        super('NotImplemented');
        if (message) {
            this.message = message;
        }
    }
}
exports.NotImplementedError = NotImplementedError;
