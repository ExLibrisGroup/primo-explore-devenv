"use strict";
const binary_1 = require("../binaries/binary");
/**
 * The downloaded binary is the binary with the list of versions downloaded.
 */
class DownloadedBinary extends binary_1.Binary {
    constructor(binary) {
        super();
        this.versions = [];
        this.binary = binary;
        this.name = binary.name;
        this.versionCustom = binary.versionCustom;
    }
    id() {
        return this.binary.id();
    }
}
exports.DownloadedBinary = DownloadedBinary;
//# sourceMappingURL=downloaded_binary.js.map