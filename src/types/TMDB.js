const MediaInfo = require("./MediaInfo");

const API = {
    KEY:      process.env.TMDB_API_KEY      ?? "000",
    BASE_URL: process.env.TMDB_API_BASE_URL ?? "https://api.themoviedb.org",
    VERSION:  process.env.TMDB_API_VERSION  ?? "/3",
    LANGUAGE: process.env.TMDB_API_LANGUAGE ?? "pt-BR"
};

function createURL(path = "/", params = {}) {
    const url = new URL(API.VERSION + path, API.BASE_URL);

    const finalParams = new URLSearchParams({
        api_key: API.KEY,
        language: API.LANGUAGE,
        ...params
    });

    url.search = finalParams;

    return url;
}

class Parser {
    /** CSV headers for TMDB medias. The `key`s beginning with an underscore
     *  are not present at `MediaInfo` instances.
     */
    static headers = {
        "export": null,
        "import": null
    }

    static parse() {
        throw new Error("TMDB.parse not implemented");
    }

    constructor() {
        throw new Error("TMDB.Parser instances cannot be created.");
    }
}

class TMDB extends MediaInfo {
    static Parser = Parser;

    static async findInfos(type, title, year) {
        const path = type === "show" ? "/tv" : "/movie";
        const params = { query: title, year };
        const options = { method: "GET", headers: { accept: "application/json" }};

        const infos = {
            ids: {
                IMDB: null,
                TMDB: null
            },
            originalTitle: "---"
        }

        const searchURL = createURL("/search" + path, params);
        const searchRes = await fetch(searchURL, options)
            .then(res => res.json())
            .catch(error => console.error(error));

        if (searchRes.results === undefined || searchRes.total_results === 0) {
            console.error("No results found for:", title, year);
            return infos;
        }

        const { id, original_title, original_name } = searchRes.results[0];

        infos.ids.TMDB = id;
        infos.originalTitle = type === "show" ? original_name : original_title;

        const detailsURL = createURL(path + "/" + id, { append_to_response: "external_ids" });
        const detailsRes = await fetch(detailsURL, options)
            .then(res => res.json())
            .catch(error => console.error(error));

        infos.ids.IMDB = detailsRes.external_ids.imdb_id;

        return infos;
    }
}

module.exports = TMDB;
