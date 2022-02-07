/**
 * @name volume-boost
 * @description A better discord plugin that allows you to boost user volume past 200%
 * @version 2.0.0
 * @author QWERT and chazzox
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

// volume-boost/src/index.tsx
var src_exports = {};
__export(src_exports, {
  default: () => VolumeBooster
});

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

// volume-boost/src/index.tsx
var MULTIPLIER = 4;
var Slider = BdApi.findModuleByDisplayName("Slider");
var log2 = (data) => log(void 0, "VolumeBooster", data);
var VolumeBooster = class {
  start() {
    log2("Successfully started.");
    BdApi.Patcher.after("volume-boost-slider", Slider.prototype, "render", (_this, [props], _) => {
      if (_this?.props?.className !== "slider-BEB8u7")
        return;
      _this.props.maxValue = 200 * MULTIPLIER;
      _this.state.range = 200 * MULTIPLIER;
      _this.state.max = 200 * MULTIPLIER;
      _this.state.value = _this.state.initialValueProp;
    });
  }
  stop() {
    BdApi.Patcher.unpatchAll("volume-boost-slider");
    log2("Stopped.");
  }
};
module.exports = __toCommonJS(src_exports);
/*@end@*/
