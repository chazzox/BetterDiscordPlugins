import { defineConfig } from 'rollup';

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import styles from 'rollup-plugin-styles';

import { name, description, version } from './package.json';
import os from 'os';
import path from 'path';

function GetBetterDiscordPath() {
	switch (os.platform()) {
		case 'darwin':
			return [process.env.HOME, 'Library/Application Support/BetterDiscord/plugins/'];
		case 'win32':
			return [process.env.HOME, 'AppData/Roaming/BetterDiscord/plugins/'];
		default:
			throw Error('Platform not implemented!');
	}
}

const meta = `/**
 * @name ${name}
 * @author chazzox#1001
 * @authorId 267924628670775297
 * @description ${description}
 * @version ${version}
 * @website https://github.com/chazzox/hide#readme
 * @source https://github.com/chazzox/hide
 * @donate https://www.paypal.me/chazzox
 * @updateUrl https://raw.githubusercontent.com/chazzox/hide/main/plugin/hide.plugin.js
 */
`;

// prettier-ignore
const selfInstallHead = `
/*@cc_on
@if (@_jscript)
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%appdata%\\\\BetterDiscord\\\\plugins");
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
`;

const selfInstallFoot = '/*@end @*/';

const projectRoot = path.resolve(__dirname);

export default defineConfig({
	input: `src/${name}.tsx`,
	output: [
		{
			file: `plugin/${name}.plugin.js`,
			format: 'cjs',
			banner: meta + selfInstallHead,
			footer: selfInstallFoot
		},
		{
			file: path.join(...GetBetterDiscordPath(), `${name}.plugin.js`),
			format: 'cjs',
			banner: meta + selfInstallHead,
			footer: selfInstallFoot
		}
	],
	plugins: [
		// fixing any node_module react import
		alias({
			entries: [
				{ find: 'react', replacement: path.resolve(projectRoot, 'src/react.ts') },
				{ find: 'react-dom', replacement: path.resolve(projectRoot, 'src/react-dom.ts') }
			]
		}),

		// resolve imports

		commonjs(),

		// .scss files to inline BdApi string
		styles({
			minimize: true,
			extensions: ['.scss'],
			mode: [
				'inject',
				(varname, id) => {
					return `BdApi.injectCSS("${name}-styles",${varname})`;
				}
			]
		}),
		typescript()
	]
});
