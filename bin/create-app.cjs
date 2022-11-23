#!/usr/bin/env node
const {execSync} = require("child_process");
const {mkdirSync, rmSync, openSync, writeFileSync} = require("fs");
const {join} = require("path");
const packageJson = require('../package.json');

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = join(currentPath, projectName);
const repository = "https://github.com/Tracktor/create-boilerplate-vite-react-ts";

if (process.argv.length < 3) {
  console.log("\x1b[31m", "You have to provide name to your app.");
  console.log("For example:");
  console.log("    npx create-boilerplate-vite-react-ts my-app", "\x1b[0m");
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

const buildPackageJson = (packageJson, folderName) => {

  const {
    bin,
    keywords,
    license,
    homepage,
    repository,
    bugs,
    version,
    description,
    ...packageJsonFilter
  } = packageJson

  const newPackage = {...packageJsonFilter, name: folderName}

  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(newPackage, null, 2), 'utf8');
};

const main = async () => {
  try {
    console.log("\x1b[36m%s\x1b[0m", "Downloading files...");
    execSync(`git clone --depth 1 ${repository} ${projectPath}`);

    process.chdir(projectPath);

    console.log("\x1b[36m%s\x1b[0m", "Installing dependencies...");
    execSync("yarn install");

    console.log("\x1b[36m%s\x1b[0m", "Removing useless files");
    execSync("npx rimraf ./.git");
    rmSync(join(projectPath, "bin"), {recursive: true});
    rmSync(join(projectPath, ".circleci"), {recursive: true});
    rmSync(join(projectPath, "CHANGELOG.md"), {recursive: true});


    console.log("\x1b[36m%s\x1b[0m", "Create package.json");
    buildPackageJson(packageJson, projectName);

    console.log("\x1b[36m%s\x1b[0m", "Create empty README.md");
    openSync("README.md", 'w');

    console.log("\x1b[32m%s\x1b[0m", "Your app installation is done, this is ready to use !");
  } catch (error) {
    console.log(error);
  }
};

main().then();
