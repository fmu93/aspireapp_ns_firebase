// Snapshot the ~/app.css and the theme
const application2 = require("application");
require("ui/styling/style-scope");
const appCssContext1 = require.context("~/", false, /^\.\/app\.(css|scss|less|sass)$/);
global.registerWebpackModules(appCssContext1);
application2.loadAppCss();

require("./vendor-platform");

require("bundle-entry-points");
