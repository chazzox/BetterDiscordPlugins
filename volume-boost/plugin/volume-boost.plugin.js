/**
 * @name volume-boost
 * @description A better discord plugin that allows you to boost user volume past 200%
 * @version 2.0.0
 * @author QWERT and chazzox
 */

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

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  default: () => VolumeBooster
});
var MULTIPLIER = 2;
var Slider = BdApi.findModuleByDisplayName("Slider");
var LOG_STYLES = {
  color: "#c3c6fc",
  background: "#2c2c2c",
  padding: "2px 0.5em",
  "border-radius": "0.5em",
  "font-weight": "bold"
};
function debug_log(...output) {
  console.log("%cvolume-boost", Object.entries(LOG_STYLES).map(([a, b]) => `${a}:${b};`).join(""), ...output);
}
var VolumeBooster = class {
  start() {
    debug_log("Successfully started.");
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
    debug_log("Stopped.");
  }
};
module.exports = __toCommonJS(src_exports);
