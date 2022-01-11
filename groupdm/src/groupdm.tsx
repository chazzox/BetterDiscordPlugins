import './index.scss';

function log_action(action_string: string, ...rest: any[]) {
	console.log(`%c${action_string}`, 'color:red;', ...rest);
}

enum filter_mode {
	GROUP = 'GROUP',
	DM = 'DM',
	BOTH = 'BOTH'
}

enum filter_mode_styles {
	GROUP = `
a[aria-label~="\(direct"] {
	display: none;
}`,
	DM = `
a[aria-label~="\(group"] {
    display: none;
}`,
	BOTH = ``
}

// useful BdApi stuff
const { React, ReactDOM } = BdApi;

const siblingClassName = '.privateChannelsHeaderContainer-1UWASm';
const buttonContainerId = 'buttonFilterContainer';
const cssId = 'groupdm-filter';

function FilterButtons() {
	const [isGroup, setIsGroup] = React.useState<filter_mode>(BdApi.loadData('groupdm', 'isGroup'));

	React.useEffect(() => {
		BdApi.clearCSS(cssId);
		BdApi.injectCSS(cssId, filter_mode_styles[isGroup]);
	}, [isGroup]);

	const setIsGroupWithStore = (newVal: filter_mode) => {
		setIsGroup(newVal);
		BdApi.setData('groupdm', 'isGroup', newVal);
	};

	return (
		<>
			<button
				className={`filterButtons ${isGroup == filter_mode.BOTH ? 'selected' : ''}`}
				onClick={() => setIsGroupWithStore(filter_mode.BOTH)}
			>
				All
			</button>
			<button
				className={`filterButtons ${isGroup == filter_mode.DM ? 'selected' : ''}`}
				onClick={() => setIsGroupWithStore(filter_mode.DM)}
			>
				Friends
			</button>
			<button
				className={`filterButtons ${isGroup == filter_mode.GROUP ? 'selected' : ''}`}
				onClick={() => setIsGroupWithStore(filter_mode.GROUP)}
			>
				Groups
			</button>
		</>
	);
}

function create_dom_container() {
	const beforeEl = document.querySelector(siblingClassName);
	const buttonContainer = document.createElement('div');
	buttonContainer.id = buttonContainerId;
	beforeEl.insertAdjacentElement('afterend', buttonContainer);
}

async function render_filter_buttons() {
	if (document.querySelector(siblingClassName) && !document.getElementById(buttonContainerId)) {
		create_dom_container();
		ReactDOM.render(<FilterButtons />, document.getElementById(buttonContainerId));
	}
}

export default class groupdm {
	load() {
		BdApi.saveData('groupdm', 'isGroup', filter_mode.DM);
	}
	start() {
		log_action('[groupdm]', 'Started!');
		render_filter_buttons();
	}
	stop() {
		document.getElementById(buttonContainerId).remove();
		BdApi.clearCSS(cssId);
	}
	onSwitch() {
		render_filter_buttons();
	}
}
