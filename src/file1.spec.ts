import { expect } from "chai";
import { toTest } from "./file1";
describe("Testing FileToInclude", () => {
    it("should test boolean", () => {
        toTest();
        const x = true;
        expect(x).to.equal(true);
    });
});