const MediaInfo = require("./MediaInfo");

class Parser {
    /** CSV headers for Trakt medias. The `key`s beginning with an underscore
     *  are not present at `MediaInfo` instances.
     */
    static headers = {
        "export": null,
        "import": null
    }

    static parse() {
        throw new Error("Trakt.parse not implemented");
    }

    constructor() {
        throw new Error("Trakt.Parser instances cannot be created.");
    }
}

class Trakt extends MediaInfo {
    static Parser = Parser;
}

module.exports = Trakt;
