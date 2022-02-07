const LOG_STYLES = {
	color: '#c3c6fc',
	background: '#2c2c2c',
	padding: '2px 0.5em',
	'border-radius': '0.5em',
	'font-weight': 'bold'
};

/**
 * `console.log` with the extension prefix that has nice styles
 * @param style the styles you want the log to
 * @param output data to log
 */
export function log(style = LOG_STYLES, prefix: string, ...output: any): void {
	console.log(
		`%c${prefix}`,
		Object.entries(style)
			.map(([a, b]) => `${a}:${b};`)
			.join(''),
		...output
	);
}
