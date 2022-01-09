import { name, homepage, version, repository } from './package.json';
import path from 'path';
import os from 'os';

import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import styles from 'rollup-plugin-styles';

function GetBetterDiscordPath() {
	switch (os.platform()) {
		case 'darwin':
			return [process.env.HOME, 'Library/Application Support/BetterDiscord/plugins/'];
		case 'win32':
			return [process.env.HOME, 'AppData/Roaming/BetterDiscord/plugins/'];
		default:
			throw Error(
				'Platform not implemented, please submit an issue at https://github.com/chazzox/plugin-template/issues or make a pr :)'
			);
	}
}

const meta = `
/**
 * @name ${name}
 * @author chazzox#1001
 * @description Group your Dms and Group Chats separately
 * @version ${version}
 * @website ${homepage}
 * @source ${repository.url}
 */
`;

export default defineConfig({
	input: `src/${name}.tsx`,
	output: [
		{
			file: `plugin/${name}.plugin.js`,
			format: 'cjs',
			banner: meta
		},
		{
			file: path.join(...GetBetterDiscordPath(), `${name}.plugin.js`),
			format: 'cjs',
			banner: meta
		}
	],
	plugins: [
		nodeResolve(),
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
		typescript(),
		// minifier
		terser({
			module: true,
			compress: { sequences: false },
			mangle: {},
			parse: {},
			rename: {},
			// Remove all comments *except* the meta comment at the top
			format: { comments: '/@name/' }
		})
	]
});
