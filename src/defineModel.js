import {shallowRef} from 'vue';

import createInstance from './createInstance';

export default function(options) {
	let optionsRef = shallowRef(options);
	let model = ((...args) => createInstance(model, ...args));
	Object.defineProperties(model, {
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
	return model;
}
