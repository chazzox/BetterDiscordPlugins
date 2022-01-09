import esbuild from 'esbuild';
import path from 'path';
import os from 'os';
import fs from 'fs';

const args = process.argv.slice(2);

const isWatching = args.includes('-w');
const isLocalOnly = args.includes('-l');

const meta = `/**
 * @name VolumeBooster
 * @description A better discord plugin that allows you to boost user volume past 200%
 * @version 2.0.0
 * @author QWERT and chazzox
 */`;

const watch = {
	watch: {
		onRebuild(error, result) {
			if (error) errorHandler(error);
			else resultHandler(result);
		}
	}
};

function GetBetterDiscordPath() {
	switch (os.platform()) {
		case 'darwin':
			return [process.env.HOME, 'Library/Application Support/BetterDiscord/plugins/'];
		case 'win32':
			return [process.env.HOME, 'AppData/Roaming/BetterDiscord/plugins/'];
		default:
			throw Error(
				'Platform not implemented, please submit an issue at https://github.com/chazzox/discordify/issues or make a pr :)'
			);
	}
}

esbuild
	.build({
		entryPoints: ['src/index.tsx'],
		banner: {
			js: meta
		},
		...(isWatching && watch),
		format: 'cjs',
		logLevel: 'silent',
		write: false,
		plugins: [
			{
				name: 'start/end',
				setup(build) {
					build.onStart(() => {
						console.time('build took');
					});
					build.onEnd((result) => {
						console.timeEnd('build took');
					});
				}
			}
		]
	})
	.then(resultHandler)
	.catch(errorHandler);

function resultHandler(res) {
	fs.writeFile('plugin/volume-boost.plugin.js', res.outputFiles[0].contents, fsCallback);
	isLocalOnly &&
		fs.writeFile(
			path.join(...GetBetterDiscordPath(), 'volume-boost.plugin.js'),
			res.outputFiles[0].contents,
			fsCallback
		);
	console.log('some nice log about how its done');
}

function errorHandler(err) {
	console.error('need to clean this error log up prolly', JSON.stringify(err));
}

function fsCallback(err) {
	if (err) {
		console.log('\x1b[41m COPY FAILED', '\x1b[0m');
		console.log('\x1b[31m', err.path, '---->', err.dest, '\x1b[0m', 'Could not succeed');
	}
}

const performancePlugin = {};
