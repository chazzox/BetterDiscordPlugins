/**
 * @name VolumeBooster
 * @description A better discord plugin that allows you to boost user volume past 200%
 * @version 1.0.0
 * @author QWERT & CHAZZOX
 */

const MULTIPLIER = 4;
const Slider = BdApi.findModuleByDisplayName('Slider');

import * as Utils from '../../utils/bd-utils';

const log = (data: any) => Utils.log(undefined, 'VolumeBooster', data);
export default class VolumeBooster {
	start() {
		log('Successfully started.');

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
	}
}
