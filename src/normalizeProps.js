import createObject from './utils/createObject';
import isArray from './utils/isArray';
import isObject from './utils/isObject';
import isString from './utils/isString';

export default function(v) {
	let result = createObject();
	if (v !== undefined) {
		if (isArray(v)) {
			v.forEach(v => {
				if (isString(v)) {
					result[v] = {};
				} else {
					// warn
				}
			});
		} else
		if (isObject(v)) {
			Object.entries(v).forEach(([k, v]) => {
				if (isObject(v)) {
					result[k] = v;
				} else {
					// warn
				}
			});
		} else {
			// warn
		}
	}
	return result;
}
