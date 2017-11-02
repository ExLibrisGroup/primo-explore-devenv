"use strict";
const fs = require("fs");
/**
 * operating system enum
 */
var OS;
(function (OS) {
    OS[OS["Windows_NT"] = 0] = "Windows_NT";
    OS[OS["Linux"] = 1] = "Linux";
    OS[OS["Darwin"] = 2] = "Darwin";
})(OS = exports.OS || (exports.OS = {}));
/**
 * The binary object base class
 */
class Binary {
    constructor(cdn) {
        this.cdn = cdn;
    }
    /**
     * @param ostype The operating system.
     * @returns The executable file type.
     */
    executableSuffix(ostype) {
        if (ostype == 'Windows_NT') {
            return '.exe';
        }
        else {
            return '';
        }
    }
    /**
     * @param ostype The operating system.
     * @returns The file name for the executable.
     */
    executableFilename(ostype) {
        return this.prefix() + this.version() + this.executableSuffix(ostype);
    }
    prefix() {
        return this.prefixDefault;
    }
    version() {
        return this.versionCustom;
    }
    suffix(ostype, arch) {
        return this.suffixDefault;
    }
    filename(ostype, arch) {
        return this.prefix() + this.version() + this.suffix(ostype, arch);
    }
    /**
     * @param ostype The operating system.
     * @returns The file name for the file inside the downloaded zip file
     */
    zipContentName(ostype) {
        return this.name + this.executableSuffix(ostype);
    }
    shortVersion(version) {
        return version.slice(0, version.lastIndexOf('.'));
    }
    /**
     * A base class method that should be overridden.
     */
    id() {
        return 'not implemented';
    }
    /**
     * A base class method that should be overridden.
     */
    versionDefault() {
        return 'not implemented';
    }
    /**
     * A base class method that should be overridden.
     */
    url(ostype, arch) {
        return 'not implemented';
    }
    /**
     * Delete an instance of this binary from the file system
     */
    remove(filename) {
        fs.unlinkSync(filename);
    }
}
exports.Binary = Binary;
//# sourceMappingURL=binary.js.map