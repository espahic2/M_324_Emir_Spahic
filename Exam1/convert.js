import fs from "fs";
import { marked } from "marked";

const markdown = fs.readFileSync("07_clean_code.md", "utf-8");
const html = marked.parse(markdown);

fs.writeFileSync("07_clean_code.html", html);
console.log("07_clean_code.html generated.");
