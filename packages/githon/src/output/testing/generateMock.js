import tmp from "tmp";

import Book from "../../models/book";
import createMockFS from "../../fs/mock";
import parseBook from "../../parse/parseBook";
const generateBook = require("../generateBook").generateBook;

/**
 * Generate a book using a generator
 * And returns the path to the output dir.
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param {Generator}
 * @param {Map<String:String|Map>} files
 * @return {Promise<String>}
 */
function generateMock(Generator, files) {
    const fs = createMockFS(files);
    let book = Book.createForFS(fs);
    const dir = tmp.dirSync();

    book = book.setLogLevel("disabled");

    return parseBook(book)
        .then((resultBook) => {
            return generateBook(Generator, resultBook, {
                root: dir.name,
            });
        })
        .thenResolve(dir.name);
}

export default generateMock;