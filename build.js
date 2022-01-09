const sass = require('sass');
const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');

const path = require('path');
const os = require('os');
const fs = require('fs');

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length != 2)
	throw Error('Arguments not recognised please use the format `node build.js <build|watch> <project_path>`');

const bundleTypeStr = commandLineArgs[0];
const projectPath = commandLineArgs[1];
const isWatch = { build: false, watch: true }[bundleTypeStr];
const config = require(path.join(__dirname, projectPath, 'bd.config.js'));

const root = path.resolve(__dirname);

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
		entryPoints: config.entries.map((p) => path.join(projectPath, p)),
		banner: { js: config.meta },
		...(isWatch && watch),
		format: 'cjs',
		logLevel: 'silent',
		write: false,
		bundle: true,
		plugins: [
			{
				name: 'sass',
				setup(build) {
					build.onLoad({ filter: /.scss$/ }, (args) => {
						const { css } = sass.compile(args.path, { style: 'compressed' });
						return {
							contents: `BdApi.injectCSS('${config.name}-styles', '${css.trim()}')`,
							loader: 'js'
						};
					});
				}
			},
			{
				name: 'perf',
				setup(build) {
					build.onStart(() => {
						console.time('build took');
					});
					build.onEnd(() => {
						console.timeEnd('build took');
					});
				}
			},
			alias({
				react: path.resolve(root, 'react-inject/react.ts'),
				'react-dom': path.resolve(root, 'react-inject/react-dom.ts')
			})
		]
	})
	.then(resultHandler)
	.catch(errorHandler);

function resultHandler(res) {
	fs.writeFile(path.join(projectPath, config.out), res.outputFiles[0].contents, fsCallback);
	fs.writeFile(path.join(...GetBetterDiscordPath(), `${config.name}.plugin.js`), res.outputFiles[0].contents, fsCallback);

	console.log('some nice log about how its done');
}

function errorHandler(err) {
	console.error('need to clean this error log up prolly', JSON.stringify(err));
}

function fsCallback(err) {
	if (err) {
		console.log(JSON.stringify(err));
		console.log('\x1b[41m COPY FAILED', '\x1b[0m');
		console.log('\x1b[31m', err.path, '---->', err.dest, '\x1b[0m', 'Could not succeed');
	}
}
