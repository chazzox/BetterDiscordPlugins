/**
 * @name hide
 * @author chazzox#1001
 * @authorId 267924628670775297
 * @description Plugin template for better discord that hides everything
 * @version 1.5.0
 * @website https://github.com/chazzox/BetterDiscordPlugins/tree/main/hide#readme
 * @source https://github.com/chazzox/BetterDiscordPlugins/tree/main/hide
 * @donate https://www.paypal.me/chazzox
 * @updateUrl https://raw.githubusercontent.com/chazzox/BetterDiscordPlugins/main/hide/plugin/hide.plugin.js
 */
/*@cc_on
@if (@_jscript)
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell")
    var fs = new ActiveXObject("Scripting.FileSystemObject")
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%BetterDiscordplugins")
    var pathSelf = WScript.ScriptFullName
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. 
(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30)
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40)
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.
Are you sure it's even installed?", 0, "Can't install myself", 0x10)
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true)
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins)
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40)
    }
    WScript.Quit()
@else@*/
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// hide/src/hide.tsx
var hide_exports = {};
__export(hide_exports, {
  default: () => hide
});

// utils/react-inject/react.ts
var React = BdApi.React;
var react_default = React;

// utils/bd-utils.ts
var LOG_STYLES = {
  color: "#c3c6fc",
  background: "#2c2c2c",
  padding: "2px 0.5em",
  "border-radius": "0.5em",
  "font-weight": "bold"
};
function log(style = LOG_STYLES, prefix, ...output) {
  console.log(`%c${prefix}`, Object.entries(style).map(([a, b]) => `${a}:${b};`).join(""), ...output);
}

// hide/src/index.scss
BdApi.injectCSS("hide-styles", "#toolButton{background:none;padding:0;margin:0;outline:none;position:relative;margin-right:6px}#toolButton #tooltip{visibility:hidden;position:absolute;left:50%;bottom:-8px;transform:translate(-50%, 100%)}#toolButton svg *{fill:var(--interactive-normal)}#toolButton:hover svg *{fill:var(--interactive-hover)}#toolButton:hover #tooltip{visibility:visible}");

// hide/src/hide.tsx
var css_id = "hide";
var CameraMicModule = BdApi.findModuleByProps("toggleLocalMute");
var selectors = [
  ".nowPlayingColumn-2sl4cE",
  ".content-3YMskv > .peopleListItem-u6dGxF",
  ".wrapper-24pKcD",
  ".itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a",
  ".content-1jQy2l",
  'a[aria-label~="(direct"], a[aria-label~="(group"]',
  'div[aria-label="Servers"]',
  ".children-gzQq2t",
  ".badge-1Skb69.numberBadge-2s8kKX.base-PmTxvP.baseShapeRound-1Mm1YW",
  ".peopleListItem-u6dGxF",
  ".lowerBadge-29hYVK",
  ".privateChannelRecipientsInviteButtonIcon-3A3uTc.iconWrapper-2OrFZ1.clickable-3rdHwn",
  ".bottomControls-lIJyYL.controlSection-2h3cS0",
  ".root-3yg4nC.voiceCallWrapper-3kPwHm",
  ".inviteToolbar-3F-l2g",
  'div[data-list-id="recents"]',
  ".pictureInPicture-3VocJq",
  ".listItems-1uJgMC",
  ".scroller-1Bvpku > div:not([class])",
  "h3.cursorPointer-3JF56F.title-17SveM.fontDisplay-3Gtuks.base-21yXnu",
  ".status-1XNdyw.disableFlex-2QuzIB",
  ".akaBadge-3i7V3p.textBadge-1fdDPJ.base-3IDx3L.baseShapeRound-3epLEv",
  ".nicknames-10Sg6e.overflow-1wOqNV",
  'div[data-list-id="pins"] > div'
];
var HideStyles = `${selectors.join(", ")} {
    display: none;
}

h2.title-x4dI75.container-q97qHp {
    color: rgba(255,255,255,0);
}

h2.title-x4dI75.container-q97qHp::before {
    content: 'Online - 0';
    opacity: 1;
    display: block;
    color: var(--header-secondary);
}`;
var Icon = ({ line }) => {
  return /* @__PURE__ */ react_default.createElement("svg", {
    className: "icon-2xnN2Y",
    width: "400",
    height: "237.55102040816325",
    viewBox: "8.205 0.283 384.13 236.316"
  }, /* @__PURE__ */ react_default.createElement("g", null, /* @__PURE__ */ react_default.createElement("g", null, /* @__PURE__ */ react_default.createElement("path", {
    d: "M190.204 0.283 C 130.734 3.791,61.288 43.865,8.205 105.306 C -3.624 118.998,-3.443 119.916,15.011\r\n						139.842 C 78.427 208.318,153.464 244.150,217.632 236.599 C 276.681 229.651,341.324 190.811,392.335\r\n						131.633 C 403.606 118.556,403.393 117.582,384.856 97.564 C 324.127 31.978,253.265 -3.436,190.204\r\n						0.283 M216.327 21.622 C 258.776 26.814,303.006 49.529,345.853 88.143 C 356.364 97.616,376.159\r\n						117.892,375.822 118.841 C 374.160 123.516,338.376 156.875,321.244 169.722 C 240.580 230.206,167.212\r\n						231.911,86.327 175.180 C 67.037 161.651,39.217 136.735,25.985 121.136 C 23.602 118.326,22.931\r\n						119.562,32.271 109.544 C 81.066 57.207,138.118 25.205,190.000 21.070 C 193.608 20.783,212.742\r\n						21.184,216.327 21.622 M192.245 54.703 C 139.651 61.981,116.941 124.807,153.095 163.009 C 192.496\r\n						204.641,262.220 178.202,264.362 120.816 C 265.819 81.773,230.515 49.408,192.245 54.703 M208.239\r\n						75.723 C 249.733 84.349,256.744 139.823,218.661 158.188 C 186.646 173.627,148.737 143.890,156.972\r\n						109.796 C 162.742 85.909,185.256 70.945,208.239 75.723",
    fill: "#b9bbbe"
  })), line && /* @__PURE__ */ react_default.createElement("g", null, /* @__PURE__ */ react_default.createElement("line", {
    transform: "rotate(-30, 200, 119)",
    y2: "118.99996",
    x2: "375.29031",
    y1: "118.99996",
    x1: "24.70948",
    "stroke-width": "35",
    stroke: "#b9bbbe",
    fill: "none"
  }))));
};
var ToggleButton = () => {
  const [isHidden, setIsHidden] = react_default.useState(BdApi.loadData("hide-everything", "isHidden"));
  const toggleHiddenWithSideEffects = () => setIsHidden((prev) => {
    const isHidden2 = !prev;
    if (isHidden2) {
      BdApi.injectCSS(css_id, HideStyles);
    } else {
      BdApi.clearCSS(css_id);
    }
    return isHidden2;
  });
  return /* @__PURE__ */ react_default.createElement("button", {
    id: "toolButton",
    onClick: toggleHiddenWithSideEffects
  }, /* @__PURE__ */ react_default.createElement("div", {
    className: "iconWrapper-2awDjA clickable-ZD7xvu"
  }, /* @__PURE__ */ react_default.createElement(Icon, {
    line: isHidden
  }), /* @__PURE__ */ react_default.createElement("div", {
    id: "tooltip",
    className: "tooltip-14MtrL tooltipBottom-2WzfVx tooltipPrimary-3qLMbS"
  }, /* @__PURE__ */ react_default.createElement("div", {
    className: "tooltipPointer-3L49xb"
  }), /* @__PURE__ */ react_default.createElement("div", {
    className: "tooltipContent-Nejnvh"
  }, isHidden ? "Show" : "Hide"))));
};
var hide = class {
  load() {
    BdApi.setData("hide", "isHidden", true);
    BdApi.setData("hide", "cameraToggled", false);
  }
  start() {
    log(void 0, "hide", "started");
    const HeaderBarContainer = BdApi.findModuleByDisplayName("HeaderBarContainer")?.prototype;
    BdApi.Patcher.after("hide", HeaderBarContainer, "renderLoggedIn", (_, __, returnValue) => {
      returnValue.props.toolbar.props.children.push(/* @__PURE__ */ react_default.createElement(ToggleButton, null));
    });
  }
  stop() {
    BdApi.Patcher.unpatchAll("hide");
  }
};
module.exports = __toCommonJS(hide_exports);
/*@end@*/
