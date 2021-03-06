import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

import {main} from './package.json';

let globals = {
	'vue-demi': 'VueDemi',
};

export default {
	external: Object.keys(globals),
	input: 'src/index.js',
	plugins: [
		nodeResolve(),
		babel({babelHelpers: 'bundled'}),
		terser(),
	],
	output: {
		file: main,
		format: 'umd',
		name: 'VueFort',
		globals,
	},
};
