/**
 * @name hide
 * @author chazzox#1001
 * @authorId 267924628670775297
 * @description Plugin template for better discord that hides everything
 * @version 1.0.0
 * @website https://github.com/chazzox/hide#readme
 * @source https://github.com/chazzox/hide
 * @donate https://www.paypal.me/chazzox
 * @updateUrl https://raw.githubusercontent.com/chazzox/hide/main/plugin/hide.plugin.js
 */

/*@cc_on
@if (@_jscript)
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%appdata%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    shell.Popup("Hey! This file is not an executable, please try not to run it!", 0, "hide plugin!", 0x30);

    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already. Just reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder. Are you sure it's even installed?", 0, "Can't find better discord", 0x10);
    } else if (shell.Popup("Would you like me to automatically copy myself to the folder?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed! Just reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else @*/

'use strict';

const react = BdApi.React;

var css = "#toolButton{background:none;padding:0;outline:none;position:relative;margin:0 6px 0 0}#toolButton #tooltip{visibility:hidden;position:absolute;left:50%;bottom:-8px;transform:translate(-50%,100%)}#toolButton svg *{fill:var(--interactive-normal)}#toolButton:hover svg *{fill:var(--interactive-hover)}#toolButton:hover #tooltip{visibility:visible}";
BdApi.injectCSS("hide-styles",css);

const css_id = 'hide';
const selectors = [
    '.nowPlayingColumn-2sl4cE',
    '.content-3YMskv > .peopleListItem-2nzedh',
    '.wrapper-24pKcD',
    '.panel-24C3ux.activityPanel-28dQGo',
    '.content-yTz4x3',
    'a[aria-label~="(direct"], a[aria-label~="(group"]',
    'div[aria-label="Servers"]',
    '.children-gzQq2t',
    '.badge-1Skb69.numberBadge-2s8kKX.base-PmTxvP.baseShapeRound-1Mm1YW',
    '.peopleListItem-2nzedh',
    '.lowerBadge-29hYVK',
    '.privateChannelRecipientsInviteButtonIcon-3A3uTc.iconWrapper-2OrFZ1.clickable-3rdHwn',
    '.bottomControls-lIJyYL.controlSection-2h3cS0',
    '.root-3yg4nC.voiceCallWrapper-3kPwHm',
    '.inviteToolbar-3F-l2g',
    'div[data-list-id="recents"]',
    '.pictureInPicture-3VocJq',
    '.listItems-1uJgMC',
    '.scroller-1Bvpku > div:not([class])',
    'h3.cursorPointer-1j7DL8.title-29uC1r.fontDisplay-1dagSA.base-1x0h_U.size16-1P40sf',
    '.status-1XNdyw.disableFlex-2QuzIB',
    '.akaBadge-1M-1Gw.textBadge-1iylP6.base-PmTxvP.baseShapeRound-1Mm1YW',
    '.nicknames-1XK4Zt.overflow-WK9Ogt',
    'div[data-list-id="pins"] > div'
];
const HideStyles = `
${selectors.join(', ')} {
    display: none
}

h2.title-30qZAO.container-2ax-kl {
    color: rgba(255,255,255,0);
}

h2.title-30qZAO.container-2ax-kl::before {
    content: 'Online - 0';
    opacity: 1;
    display: block;
    color: var(--header-secondary);
}`;
const Icon = ({ line }) => {
    return (react.createElement("svg", { className: "icon-22AiRD", width: "400", height: "237.55102040816325", viewBox: "0, 0, 400,237.55102040816325" },
        react.createElement("g", null,
            react.createElement("g", null,
                react.createElement("path", { d: "M190.204 0.283 C 130.734 3.791,61.288 43.865,8.205 105.306 C -3.624 118.998,-3.443 119.916,15.011\r\n\t\t\t\t\t\t139.842 C 78.427 208.318,153.464 244.150,217.632 236.599 C 276.681 229.651,341.324 190.811,392.335\r\n\t\t\t\t\t\t131.633 C 403.606 118.556,403.393 117.582,384.856 97.564 C 324.127 31.978,253.265 -3.436,190.204\r\n\t\t\t\t\t\t0.283 M216.327 21.622 C 258.776 26.814,303.006 49.529,345.853 88.143 C 356.364 97.616,376.159\r\n\t\t\t\t\t\t117.892,375.822 118.841 C 374.160 123.516,338.376 156.875,321.244 169.722 C 240.580 230.206,167.212\r\n\t\t\t\t\t\t231.911,86.327 175.180 C 67.037 161.651,39.217 136.735,25.985 121.136 C 23.602 118.326,22.931\r\n\t\t\t\t\t\t119.562,32.271 109.544 C 81.066 57.207,138.118 25.205,190.000 21.070 C 193.608 20.783,212.742\r\n\t\t\t\t\t\t21.184,216.327 21.622 M192.245 54.703 C 139.651 61.981,116.941 124.807,153.095 163.009 C 192.496\r\n\t\t\t\t\t\t204.641,262.220 178.202,264.362 120.816 C 265.819 81.773,230.515 49.408,192.245 54.703 M208.239\r\n\t\t\t\t\t\t75.723 C 249.733 84.349,256.744 139.823,218.661 158.188 C 186.646 173.627,148.737 143.890,156.972\r\n\t\t\t\t\t\t109.796 C 162.742 85.909,185.256 70.945,208.239 75.723", fill: "#b9bbbe" })),
            line && (react.createElement("g", null,
                react.createElement("line", { transform: "rotate(-30, 200, 119)", y2: "118.99996", x2: "375.29031", y1: "118.99996", x1: "24.70948", "stroke-width": "35", stroke: "#b9bbbe", fill: "none" }))))));
};
const ToggleButton = () => {
    const [isHidden, setIsHidden] = react.useState(BdApi.loadData('hide-everything', 'isHidden'));
    react.useEffect(() => {
        if (isHidden)
            BdApi.injectCSS(css_id, HideStyles);
        else
            BdApi.clearCSS(css_id);
    }, [isHidden]);
    return (react.createElement("button", { id: "toolButton", onClick: () => setIsHidden((prev) => {
            BdApi.setData('hide-everything', 'isHidden', !prev);
            return !prev;
        }) },
        react.createElement("div", { className: "iconWrapper-2OrFZ1 clickable-3rdHwn" },
            react.createElement(Icon, { line: isHidden }),
            react.createElement("div", { id: "tooltip", className: "tooltip-2QfLtc tooltipBottom-3ARrEK tooltipPrimary-1d1ph4" },
                react.createElement("div", { className: "tooltipPointer-3ZfirK" }),
                react.createElement("div", { className: "tooltipContent-bqVLWK" }, isHidden ? 'Show' : 'Hide')))));
};
class hide {
    load() {
        BdApi.setData('hide', 'isHidden', true);
    }
    start() {
        var _a;
        const HeaderBarContainer = (_a = BdApi.findModuleByDisplayName('HeaderBarContainer')) === null || _a === void 0 ? void 0 : _a.prototype;
        // @ts-expect-error
        BdApi.Patcher.after('hide', HeaderBarContainer, 'renderLoggedIn', (_, __, returnValue) => {
            returnValue.props.toolbar.props.children.push(react.createElement(ToggleButton, null));
        });
    }
    stop() {
        // @ts-expect-error
        BdApi.Patcher.unpatchAll('hide');
    }
}

module.exports = hide;
/*@end @*/
