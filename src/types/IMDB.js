const MediaInfo = require("./MediaInfo");

class Parser {
    /** CSV headers for IMDB medias. The `key`s beginning with an underscore
     *  are not present at `MediaInfo` instances.
     */
    static headers = {
        "export": null,
        "import": [
            { header: "Position"      , key: "position" },
            { header: "Const"         , key: "id.IMDB" },
            { header: "Created"       , key: "watchedDate" },
            { header: "Modified"      , key: "watchedDate" },
            { header: "Description"   , key: "_description" },
            { header: "Title"         , key: "originalTitle" },
            { header: "URL"           , key: "_url" },
            { header: "Title Type"    , key: "type" },
            { header: "IMDb Rating"   , key: "_imdbRating" },
            { header: "Runtime (mins)", key: "_runtime" },
            { header: "Year"          , key: "year" },
            { header: "Genres"        , key: "_genres" },
            { header: "Num Votes"     , key: "_numVotes" },
            { header: "Release Date"  , key: "_releaseDate" },
            { header: "Directors"     , key: "_directors" },
            { header: "Your Rating"   , key: "rating" },
            { header: "Date Rated"    , key: "ratedAt" },
        ]
    };

    static parse() {
        throw new Error("IMDB.parse not implemented");
    }

    constructor() {
        throw new Error("IMDB.Parser instances cannot be created.");
    }
}

class IMDB extends MediaInfo {
    static Parser = Parser;
}

module.exports = IMDB;

