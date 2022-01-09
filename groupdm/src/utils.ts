export function log_action(action_string: string, ...rest: any[]) {
	console.log(`%c${action_string}`, 'color:red;', ...rest);
}

export enum filter_mode {
	GROUP = 'GROUP',
	DM = 'DM',
	BOTH = 'BOTH'
}

export enum filter_mode_styles {
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
