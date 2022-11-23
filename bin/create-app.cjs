#!/usr/bin/env node
const { execSync } = require("child_process");
const { mkdirSync, rmdirSync } = require("fs");
const { join } = require("path");

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = join(currentPath, projectName);
const repository = "https://github.com/Tracktor/boilerplate-vite-react-ts";

if (process.argv.length < 3) {
  console.log("\x1b[31m", "You have to provide name to your app.");
  console.log("For example:");
  console.log("    npx boilerplate-vite-react-ts my-app", "\x1b[0m");
  process.exit(1);
}

try {
  mkdirSync(projectPath);
} catch (error) {
  if (error?.code === "EEXIST") {
    console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
  } else {
    console.log(error);
  }
  process.exit(1);
}

async function main() {
  try {
    console.log("Downloading files...");
    execSync(`git clone --depth 1 ${repository} ${projectPath}`);

    process.chdir(projectPath);

    console.log("Installing dependencies...");
    execSync("yarn install");

    console.log("Removing useless files");
    execSync("npx rimraf ./.git");
    rmdirSync(join(projectPath, "bin"), { recursive: true });

    console.log("The installation is done, this is ready to use !");
  } catch (error) {
    console.log(error);
  }
}

main().then();
