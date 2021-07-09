import {customRef} from 'vue-demi';

import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

export default function(v) {
	let get;
	let set;
	if (isFunction(v)) {
		get = v;
		set = (() => {
			// warn: setter is not defined
		});
	} else
	if (isObject(v)) {
		get = (v => {
			if (v !== undefined) {
				if (isFunction(v)) {
					return v;
				} else {
					// warn: getter is not a function
				}
			}
			return (() => {
				// warn: getter is not defined
			});
		})(v.get);
		set = (v => {
			if (v !== undefined) {
				if (isFunction(v)) {
					return v;
				} else {
					// warn: setter is not a function
				}
			}
			return (() => {
				// warn: setter is not defined
			});
		})(v.set);
	} else {
		get = (() => {
			// warn: getter is not defined
		});
		set = (() => {
			// warn: setter is not defined
		});
	}
	return customRef(() => ({get, set}));
}
