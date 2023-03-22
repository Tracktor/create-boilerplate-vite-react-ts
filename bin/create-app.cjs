#!/usr/bin/env node
const yargs = require("yargs")
const {join} = require("path");
const {execSync} = require("child_process");
const {mkdirSync, rmSync, openSync, writeFileSync, close, writeSync, appendFileSync} = require("fs");
const packageJson = require("../package.json");
const eslintrcJson = require("../.eslintrc.json");

const ENCODED_FILE = "utf8";

const PROJECT_NAME = process.argv[2];
const CURRENT_PATH = process.cwd();
const PROJECT_PATH = join(CURRENT_PATH, PROJECT_NAME);
const REPOSITORY_URL = packageJson.repository.url;
const PACKAGE_INFO = pkgFromUserAgent(process.env.npm_config_user_agent);
const PACKAGE_MANAGER = PACKAGE_INFO ? PACKAGE_INFO : 'npm';

// Optional parameters
const AXIOS_PARAM = "axios";
const I18NEXT_PARAM = "i18next";
const REACT_QUERY_PARAM = "react-query";
const REACT_ROUTER_PARAM = "react-router";

if (process.argv.length < 3) {
  console.log("\x1b[31m", "You have to provide name to your app.");
  console.log("For example: ");
  console.log(PACKAGE_MANAGER + " create boilerplate-vite-react-ts YOUR_APP_NAME", "\x1b[0m");
  process.exit(1);
}

try {
  mkdirSync(PROJECT_PATH);
} catch (error) {
  if (error?.code === "EEXIST") {
    console.log(`The file ${PROJECT_NAME} already exist in the current directory, please give it another name.`);
  } else {
    console.log(error);
  }
  process.exit(1);
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  return  pkgSpec.split('/')[0];
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
  rmSync(join(PROJECT_PATH, ".github"), {recursive: true});
  rmSync(join(PROJECT_PATH, ".circleci"), {recursive: true});
  rmSync(join(PROJECT_PATH, "bin"), {recursive: true});
  rmSync(join(PROJECT_PATH, "CHANGELOG.md"), {recursive: true});
  rmSync(join(PROJECT_PATH, "src/types/dependencies.d.ts"), {recursive: true});


  // Remove i18next files
  if (!yargs.argv?.[I18NEXT_PARAM]) {
    rmSync(join(PROJECT_PATH, "src/config/i18next.ts"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/locales/en.ts"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/locales/fr.ts"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/types/i18next.d.ts"), {recursive: true});
  }

  // Remove axios files
  if (!yargs.argv?.[AXIOS_PARAM]) {
    rmSync(join(PROJECT_PATH, "src/config/axios.ts"), {recursive: true});
  }

  // Remove react query files
  if (!yargs.argv?.[REACT_QUERY_PARAM]) {
    rmSync(join(PROJECT_PATH, "src/config/reactQuery.ts"), {recursive: true});
  }

  // Remove react router dom files
  if (!yargs.argv?.[REACT_ROUTER_PARAM]) {
    rmSync(join(PROJECT_PATH, "src/components/Utils/Router.tsx"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/constants/routes.ts"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/pages/Contact.tsx"), {recursive: true});
    rmSync(join(PROJECT_PATH, "src/pages/Home.tsx"), {recursive: true});
  }
};

const getAppData = () => {
  let data = [];
  const children = yargs.argv?.[REACT_ROUTER_PARAM] ? "<Router />" : `<h1>${packageJson.name}</h1>`;

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
    data.push(`${breakLine}const App = () => ${children};`);
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
  // remove lock file before install, user don't need it
  rmSync(join(PROJECT_PATH, "yarn.lock"), {recursive: true});

  const installDependency = PACKAGE_MANAGER === "npm" ? "install" : "add";

  execSync(`${PACKAGE_MANAGER} install`);

  if (yargs.argv?.[AXIOS_PARAM]) {
    execSync(`${PACKAGE_MANAGER} ${installDependency} axios`);
  }

  if (yargs.argv?.[I18NEXT_PARAM]) {
    execSync(`${PACKAGE_MANAGER} ${installDependency} i18next`);
    execSync(`${PACKAGE_MANAGER} ${installDependency} react-i18next`);
    execSync(`${PACKAGE_MANAGER} ${installDependency} i18next-browser-languagedetector`);
  }

  if (yargs.argv?.[REACT_QUERY_PARAM]) {
    execSync(`${PACKAGE_MANAGER} ${installDependency} @tanstack/react-query`);
  }

  if (yargs.argv?.[REACT_ROUTER_PARAM]) {
    execSync(`${PACKAGE_MANAGER} ${installDependency} react-router-dom`);
  }
};

const main = async () => {
  try {
    // Clear npx cache
    console.log("\n\x1b[36m%s\x1b[0m", "Clear npx cache...");
    execSync("rm -rf ~/.npm/_npx");

    // Download files
    console.log("\x1b[36m%s\x1b[0m", "Downloading files...");
    execSync(`git clone --depth 1 ${REPOSITORY_URL} ${PROJECT_PATH}`);

    // Change directory
    process.chdir(PROJECT_PATH);

    // Create package.json & .eslintrc.json
    console.log("\x1b[36m%s\x1b[0m", "Create package.json & .eslintrc.json...");
    buildPackageJson({packageJson, argv: yargs.argv});

    // Install dependencies
    console.log("\x1b[36m%s\x1b[0m", "Installing dependencies...");
    installDependencies();

    // Generate Files.tsx
    console.log("\x1b[36m%s\x1b[0m", "Generate Files...");
    buildAppFile();
    buildEslintJson(eslintrcJson);
    buildSetupTest();

    // Remove useless files
    console.log("\x1b[36m%s\x1b[0m", "Clean up unused file...");
    removeUselessFiles();

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
