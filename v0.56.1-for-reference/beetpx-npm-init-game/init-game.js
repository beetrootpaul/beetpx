#!/usr/bin/env node

'use strict';

const path = require("path");
const fs = require("fs");

const expectedNodeMinVersionMajor = 18;
const currentNodeVersionMajor = process.versions.node?.split('.')?.[0];

if (isNaN(Number(currentNodeVersionMajor)) || Number(currentNodeVersionMajor) < expectedNodeMinVersionMajor) {
    console.warn(
        `This tool is supposed to be run under Node.js ${expectedNodeMinVersionMajor} or newer. Currently run under Node.js version: ${process.version}.`
    );
    process.exit(1);
}

if (process.argv.length < 3) {
    console.warn("Project name has to be provided as a first argument.");
    process.exit(1);
}
const projectName = process.argv[2];

const projectNameConstraints = /^[-_0-9a-zA-Z]+$/;
if (!projectNameConstraints.test(projectName)) {
    console.warn(`Project name has to match a following RegExp: ${projectNameConstraints.toString()}`);
    process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
if (fs.existsSync(projectPath)) {
    console.warn(`Cannot create the project. Its folder already exists: ${projectPath}`);
    process.exit(1);
}

console.log(`Creating a new BeetPx project in: ${projectPath} ...`);
fs.mkdirSync(projectPath);

fs.cpSync(
    path.resolve(__dirname, "initial-project-files"),
    projectPath,
    {recursive: true},
);

// A fix for `npm publish` not including the `.gitignore`: let's name it differently
// (here: `_gitignore`) and then rename back to `.gitignore` during the project init.
fs.renameSync(
    path.resolve(projectPath, "_gitignore"),
    path.resolve(projectPath, ".gitignore"),
);

injectProjectName(projectName, path.resolve(projectPath, "package.json"));
injectProjectName(projectName, path.resolve(projectPath, "README.md"));
injectProjectName(projectName, path.resolve(projectPath, "src/main.ts"));

console.log(`Done!`);

/////////////////////////////////////////////////////////////////////////////

function injectProjectName(projectName, filePath) {
    let content = fs.readFileSync(filePath, {encoding: "utf8"});
    content = content.replace(/__PROJECT_NAME__/g, projectName);
    fs.writeFileSync(filePath, content, {encoding: "utf8"});
}
