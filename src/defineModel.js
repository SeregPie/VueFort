import {
	reactive,
	shallowRef,
	unref,
} from 'vue';
import {
	computed,
	effectScope,
	proxyRefs,
	stop,
	watch,
} from './vue';

import createInstance from './createInstance';

export default function(options) {
	let optionsRef = shallowRef(options);
	let that = ((...args) => createInstance(that, ...args));
	Object.defineProperties(that, {
		options: {
			get() {
				return optionsRef.value;
			},
		},
		update: {
			value(options) {
				optionsRef.value = options;
			},
		},
	});
	return that;
}
