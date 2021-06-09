import isObject from './utils/isObject';

import defineProperty from './defineProperty';

export default function(target, v) {
	if (v !== undefined) {
		if (isObject(v)) {
			Object.keys(v).forEach(k => {
				defineProperty(target, k, {
					get() {
						return v[k];
					},
					set(value) {
						v[k] = value;
					},
				});
			});
		} else {
			// warn
		}
	}
}
