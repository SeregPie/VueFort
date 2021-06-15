import {customRef} from 'vue-demi';

import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

export default function(v) {
	let get;
	let set;
	if (isFunction(v)) {
		get = v;
		set = (() => {
			// warn
		});
	} else
	if (isObject(v)) {
		get = (v => {
			if (v !== undefined) {
				if (isFunction(v)) {
					return v;
				} else {
					// warn
				}
			}
			return (() => {
				// warn
			});
		})(v.get);
		set = (v => {
			if (v !== undefined) {
				if (isFunction(v)) {
					return v;
				} else {
					// warn
				}
			}
			return (() => {
				// warn
			});
		})(v.set);
	} else {
		get = (() => {
			// warn
		});
		set = (() => {
			// warn
		});
	}
	return customRef(() => ({get, set}));
}
