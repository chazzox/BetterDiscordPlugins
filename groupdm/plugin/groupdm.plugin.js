/**
 * @name groupdm
 * @author chazzox#1001
 * @description Group your Dms and Group Chats separately
 * @version 0.5.0  
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

// src/groupdm.tsx
var groupdm_exports = {};
__export(groupdm_exports, {
  default: () => groupdm
});

// src/index.scss
BdApi.injectCSS("groupdm-styles", "#buttonFilterContainer{display:flex;justify-content:space-evenly;align-items:center;flex-direction:row;flex-grow:0;align-content:center;background-color:var(--background-modifier-hover);border-radius:4px;margin-left:8px;margin-bottom:8px;margin-top:4px;height:42px}.filterButtons{background:none;transition:color,background-color .2s ease;color:var(--channels-default);box-sizing:border-box;border-radius:4px;font-size:15px;flex-basis:30%;padding:0 2px;border:none;height:30px;line-height:30px}.filterButtons.selected{background-color:var(--brand-experiment) !important;color:var(--interactive-selected)}.filterButtons:hover{color:#fff;background-color:var(--background-modifier-selected)}");

// src/groupdm.tsx
function log_action(action_string, ...rest) {
  console.log(`%c${action_string}`, "color:red;", ...rest);
}
var filter_mode_styles = /* @__PURE__ */ ((filter_mode_styles2) => {
  filter_mode_styles2["GROUP"] = `
a[aria-label~="(direct"] {
	display: none;
}`;
  filter_mode_styles2["DM"] = `
a[aria-label~="(group"] {
    display: none;
}`;
  filter_mode_styles2["BOTH"] = ``;
  return filter_mode_styles2;
})(filter_mode_styles || {});
var { React, ReactDOM } = BdApi;
var siblingClassName = ".privateChannelsHeaderContainer-1UWASm";
var buttonContainerId = "buttonFilterContainer";
var cssId = "groupdm-filter";
function FilterButtons() {
  const [isGroup, setIsGroup] = React.useState(BdApi.loadData("groupdm", "isGroup"));
  React.useEffect(() => {
    BdApi.clearCSS(cssId);
    BdApi.injectCSS(cssId, filter_mode_styles[isGroup]);
  }, [isGroup]);
  const setIsGroupWithStore = (newVal) => {
    setIsGroup(newVal);
    BdApi.setData("groupdm", "isGroup", newVal);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    className: `filterButtons ${isGroup == "BOTH" /* BOTH */ ? "selected" : ""}`,
    onClick: () => setIsGroupWithStore("BOTH" /* BOTH */)
  }, "All"), /* @__PURE__ */ React.createElement("button", {
    className: `filterButtons ${isGroup == "DM" /* DM */ ? "selected" : ""}`,
    onClick: () => setIsGroupWithStore("DM" /* DM */)
  }, "Friends"), /* @__PURE__ */ React.createElement("button", {
    className: `filterButtons ${isGroup == "GROUP" /* GROUP */ ? "selected" : ""}`,
    onClick: () => setIsGroupWithStore("GROUP" /* GROUP */)
  }, "Groups"));
}
function create_dom_container() {
  const beforeEl = document.querySelector(siblingClassName);
  const buttonContainer = document.createElement("div");
  buttonContainer.id = buttonContainerId;
  beforeEl.insertAdjacentElement("afterend", buttonContainer);
}
async function render_filter_buttons() {
  if (document.querySelector(siblingClassName) && !document.getElementById(buttonContainerId)) {
    create_dom_container();
    ReactDOM.render(/* @__PURE__ */ React.createElement(FilterButtons, null), document.getElementById(buttonContainerId));
  }
}
var groupdm = class {
  load() {
    BdApi.saveData("groupdm", "isGroup", "DM" /* DM */);
  }
  start() {
    log_action("[groupdm]", "Started!");
    render_filter_buttons();
  }
  stop() {
    document.getElementById(buttonContainerId).remove();
    BdApi.clearCSS(cssId);
  }
  onSwitch() {
    render_filter_buttons();
  }
};
module.exports = __toCommonJS(groupdm_exports);
