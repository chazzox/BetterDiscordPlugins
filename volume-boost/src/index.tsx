/**
 * @name VolumeBooster
 * @description A better discord plugin that allows you to boost user volume past 200%
 * @version 1.0.0
 * @author QWERT & CHAZZOX
 */

const MULTIPLIER = 2;
const Slider = BdApi.findModuleByDisplayName('Slider');

const LOG_STYLES = {
	color: '#c3c6fc',
	background: '#2c2c2c',
	padding: '2px 0.5em',
	'border-radius': '0.5em',
	'font-weight': 'bold'
};

function debug_log(...output: any): void {
	console.log(
		'%c' + 'volume-boost',
		Object.entries(LOG_STYLES)
			.map(([a, b]) => `${a}:${b};`)
			.join(''),
		...output
	);
}

export default class VolumeBooster {
	start() {
		debug_log('Successfully started.');

		// @ts-expect-error
		BdApi.Patcher.after('volume-boost-slider', Slider.prototype, 'render', (_this: any, [props], _) => {
			if (_this?.props?.className !== 'slider-BEB8u7') return;
			_this.props.maxValue = 200 * MULTIPLIER;
			_this.state.range = 200 * MULTIPLIER;
			_this.state.max = 200 * MULTIPLIER;
			_this.state.value = _this.state.initialValueProp;
		});
	}

	stop() {
		// @ts-expect-error
		BdApi.Patcher.unpatchAll('volume-boost-slider');
		debug_log('Stopped.');
	}
}
