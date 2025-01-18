require("dotenv").config();

const { parseArgs } = require("node:util");

const loadExported = require("./src/parse-exported-csv");
const createImport = require("./src/create-csv-to-import");

(async function main() {
    const options = {
        "exported": {
            type: "string",
            short: "e",
            default: ""
        },
        "to-import": {
            type: "string",
            short: "i",
            default: "IMDB"
        },
        "after-date": {
            type: "string",
            default: ""
        },
        "watched": {
            type: "boolean",
            short: "w",
            default: true
        },
        "favorites": {
            type: "boolean",
            short: "f",
            default: false
        }
    };

    const parsedArgs = parseArgs({ options, allowNegative: true });
    const args = parsedArgs.values;

    let exported = null;

    try {
        exported = await loadExported(args);
    } catch (error) {
        console.error("Error loading exported file:", error);
        console.info("Parsed arguments:", args);

        process.exit(1);
    }

    let importFilePath = null;

    try {
        importFilePath = createImport(exported, args);
    } catch (error) {
        console.error("Error creating import file:", error);
        console.log("Parsed arguments:", args);

        process.exit(1);
    }

    console.log("\nImport file created at:", importFilePath);
})();
