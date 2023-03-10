#!/usr/bin/env node
const yargs = require('yargs')
const { join } = require("path");
const { execSync } = require("child_process");
const { mkdirSync, rmSync, openSync, writeFileSync, close, writeSync } = require("fs");
const packageJson = require('../package.json');

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = join(currentPath, projectName);
const repository = packageJson.repository.url;

const AXIOS_PARAM = "axios";
const I18NEXT_PARAM = "i18next";
const REACT_QUERY_PARAM = "react-query";

if (process.argv.length < 3) {
  console.log("\x1b[31m", "You have to provide name to your app.");
  console.log("For example: ");
  console.log("npx create-boilerplate-vite-react-ts YOUR_APP_NAME", "\x1b[0m");
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

const buildPackageJson = ({packageJson, folderName, argv}) => {
  const {
    bin,
    keywords,
    homepage,
    repository,
    bugs,
    version,
    description,
    ...packageJsonFilter
  } = packageJson

  // Manage dependencies
  const {
    yargs,
    [!argv?.[AXIOS_PARAM] && "axios"]: axiosRemoved,
    [!argv?.[I18NEXT_PARAM] && "i18next"]: i18nextRemoved,
    [!argv?.[I18NEXT_PARAM] && "react-i18next"]: reactI18nextRemoved,
    [!argv?.[I18NEXT_PARAM] && "i18next-browser-languagedetector"]: i18nextBrowserLanguageDetectorRemoved,
    [!argv?.[REACT_QUERY_PARAM] && "@tanstack/react-query"]: reactQueryRemoved,
    ...dependenciesFilter
  } = packageJson.dependencies

  const newPackage = {
    ...packageJsonFilter,
    name: folderName,
    license: "UNLICENSED",
    dependencies: {
      ...dependenciesFilter,
    }
  }

  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(newPackage, null, 2), 'utf8');
};

const removeUselessFiles = () => {
  execSync("npx rimraf ./.git");
  rmSync(join(projectPath, ".github"), { recursive: true });
  rmSync(join(projectPath, ".circleci"), { recursive: true});
  rmSync(join(projectPath, "bin"), { recursive: true });
  rmSync(join(projectPath, "CHANGELOG.md"), { recursive: true });


  // Remove i18next files
  if (!yargs.argv?.[I18NEXT_PARAM]) {
    rmSync(join(projectPath, "src/config/i18next.ts"), { recursive: true });
    rmSync(join(projectPath, "src/locales/en.ts"), { recursive: true });
    rmSync(join(projectPath, "src/locales/fr.ts"), { recursive: true });
    rmSync(join(projectPath, "src/types/i18next.d.ts"), { recursive: true });
  }

  // Remove axios files
  if (!yargs.argv?.[AXIOS_PARAM]) {
    rmSync(join(projectPath, "src/config/axios.ts"), { recursive: true });
  }

  // Remove react query files
  if (!yargs.argv?.[REACT_QUERY_PARAM]) {
    rmSync(join(projectPath, "src/config/reactQuery.ts"), { recursive: true });
  }
};

const getAppData = () => {
  let data = [];

  if (yargs.argv?.[AXIOS_PARAM]) {
    data.push(`import "@/config/axios";\n`)
  }

  if (yargs.argv?.[I18NEXT_PARAM]) {
    data.push(`import "@/config/i18next";\n`)
  }

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    data.push(
      `import { QueryClientProvider } from "@tanstack/react-query";\n` +
      `import reactQuery from "@/config/reactQuery";\n\n` +

      `const App = () => <QueryClientProvider client={reactQuery}>${packageJson.description}</QueryClientProvider>;`
    )
  } else {
    data.push(`const App = () => <>${packageJson.description}</>;`);
  }

  data.push(`\n\nexport default App;`)

  return data.join("") + "\n";
}

const generateAppFile = () => {
  const file = "src/App.tsx";
  const fd = openSync(file, 'w+');
  const data = getAppData();
  const buffer = Buffer.from(data);

  writeSync(fd, buffer, 0, buffer.length, 0); //write new data
  close(fd);
};

const main = async () => {
  try {
    console.log("\x1b[36m%s\x1b[0m", "Clear npx cache...");
    execSync("rm -rf ~/.npm/_npx");

    // Download files
    console.log("\x1b[36m%s\x1b[0m", "Downloading files...");
    execSync(`git clone --depth 1 ${repository} ${projectPath}`);

    // Change directory
    process.chdir(projectPath);

    // Build package.json
    console.log("\x1b[36m%s\x1b[0m", "Create package.json...");
    buildPackageJson({packageJson, projectName, argv: yargs.argv});

    // Install dependencies
    console.log("\x1b[36m%s\x1b[0m", "Installing dependencies...");
    execSync("yarn install");

    // Generate App.tsx
    console.log("\x1b[36m%s\x1b[0m", "Generate App.tsx...");
    generateAppFile();

    // Remove useless files
    console.log("\x1b[36m%s\x1b[0m", "Clean up unused file...");
    removeUselessFiles();

    // Create empty README.md
    console.log("\x1b[36m%s\x1b[0m", "Create empty README.md...");
    openSync("README.md", 'w');

    // Done
    console.log("\x1b[32m%s\x1b[0m", "Your application is ready, enjoy to use !");
  } catch (error) {
    console.log(error);
  }
};

main().then();
