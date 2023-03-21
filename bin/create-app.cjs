#!/usr/bin/env node
const yargs = require("yargs")
const {join} = require("path");
const {execSync} = require("child_process");
const {mkdirSync, rmSync, openSync, writeFileSync, close, writeSync, appendFileSync} = require("fs");
const packageJson = require("../package.json");
const eslintrcJson = require("../.eslintrc.json");

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = join(currentPath, projectName);
const repository = packageJson.repository.url;

const ENCODED_FILE = "utf8";

const AXIOS_PARAM = "axios";
const I18NEXT_PARAM = "i18next";
const REACT_QUERY_PARAM = "react-query";
const REACT_ROUTER_PARAM = "react-router";

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  return  pkgSpec.split('/')[0];
}

const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
const pkgManager = pkgInfo ? pkgInfo : 'npm';

if (process.argv.length < 3) {
  console.log("\x1b[31m", "You have to provide name to your app.");
  console.log("For example: ");
  console.log(pkgManager + " create-boilerplate-vite-react-ts YOUR_APP_NAME", "\x1b[0m");
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

const buildPackageJson = ({packageJson, argv}) => {
  // Filters package.json
  const {
    bin,
    keywords,
    homepage,
    repository,
    bugs,
    version,
    description,
    ...packageJsonFilter
  } = packageJson;

  // Filters dependencies
  const {
    yargs,
    [!argv?.[AXIOS_PARAM] && "axios"]: axiosRemoved,
    [!argv?.[I18NEXT_PARAM] && "i18next"]: i18nextRemoved,
    [!argv?.[I18NEXT_PARAM] && "react-i18next"]: reactI18nextRemoved,
    [!argv?.[I18NEXT_PARAM] && "i18next-browser-languagedetector"]: i18nextBrowserLanguageDetectorRemoved,
    [!argv?.[REACT_QUERY_PARAM] && "@tanstack/react-query"]: reactQueryRemoved,
    ...dependenciesFilter
  } = packageJson.dependencies;

  // Filters scripts
  const {
    create,
    ...scriptFilter
  } = packageJson.scripts

  const newPackage = {
    ...packageJsonFilter,
    name: argv._[0],
    license: "UNLICENSED",
    dependencies: {
      ...dependenciesFilter,
    },
    scripts: {
      ...scriptFilter,
    }
  };

  writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(newPackage, null, 2), ENCODED_FILE);
};

const buildEslintJson = (eslintrcJson) => {
  const {rules, ...eslintrcJsonFilter} = eslintrcJson

  writeFileSync(`${process.cwd()}/.eslintrc.json`, JSON.stringify(eslintrcJsonFilter, null, 2), ENCODED_FILE);
};

const buildSetupTest = () => {

  if (yargs.argv?.[I18NEXT_PARAM]) {
    const data = `\n` +
      `// Mock translation` + `\n` +
      `vi.mock("react-i18next", () => ({` + `\n` +
      `  useTranslation: () => ({` + `\n` +
      `    i18n: {` + `\n` +
      `      changeLanguage: () => new Promise(() => {}),` + `\n` +
      `    },` + `\n` +
      `    t: (str: string) => str,` + `\n` +
      `  }),` + `\n` +
      `}));`;

    appendFileSync("src/config/setupTests.ts", data);
  }
};


const removeUselessFiles = () => {
  execSync("npx rimraf ./.git");
  rmSync(join(projectPath, ".github"), {recursive: true});
  rmSync(join(projectPath, ".circleci"), {recursive: true});
  rmSync(join(projectPath, "bin"), {recursive: true});
  rmSync(join(projectPath, "CHANGELOG.md"), {recursive: true});
  rmSync(join(projectPath, "yarn.lock"), {recursive: true});
  rmSync(join(projectPath, "src/types/dependencies.d.ts"), {recursive: true});


  // Remove i18next files
  if (!yargs.argv?.[I18NEXT_PARAM]) {
    rmSync(join(projectPath, "src/config/i18next.ts"), {recursive: true});
    rmSync(join(projectPath, "src/locales/en.ts"), {recursive: true});
    rmSync(join(projectPath, "src/locales/fr.ts"), {recursive: true});
    rmSync(join(projectPath, "src/types/i18next.d.ts"), {recursive: true});
  }

  // Remove axios files
  if (!yargs.argv?.[AXIOS_PARAM]) {
    rmSync(join(projectPath, "src/config/axios.ts"), {recursive: true});
  }

  // Remove react query files
  if (!yargs.argv?.[REACT_QUERY_PARAM]) {
    rmSync(join(projectPath, "src/config/reactQuery.ts"), {recursive: true});
  }

  // Remove react router dom files
  if (!yargs.argv?.[REACT_ROUTER_PARAM]) {
    rmSync(join(projectPath, "src/components/Utils/Router.tsx"), {recursive: true});
    rmSync(join(projectPath, "src/constants/routes.ts"), {recursive: true});
    rmSync(join(projectPath, "src/pages/Contact.tsx"), {recursive: true});
    rmSync(join(projectPath, "src/pages/Home.tsx"), {recursive: true});
  }
};

const getAppData = () => {
  let data = [];
  const children = yargs.argv?.[REACT_ROUTER_PARAM] ? "<Router />" : packageJson.description

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    data.push(`import { QueryClientProvider } from "@tanstack/react-query";\n`)
  }

  if (yargs.argv?.[REACT_ROUTER_PARAM]) {
    data.push(`import Router from "@/components/Utils/Router";\n`)
  }

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    data.push(`import reactQuery from "@/config/reactQuery";\n`)
  }

  if (yargs.argv?.[AXIOS_PARAM]) {
    data.push(`import "@/config/axios";\n`)
  }

  if (yargs.argv?.[I18NEXT_PARAM]) {
    data.push(`import "@/config/i18next";\n`)
  }

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    data.push(
      `\nconst App = () => (` +
      `\n  <QueryClientProvider client={reactQuery}>` +
      `\n    ${children}` +
      `\n  </QueryClientProvider>` +
      `\n);`
    )
  } else {
    const breakLine = data.length === 0 ? "" : "\n";
    data.push(`${breakLine}const App = () => <>${children}</>;`);
  }

  data.push(`\n\nexport default App;`)

  return data.join("") + "\n";
}

const buildAppFile = () => {
  const file = "src/App.tsx";
  const fd = openSync(file, "w+");
  const data = getAppData();
  const buffer = Buffer.from(data);

  writeSync(fd, buffer, 0, buffer.length, 0); //write new data
  close(fd);
};

const installDependencies = () => {
  const installDependency = pkgManager === "npm" ? "install" : "add";

  execSync(`${pkgManager} install`);

  if (yargs.argv?.[AXIOS_PARAM]) {
    execSync(`${pkgManager} ${installDependency} axios`);
  }

  if (yargs.argv?.[I18NEXT_PARAM]) {
    execSync(`${pkgManager} ${installDependency} i18next`);
    execSync(`${pkgManager} ${installDependency} react-i18next`);
    execSync(`${pkgManager} ${installDependency} i18next-browser-languagedetector`);
  }

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    execSync(`${pkgManager} ${installDependency} @tanstack/react-query`);
  }

  if (yargs.argv?.[REACT_ROUTER_PARAM]) {
    execSync(`${pkgManager} ${installDependency} react-router-dom`);
  }
};

const main = async () => {
  try {
    // Clear npx cache
    console.log("\x1b[36m%s\x1b[0m", "Clear npx cache...");
    execSync("rm -rf ~/.npm/_npx");

    // Download files
    console.log("\x1b[36m%s\x1b[0m", "Downloading files...");
    execSync(`git clone --depth 1 ${repository} ${projectPath}`);

    // Change directory
    process.chdir(projectPath);

    // Create package.json & .eslintrc.json
    console.log("\x1b[36m%s\x1b[0m", "Create package.json & .eslintrc.json...");
    buildPackageJson({packageJson, argv: yargs.argv});


    // Remove useless files
    console.log("\x1b[36m%s\x1b[0m", "Clean up unused file...");
    removeUselessFiles();

    // Install dependencies
    console.log("\x1b[36m%s\x1b[0m", "Installing dependencies...");
    installDependencies();

    // Generate Files.tsx
    console.log("\x1b[36m%s\x1b[0m", "Generate Files...");
    buildAppFile();
    buildEslintJson(eslintrcJson);
    buildSetupTest();

    // Create empty README.md
    console.log("\x1b[36m%s\x1b[0m", "Create empty README.md...");
    openSync("README.md", "w");

    // Done
    console.log("\x1b[32m%s\x1b[0m", "Your application is ready, enjoy to use !");
  } catch (error) {
    console.log(error);
  }
};

main().then();
