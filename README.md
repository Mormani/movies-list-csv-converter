# Movies list CSV Converter
This is a simple NodeJS application that parses a CSV file of Movies, Series and Episodes exported from websites, converts to well know [CSV templates](./data/templates/) and after that you can import at some websites.

- [Websites supported](#websites-supported)
- [How to use](#how-to-use)
    - [Parameters](#parameters)
      - [`--exported` (required)](#--exported-required)
      - [`--to-import` (optional)](#--to-import-optional)
      - [`--watched` or `--no-watched` (optional)](#--watched-or---no-watched-optional)
      - [`--favorites` or `--no-favorites` (optional)](#--favorites-or---no-favorites-optional)
      - [`--after-date` (optional)](#--after-date-optional)
  - [Concerns](#concerns)


## Websites supported
[IMDB](https://imdb.com), [TMDB](https://themoviedb.org), [Trakt](https://trakt.tv) and Custom [Notion](https://notion.so) Database are the websites that are going to be supported. Here is the current status of the project:

- Implemented parsers of exported files
    - [ ] IMDB
    - [ ] TMDB
    - [ ] Trakt (exported using [Trakt.tv backup](https://darekkay.com/blog/trakt-tv-backup/) from Darek Kay)
    - [x] [Custom Notion Database](./src/types/Notion.js#L21)
- Implemented converters to import files
    - [x] [IMDB](./src/types/IMDB.js#L9)
    - [ ] Trakt

## How to use
1. Export your list from the website you want to convert;
2. Clone this repository;
3. Install the dependencies with `npm install`;
4. Replace the variables at the [env file](./.env.example) with your own and rename it to `.env`;
5. Run the command bellow replacing the parameters.

```bash
node index.js -e <exported_csv_file> [-i <website_to_import>] [-w] [-f] [-a <iso_date>]
```

### Parameters

#### `--exported` (required)
Short form: `-e`.

Path of the exported CSV file from a website, might be saved at [./data/export/](./data/export/) inside the directory of the website.

#### `--to-import` (optional)
Short form: `-i`. <br>
Default: `IMDB`.

Website to import the converted CSV file, must be `IMDB` or `Trakt` and the file is going to be saved at [./data/import/](./data/import/) inside the directory of the website.

#### `--watched` or `--no-watched` (optional)
Short form: `-w`. <br>
Default: `--watched`.

Whether filter only watched items.

#### `--favorites` or `--no-favorites` (optional)
Short form: `-f`. <br>
Default: `--no-favorites`.

Whether filter only favorites items.

#### `--after-date` (optional)
Default: `""` (empty string).

Filter only items after a specific date, must be in ISO format.

### Concerns
- Since Notion uses a custom database, you need to replace the map values at [`Notion.Parser.headers.exported`](./src/types/Notion.js#L9) to match the columns of your database.
- Some data might be missing important informations to identify the media, so you can use [`TMDB.findInfos`](./src/types/TMDB.js#L45) to find the media by type, name and year, after that is returned `originalTitle`, `ids.TMDB` and `ids.IMDB`.
- Dates range in Notion are split by an arrow and spaces (` → `), so you can use [`Notion.Parser.normalizeDate`](./src/types/Notion.js#L82) to get only one date.
- Most of websites rate the media from 0 to 10, don't forget to convert if needed.
