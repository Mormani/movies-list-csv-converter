const MediaInfo = require("./MediaInfo");
const TMDB = require("./TMDB");

class Parser {
    /** CSV headers for Notion medias. The `key`s beginning with an underscore
     *  are not present at `MediaInfo` instances.
     */
    static headers = {
        "export": new Map([
            ["type"       , "Tipo"],
            ["title"      , "Nome"],
            ["releaseDate", "Lançamento"],
            ["watchedDate", "Terminei"],
            ["rating"     , "Avaliação"],
            ["watched"    , "ㅤ"],
            ["favorite"   , "ㅤㅤ"]
        ]),
        "import": null
    }

    static async parse(row, headers) {
        const casting = {
            type: {
                "Filme": "movie",
                "Curta": "movie",
                "Série": "show"
            },
            bool: {
                "Yes": true,
                "No": false
            },
        };

        const rawType = row[headers.get("type")];
        const type = casting.type[rawType];

        const releaseDate = Parser.normalizeDate(row[headers.get("releaseDate")], "release");
        const watchedDate = Parser.normalizeDate(row[headers.get("watchedDate")], "watched");

        const rawWatched = row[headers.get("watched")];
        const watched = casting.bool[rawWatched];

        const rating = watched ? Parser.parseRating(row[headers.get("rating")]) : -1;
        const ratedAt = typeof rating === "number" && rating > 0 ? watchedDate : false;

        const rawFavorite = row[headers.get("favorite")];
        const favorite = casting.bool[rawFavorite];

        try {
            const parsed = new Notion(type, {}, row["Nome"], "---", releaseDate, ratedAt, watchedDate, rating, favorite);

            const { ids, originalTitle } = await TMDB.findInfos(parsed.type, parsed.title, parsed.year);

            parsed.id = ids;
            parsed.originalTitle = originalTitle;

            return parsed;
        } catch (error) {
            console.error("Error parsing Notion row:", row);
            console.error(error, "\n");
            return null;
        }
    }

    static parseRating(value) {
        if (typeof value !== "string" || value === "") {
            return -1;
        }

        const length = value.length;
        let rating = length;

        if (value === "∅") {
            rating = 0;
        } else if (value.endsWith("½")) {
            rating -= 0.5;
        }

        return rating;
    }

    static normalizeDate(value, type) {
        if (value === "") return false;

        const position = type === "release" ? 0 : 1;
        const separator = " → ";

        let oneDate = value;

        if (value.includes(separator)) {
            oneDate = value.split(separator)[position];
        }

        return oneDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1") + "T00:00";
    }

    constructor() {
        throw new Error("Notion.Parser instances cannot be created.");
    }
}

class Notion extends MediaInfo {
    static Parser = Parser;

    constructor(type, ids, title, originalTitle, releaseDate, ratedAt, watchedDate, rating, favorite) {
        super(type, ids, title, originalTitle, releaseDate, ratedAt, watchedDate, rating, favorite);
    }

    get rating() {
        return super.rating;
    }

    set rating(value) {
        super.rating = value === -1 ? value : value * 2;
    }
}

module.exports = Notion;
