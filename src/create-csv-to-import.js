const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");

const CSV = require("csv/sync");

const IMDB = require("./types/IMDB");
const Notion = require("./types/Notion");
const TMDB = require("./types/TMDB");
const Trakt = require("./types/Trakt");

function getWebsiteHeaders(website) {
    let headers = null;

    if      (website === "IMDB")   headers = IMDB.Parser.headers.import;
    else if (website === "Notion") headers = Notion.Parser.headers.import;
    else if (website === "TMDB")   headers = TMDB.Parser.headers.import;
    else if (website === "Trakt")  headers = Trakt.Parser.headers.import;
    else                           throw new Error("Invalid site provided");

    return headers;
}

function validatePath(site, watched, favorites, afterDate) {
    const isWatchedList = watched ? "_watched" : "";
    const isFavoritesList = favorites ? "_favorites" : "";

    const from = afterDate !== "" ? `_from_${afterDate}_to_` : "";
    const today = (new Date()).toISOString().split("T")[0];

    const filename = `${site}${isWatchedList}${isFavoritesList}${from}_${today}.csv`;

    const importFile = path.join(process.cwd(), "data", "import", site, filename);

    if (fs.existsSync(importFile)) {
        throw new Error("Import file already exists, please delete or rename it.");
    }

    return importFile;
}

function createImport(data, args)  {
    const headers = getWebsiteHeaders(args["to-import"]);
    const filePath = validatePath(args["to-import"], args["watched"], args["favorites"], args["after-date"]);

    const dataString = CSV.stringify(data, {
        header: true,
        columns: headers,
        cast: {
            date: (value) => value.toISOString().split("T")[0]
        }
    });

    fs.writeFileSync(filePath, dataString, "utf-8");

    return filePath;
}

module.exports = createImport;
