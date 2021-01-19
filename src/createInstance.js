import {reactive} from 'vue-demi';
import {
	computed,
	effectScope,
	extendScope,
	hasEffectScope,
	isEffectScope,
	stop,
	watch,
} from './vue';

import toRefs from './toRefs';
import getDeep from './utils/getDeep';
import isArray from './utils/isArray';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';
import isString from './utils/isString';

function createPathGetter(value, key) {
	let keys = key.split('.');
	return ((keys.length === 1)
		? (() => value[key])
		: (() => getDeep(value, keys))
	);
}

function createWatcher(that, v, k) {
	let getter = createPathGetter(that, k);
	let f = (v => {
		let callback;
		let options;
		if (isString(v)) {
			callback = that[v];
		} else
		if (isFunction(v)) {
			callback = v.bind(that);
		} else
		if (isObject(v)) {
			({handler: v, ...options} = v);
			if (isString(v)) {
				callback = that[v];
			} else
			if (isFunction(v)) {
				callback = v.bind(that);
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
	if (isArray(v)) {
		v.forEach(f);
	} else {
		f(v);
	}
}

function createEffectScope(v, fn) {
	if (v === true) {
		return effectScope(fn);
	}
	if (v === false) {
		// todo
	}
	if (isEffectScope(v) || hasEffectScope(v)) {
		let scope;
		extendScope(v, () => {
			scope = effectScope(fn);
		});
		return scope;
	}
	// warn
}

export default function({
	state = {},
	getters = {},
	watch = {},
	methods = {},
	bind = true,
} = {}) {
	let isDestroyed = false;
	let scope = createEffectScope(bind, onStop => {
		onStop(() => {
			isDestroyed = true;
		});
	});
	let that = {};
	Object.defineProperties(that, {
		$effectScope: {
			value: scope,
		},
		$destroy: {
			value() {
				stop(scope);
			},
		},
		$isDestroyed: {
			get() {
				return isDestroyed;
			},
		},
	});
	extendScope(scope, () => {
		Object.entries(toRefs(reactive(state))).forEach(([k, ref]) => {
			Object.defineProperty(that, k, {
				enumerable: true,
				get() {
					return ref.value;
				},
				set(value) {
					ref.value = value;
				},
			});
		});
		Object.entries(getters).forEach(([k, v]) => {
			if (isFunction(v)) {
				let ref = computed(v.bind(that));
				Object.defineProperty(that, k, {
					enumerable: true,
					get() {
						return ref.value;
					},
				});
			} else {
				// warn
			}
		});
		Object.entries(methods).forEach(([k, v]) => {
			if (isFunction(v)) {
				Object.defineProperty(that, k, {
					enumerable: true,
					value: v.bind(that),
				});
			} else {
				// warn
			}
		});
		Object.entries(watch).forEach(([k, v]) => {
			createWatcher(that, v, k);
		});
	});
	return that;
}
