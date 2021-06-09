import {watch} from './vue';

import getDeep from './utils/getDeep';
import isArray from './utils/isArray';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';
import isString from './utils/isString';

export default function(target, v) {
	if (v !== undefined) {
		if (isObject(v)) {
			Object.entries(v).forEach(([k, v]) => {
				let getter = (key => {
					let keys = key.split('.');
					return ((keys.length === 1)
						? (() => target[key])
						: (() => getDeep(target, keys))
					);
				})(k);
				(f => {
					if (isArray(v)) {
						v.forEach(f);
					} else {
						f(v);
					}
				})(v => {
					let callback;
					let options;
					if (isString(v)) {
						callback = target[v];
					} else
					if (isFunction(v)) {
						callback = v.bind(target);
					} else
					if (isObject(v)) {
						({handler: v, ...options} = v);
						if (isString(v)) {
							callback = target[v];
						} else
						if (isFunction(v)) {
							callback = v.bind(target);
						} else {
							// warn
						}
					} else {
						// warn
					}
					watch(
						getter,
						callback,
						options,
					);
				});
			});
		} else {
			// warn
		}
	}
}
