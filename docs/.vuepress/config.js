import { createRequire } from "node:module";
import process from "node:process";
import { viteBundler } from "@vuepress/bundler-vite";
import { webpackBundler } from "@vuepress/bundler-webpack";
import { defineUserConfig } from "@vuepress/cli";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { shikiPlugin } from "@vuepress/plugin-shiki";
import { defaultTheme } from "@vuepress/theme-default";
import { getDirname, path } from "@vuepress/utils";
import { head, navbar } from "./configs/index.js";

const __dirname = getDirname(import.meta.url);
const require = createRequire(import.meta.url);
const isProd = process.env.NODE_ENV === "production";

export default defineUserConfig({
  dest: "dist",
  public: "public",
  head,
  locales: {
    "/": {
      lang: "zh-CN",
      title: "dasu",
      description: "我过往编写的博客、笔记资料平台",
    },
  },

  // specify bundler via environment variable
  bundler:
    process.env.DOCS_BUNDLER === "webpack" ? webpackBundler() : viteBundler(),

  // configure default theme
  theme: defaultTheme({
    logo: "/images/img.jpg",
    repo: "woshidasusu/Doc",
    docsDir: "docs",

    // theme-level locales config
    locales: {
      "/": {
        // navbar
        navbar: navbar,
        selectLanguageName: "简体中文",
        selectLanguageText: "选择语言",
        selectLanguageAriaLabel: "选择语言",
        // sidebar
        sidebar: "auto",
        // page meta
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdatedText: "上次更新",
        contributorsText: "贡献者",
        // custom containers
        tip: "提示",
        warning: "注意",
        danger: "警告",
        // 404 page
        notFound: [
          "这里什么都没有",
          "我们怎么到这来了？",
          "这是一个 404 页面",
          "看起来我们进入了错误的链接",
        ],
        backToHome: "返回首页",
        // a11y
        openInNewWindow: "在新窗口打开",
        toggleColorMode: "切换颜色模式",
        toggleSidebar: "切换侧边栏",
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      // use shiki plugin in production mode instead
      prismjs: !isProd,
    },
  }),

  // configure markdown
  markdown: {
    importCode: {
      handleImportPath: (importPath) => {
        // 自定义解析md
        return importPath;
      },
    },
  },

  // use plugins
  plugins: [
    docsearchPlugin({}),
    // 自动注册组件，以便 md 里可以直接使用
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, "./components"),
    }),
    // only enable shiki plugin in production mode
    // isProd ? shikiPlugin({ theme: "dark-plus" }) : [],
  ],
});
