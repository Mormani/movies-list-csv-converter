class MediaInfo {
    // #region Properties
    /** The type of media this information is for.
     *  @type {("movie"|"show"|"episode")}
     */
    #type = null;

    /** The IDs of the media on different sites.
     *  @type {{ TMDB: (string|number), IMDB: string, Trakt: (string|number) }}
     */
    #id = {
        TMDB: null,
        IMDB: null,
        Trakt: null
    };

    /** The title of the media in some language.
     *  @type {string}
     */
    #title = null;

    /** The original title of the media in its original language.
     *  @type {string}
     */
    #originalTitle = null;

    /** The date the media was released.
     *  If false, the media was not released.
     *  @type {Date|false}
     */
    #releaseDate = null;

    /** The year the media was released.
     *  If false, the media was not released.
     *  @type {number|false}
     */
    #year = null;

    /** The date the media was rated.
     *  If false, the media was not rated.
     *  @type {Date|false}
     */
    #ratedAt = null;

    /** The date the media was watched.
     *  If false, the media was not watched.
     *  @type {Date|false}
     */
    #watchedDate = null;

    /** The rating of the media in natural numbers from 0 to 10.
     *  If -1 the media was not rated.
     *  @type {number}
     */
    #rating = null;

    /** Whether the media is a favorite.
     *  @type {boolean}
     */
    #favorite = null;
    // #endregion

    constructor(type, ids, title, originalTitle, releaseDate, ratedAt, watchedDate, rating, favorite) {
        this.type = type;
        this.id = ids;
        this.title = title;
        this.originalTitle = originalTitle;
        this.releaseDate = releaseDate;
        this.year = this.releaseDate ? this.releaseDate.getFullYear() : false;
        this.ratedAt = ratedAt;
        this.watchedDate = watchedDate;
        this.rating = rating;
        this.favorite = favorite;
    }

    // #region Getters and Setters
    get type() {
        return this.#type;
    }

    set type(value) {
        validateType(value);
        this.#type = value;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = { ...this.#id, ...value };
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        validateTitle(value);
        this.#title = value;
    }

    get originalTitle() {
        return this.#originalTitle;
    }

    set originalTitle(value) {
        validateTitle(value);
        this.#originalTitle = value;
    }

    get releaseDate() {
        if (this.#releaseDate === false) return "";

        return this.#releaseDate;
    }

    set releaseDate(value) {
        if (value === false) {
            this.#releaseDate = false;
            return;
        }

        validateDate(value);
        this.#releaseDate = new Date(value);
    }

    get year() {
        if (this.#year === false) return "";

        return this.#year;
    }

    set year(value) {
        if (value === false) {
            this.#year = false;
            return;
        }

        if (typeof value !== "number") {
            throw new Error("Year must be a number");
        }

        this.#year = value;
    }

    get ratedAt() {
        if (this.#ratedAt === false) return "";

        return this.#ratedAt;
    }

    set ratedAt(value) {
        if (value === false) {
            this.#ratedAt = false;
            return;
        }

        validateDate(value);
        this.#ratedAt = new Date(value);
    }

    get watchedDate() {
        if (this.#watchedDate === false) return "";

        return this.#watchedDate;
    }

    set watchedDate(value) {
        if (value === false) {
            this.#watchedDate = false;
            return;
        }

        validateDate(value);
        this.#watchedDate = new Date(value);
    }

    get rating() {
        if (this.#rating === -1) return "";

        return this.#rating;
    }

    set rating(value) {
        if (typeof value !== "number") {
            throw new Error("Rating must be a number");
        }

        this.#rating = value;
    }

    get favorite() {
        return this.#favorite;
    }

    set favorite(value) {
        if (typeof value !== "boolean") {
            throw new Error("Favorite must be a boolean");
        }

        this.#favorite = value;
    }
    // #endregion
}

function validateType(type) {
    if (type !== "movie" && type !== "show" && type !== "episode") {
        throw new Error("Invalid type provided");
    }
}

function validateTitle(title) {
    if (typeof title !== "string") {
        throw new Error("Title must be a string");
    }

    if (title.length <= 0) {
        throw new Error("Title cannot be empty");
    }
}

function validateDate(date) {
    if (typeof date !== "string") {
        throw new Error("Date must be a string");
    }

    const parsedDate = Date.parse(date);

    if (isNaN(parsedDate)) {
        throw new Error("Invalid date provided");
    }
}

module.exports = MediaInfo;
