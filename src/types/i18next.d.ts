import en from "@/locales/en";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    resources: {
      translation: typeof en;
    };
  }
}
