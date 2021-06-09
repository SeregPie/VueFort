import {reactive} from 'vue-demi';

import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

import applyProxy from './applyProxy';

export default function(target, v) {
	if (v !== undefined) {
		if (isFunction(v)) {
			v = v.call(target);
			if (v !== undefined) {
				if (isObject(v)) {
					v = reactive(v);
					applyProxy(target, v);
				} else {
					// warn
				}
			}
		} else
		if (isObject(v)) {
			v = reactive(v);
			applyProxy(target, v);
		} else {
			// warn
		}
	}
}
