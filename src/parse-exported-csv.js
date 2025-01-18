const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");

const CSV = require("csv/sync");

const IMDB = require("./types/IMDB");
const Notion = require("./types/Notion");
const TMDB = require("./types/TMDB");
const Trakt = require("./types/Trakt");

function validatePath(file) {
    if (file === "") {
        throw new Error("No file path provided");
    }

    const normalized = path.normalize(file);
    const exportDirPattern = /data\\export\\.+\\.+\.csv$/;

    if (!exportDirPattern.test(normalized)) {
        throw new Error("File provided must be an exported one at ./data/export/");
    }

    const finalPath = path.join(process.cwd(), normalized);

    if (path.extname(finalPath) !== ".csv") {
        throw new Error("File must be a CSV file");
    }

    return finalPath;
}

function readFile(inputFilePath) {
    const finalPath = validatePath(inputFilePath);

    const content = fs.readFileSync(finalPath, "utf-8");
    const type = finalPath.split(path.sep).at(-2);

    return { content, type };
}

async function normalizeFields(data, website) {
    let Parser = null;

    if      (website === "IMDB")   Parser = IMDB.Parser;
    else if (website === "Notion") Parser = Notion.Parser;
    else if (website === "TMDB")   Parser = TMDB.Parser;
    else if (website === "Trakt")  Parser = Trakt.Parser;
    else                           throw new Error("Invalid website provided");

    const fields = new Array(data.length);

    for (let i = 0; i < data.length; i++) {
        fields[i] = await Parser.parse(data[i], Parser.headers.export);
        console.log("Normalizing:", `${i + 1} / ${data.length}`);
    }

    return fields;
}

function filterData(data, options) {
    const { watched, favorites, after } = options;

    const afterDate = new Date(after);

    if (after !== "" && afterDate.toString() === "Invalid Date") {
        throw new Error("Invalid date provided, it must be in ISO format.");
    }

    const filtered = data.filter((entry) => {
        if (watched && !entry.watchedDate) {
            return false;
        }

        if (favorites && !entry.favorite) {
            return false;
        }

        const watchedBeforeDate = watched && entry.watchedDate && entry.watchedDate < afterDate;
        const releasedBeforeDate = !watched && entry.releaseDate && entry.releaseDate < afterDate;

        // If watched, filter by watched date, else filter by release date.
        if (afterDate && (watchedBeforeDate || releasedBeforeDate)) {
            return false;
        }

        return true;
    });

    return filtered;
}

async function loadExported(args) {
    const { content, type } = readFile(args["exported"]);

    const data = CSV.parse(content, {
        columns: true,
        skip_empty_lines: true
    });

    const normalizedData = await normalizeFields(data, type);

    if (args["watched"] || args["favorites"] || args["after-date"]) {
        const options = {
            watched: args["watched"],
            favorites: args["favorites"],
            after: args["after-date"]
        }

        return filterData(normalizedData, options);
    }

    return normalizedData;
}

module.exports = loadExported;
