import {proxyRefs} from 'vue';

import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

import applyProxy from './applyProxy';

export default function(target, v, ...args) {
	if (v !== undefined) {
		if (isFunction(v)) {
			v = v.apply(target, args);
			if (v !== undefined) {
				if (isObject(v)) {
					v = proxyRefs(v);
					applyProxy(target, v);
				} else {
					// warn
				}
			}
		} else {
			// warn
		}
	}
}
