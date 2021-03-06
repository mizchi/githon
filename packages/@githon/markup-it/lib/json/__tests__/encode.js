const encode = require("../encode");
const BLOCKS = require("../../constants/blocks");

describe("encode", () => {
    let json;

    before(() => {
        json = encode(mock.paragraph);
    });

    it("should encode syntax name", () => {
        json.syntax.should.equal("mysyntax");
    });

    it("should encode tokens", () => {
        json.should.have.property("token");

        const doc = json.token;

        doc.tokens.should.have.lengthOf(1);

        const p = doc.tokens[0];
        p.type.should.equal(BLOCKS.PARAGRAPH);
        p.text.should.equal("Hello World");
        p.tokens.should.be.an.Array().with.lengthOf(2);
    });
});
