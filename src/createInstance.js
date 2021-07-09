import {
	effectScope,
	proxyRefs,
} from 'vue';

import isObject from './utils/isObject';
import isFunction from './utils/isFunction';
import createObject from './utils/createObject';

export default function(fn, props) {
	let self = createObject();
	let scope = effectScope();
	scope.run(() => {
		effectScope(() => {
			if (v !== undefined) {
				if (isFunction(v)) {
					v = v.apply(self, props);
					if (v !== undefined) {
						if (isObject(v)) {
							v = proxyRefs(v);
							Object.keys(v).forEach(k => {
								defineProperty(self, k, {
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
				} else {
					// warn
				}
			}
		});
	});

	return self;
}
