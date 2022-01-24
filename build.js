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
			else finishBuild(result);
		}
	}
};

/**
 * @description the self installer header for windows
 * it will only run if the user tries to run the file, it will open a dialog menu
 */
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
			// sass
			{
				name: 'sass',
				setup(build) {
					build.onLoad({ filter: /.scss$/ }, (args) => {
						const { css } = sass.compile(args.path, {
							style: 'compressed',
							logger: {
								debug(message, {}) {
									return 'hello';
								},
								warn(warning, {}) {
									return 'hello';
								}
							}
						});

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
						console.time('⚡ build took');
					});
					build.onEnd(() => {
						console.timeEnd('⚡ build took');
					});
				}
			},
			// allows the use of the BdApi global
			alias({
				react: path.resolve(root, 'react-inject/react.ts'),
				'react-dom': path.resolve(root, 'react-inject/react-dom.ts')
			})
		]
	})
	.then(({ outputFiles }) => {
		writeFile([path.join(projectPath, config.out), path.join(...GetBetterDiscordPath())], outputFiles[0].contents);
	})
	.catch((err) => {
		console.error('🚨', '\x1b[41m', 'BUILD FAILED', '\x1b[0m', '🚨');
		err.errors.forEach((err) => console.error(err.detail));
	});

/**
 * @description writes data to file with a nice log on completion
 * @param {string[]} paths where the file is
 * @param {NodeJS.ArrayBufferView} data file data to write
 */
function writeFile(paths, data) {
	try {
		paths.forEach((p) =>
			fs.writeFile(p, data, (err) => {
				if (err) throw { path: p, error: err };
			})
		);
	} catch (err) {
		console.error(err);
	}
}
