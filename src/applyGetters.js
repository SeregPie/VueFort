import {computed} from './vue';

import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

import defineProperty from './defineProperty';

export default function(target, v) {
	if (v !== undefined) {
		if (isObject(v)) {
			Object.entries(v).forEach(([k, v]) => {
				if (isFunction(v)) {
					v = computed(v.bind(target));
					defineProperty(target, k, {
						get() {
							return v.value;
						},
					});
				} else {
					// warn
				}
			});
		} else {
			// warn
		}
	}
}
