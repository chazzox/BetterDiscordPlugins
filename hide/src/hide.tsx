import React from 'react';
import * as Utils from '@utils/bd-utils';
import './index.scss';

const css_id = 'hide';

const CameraMicModule = BdApi.findModuleByProps('toggleLocalMute');

const selectors = [
	'.nowPlayingColumn-2sl4cE',
	'.content-3YMskv > .peopleListItem-u6dGxF',
	'.wrapper-24pKcD',
	'.itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a',
	'.content-1jQy2l',
	'a[aria-label~="(direct"], a[aria-label~="(group"]',
	'div[aria-label="Servers"]',
	'.children-gzQq2t',
	'.badge-1Skb69.numberBadge-2s8kKX.base-PmTxvP.baseShapeRound-1Mm1YW',
	'.peopleListItem-u6dGxF',
	'.lowerBadge-29hYVK',
	'.privateChannelRecipientsInviteButtonIcon-3A3uTc.iconWrapper-2OrFZ1.clickable-3rdHwn',
	'.bottomControls-lIJyYL.controlSection-2h3cS0',
	'.root-3yg4nC.voiceCallWrapper-3kPwHm',
	'.inviteToolbar-3F-l2g',
	'div[data-list-id="recents"]',
	'.pictureInPicture-3VocJq',
	'.listItems-1uJgMC',
	'.scroller-1Bvpku > div:not([class])',
	'h3.cursorPointer-3JF56F.title-17SveM.fontDisplay-3Gtuks.base-21yXnu',
	'.status-1XNdyw.disableFlex-2QuzIB',
	'.akaBadge-3i7V3p.textBadge-1fdDPJ.base-3IDx3L.baseShapeRound-3epLEv',
	'.nicknames-10Sg6e.overflow-1wOqNV',
	'div[data-list-id="pins"] > div'
];

const HideStyles = `${selectors.join(', ')} {
    display: none;
}

h2.title-x4dI75.container-q97qHp {
    color: rgba(255,255,255,0);
}

h2.title-x4dI75.container-q97qHp::before {
    content: 'Online - 0';
    opacity: 1;
    display: block;
    color: var(--header-secondary);
}`;

const Icon: React.FC<{ line: boolean }> = ({ line }) => {
	return (
		<svg className="icon-2xnN2Y" width="400" height="237.55102040816325" viewBox="8.205 0.283 384.13 236.316">
			<g>
				<g>
					<path
						d="M190.204 0.283 C 130.734 3.791,61.288 43.865,8.205 105.306 C -3.624 118.998,-3.443 119.916,15.011
						139.842 C 78.427 208.318,153.464 244.150,217.632 236.599 C 276.681 229.651,341.324 190.811,392.335
						131.633 C 403.606 118.556,403.393 117.582,384.856 97.564 C 324.127 31.978,253.265 -3.436,190.204
						0.283 M216.327 21.622 C 258.776 26.814,303.006 49.529,345.853 88.143 C 356.364 97.616,376.159
						117.892,375.822 118.841 C 374.160 123.516,338.376 156.875,321.244 169.722 C 240.580 230.206,167.212
						231.911,86.327 175.180 C 67.037 161.651,39.217 136.735,25.985 121.136 C 23.602 118.326,22.931
						119.562,32.271 109.544 C 81.066 57.207,138.118 25.205,190.000 21.070 C 193.608 20.783,212.742
						21.184,216.327 21.622 M192.245 54.703 C 139.651 61.981,116.941 124.807,153.095 163.009 C 192.496
						204.641,262.220 178.202,264.362 120.816 C 265.819 81.773,230.515 49.408,192.245 54.703 M208.239
						75.723 C 249.733 84.349,256.744 139.823,218.661 158.188 C 186.646 173.627,148.737 143.890,156.972
						109.796 C 162.742 85.909,185.256 70.945,208.239 75.723"
						fill="#b9bbbe"
					/>
				</g>
				{line && (
					<g>
						<line
							transform="rotate(-30, 200, 119)"
							y2="118.99996"
							x2="375.29031"
							y1="118.99996"
							x1="24.70948"
							stroke-width="35"
							stroke="#b9bbbe"
							fill="none"
						/>
					</g>
				)}
			</g>
		</svg>
	);
};

const ToggleButton = () => {
	const [isHidden, setIsHidden] = React.useState(BdApi.loadData('hide-everything', 'isHidden'));

	const toggleHiddenWithSideEffects = () =>
		setIsHidden((prev) => {
			// new value of isHidden
			const isHidden = !prev;

			if (isHidden) {
				BdApi.injectCSS(css_id, HideStyles);
				// deafen if not deafened already
			} else {
				BdApi.clearCSS(css_id);
				// un-deafen if not un-deafened already
			}

			return isHidden;
		});

	return (
		<button id="toolButton" onClick={toggleHiddenWithSideEffects}>
			<div className="iconWrapper-2awDjA clickable-ZD7xvu">
				<Icon line={isHidden} />
				<div id="tooltip" className="tooltip-14MtrL tooltipBottom-2WzfVx tooltipPrimary-3qLMbS">
					<div className="tooltipPointer-3L49xb"></div>
					<div className="tooltipContent-Nejnvh">{isHidden ? 'Show' : 'Hide'}</div>
				</div>
			</div>
		</button>
	);
};

export default class hide {
	load() {
		BdApi.setData('hide', 'isHidden', true);
		BdApi.setData('hide', 'cameraToggled', false);
	}
	start() {
		Utils.log(undefined, 'hide', 'started');

		const HeaderBarContainer = BdApi.findModuleByDisplayName('HeaderBarContainer')?.prototype;
		// @ts-expect-error
		BdApi.Patcher.after('hide', HeaderBarContainer, 'renderLoggedIn', (_: any, __: any, returnValue: any) => {
			returnValue.props.toolbar.props.children.push(<ToggleButton />);
		});
	}
	stop() {
		// @ts-expect-error
		BdApi.Patcher.unpatchAll('hide');
	}
}
