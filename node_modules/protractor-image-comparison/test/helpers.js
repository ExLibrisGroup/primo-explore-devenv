'use strict';

const fs = require('fs');

module.exports = helpers();

function helpers () {
    return {
        fileExistSync: fileExistSync
    };

    /**
     * Sync check if a filepath exists
     *
     * @param {string} fp A file path
     * @return {boolean}
     */
    function fileExistSync(fp) {
        try {
            fs.accessSync(fp);
            return true;
        } catch (err) {
            return false;
        }
    }
};
