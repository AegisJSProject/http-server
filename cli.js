import { serve } from './server.js';

const args = process.argv.slice(2).map(arg => arg.split('=')).flat();

/**
 *
 * @param {string|string[]} flag
 * @param {string} defaultValue
 * @returns {string|void}
 */
function getArg(flag, defaultValue) {
	const index = Array.isArray(flag) ? args.findIndex(arg => flag.includes(arg)) : args.indexOf(flag);

	return index === -1 ? defaultValue : args[index + 1] ?? defaultValue;
}

/**
 *
 * @param {string|string[]} flag
 * @returns {boolean}
 */
function hasArg(flag) {
	return Array.isArray(flag) ? flag.some(f => args.includes(f)) : args.includes(flag);
}

const config = hasArg(['-c', '--config']) ? await import(getArg(['-c', '--config'])) : {
	hostname: getArg(['-h', '--hostname']),
	port: parseInt(getArg(['-p', '--port'], '8000')),
	launch: hasArg(['-l', '--launch']),
	staticRoot: getArg(['-s', '--static']),
	signal: hasArg(['-t', '--timeout']) ? AbortSignal.timeout(parseInt(getArg(['-t', '--timeout'], '0')) || 0) : undefined,
};

const { url } = await serve(config);
console.log(`Now serving on ${url}`);
