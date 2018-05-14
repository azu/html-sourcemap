import * as fs from "fs";
import * as assert from "assert";
import * as path from "path";
import { embedPositionToHTML } from "../src/index";

const fixturesDir = path.join(__dirname, "snapshots");
describe("Snapshot testing", () => {
    fs.readdirSync(fixturesDir)
        .map(caseName => {
            it(`Test ${caseName}`, function () {
                const fixtureDir = path.join(fixturesDir, caseName);
                const actualFilePath = path.join(fixtureDir, "input.html");
                const actualContent = fs.readFileSync(actualFilePath, "utf-8");
                const sourceFilePath = path.join(fixtureDir, "source.md");
                const sourceContent = fs.readFileSync(sourceFilePath, "utf-8");
                const expectedFilePath = path.join(fixtureDir, "output.html");

                const replacedContent = embedPositionToHTML(actualContent, sourceContent);
                if (process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, replacedContent);
                    this.skip();
                    return;
                }
                const expected = fs.readFileSync(expectedFilePath, "utf-8");
                assert.deepEqual(
                    replacedContent,
                    expected,
                    `
${fixtureDir}
`
                );
            });
        });
});
