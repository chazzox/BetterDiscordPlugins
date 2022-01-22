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
const config = require(path.join(process.cwd(), projectPath, 'bd.config.js'));

const root = path.resolve(__dirname);

const watch = {
	watch: {
		onRebuild(error, result) {
			if (error) errorHandler(error);
			else resultHandler(result);
		}
	}
};

const header = `/*@cc_on
@if (@_jscript)
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell")
    var fs = new ActiveXObject("Scripting.FileSystemObject")
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins")
    var pathSelf = WScript.ScriptFullName
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30)
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40)
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10)
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true)
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins)
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40)
    }
    WScript.Quit()
@else@*/`;
const footer = `/*@end@*/`;

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
		banner: { js: config.meta + header },
		footer: { js: footer },
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
