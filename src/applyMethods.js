import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

import defineProperty from './defineProperty';

export default function(target, v) {
	if (v !== undefined) {
		if (isObject(v)) {
			Object.entries(v).forEach(([k, v]) => {
				if (isFunction(v)) {
					defineProperty(target, k, {
						value: v.bind(target),
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
