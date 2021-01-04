import {
	reactive,
	shallowRef,
} from 'vue-demi';
import {
	computed,
	effectScope,
	extendScope,
	stop,
	watch,
} from './vue';

import getDeep from './utils/getDeep';
import isArray from './utils/isArray';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';
import isString from './utils/isString';
import noop from './utils/noop';

import createRef from './createRef';
import toRefs from './toRefs';

function createWatcher(instance, value, key) {
	let keys = key.split('.');
	let getter = ((keys.length === 1)
		? (() => instance[key])
		: (() => getDeep(instance, keys))
	);
	let f = (value => {
		let callback;
		let options;
		if (isString(value)) {
			callback = instance[value];
		} else
		if (isFunction(value)) {
			callback = value.bind(instance);
		} else
		if (isObject(value)) {
			({handler: value, ...options} = value);
			if (isString(value)) {
				callback = instance[value];
			} else
			if (isFunction(value)) {
				callback = value.bind(instance);
			}
		}
		watch(
			getter,
			callback,
			options,
		);
	});
	if (isArray(value)) {
		value.forEach(f);
	} else {
		f(value);
	}
}

function createEffectScope(value, fn) {
	if (value === true) {
		return effectScope(fn);
	}
	if (value === false) {
		// todo
	}
	let scope;
	extendScope(value, () => {
		scope = effectScope(fn);
	});
	return scope;
}

function isPrivateProperty(key) {
	return key.startsWith('_');
}

function createInstance(model, data, {
	bind = true,
} = {}) {
	let dataRefs = toRefs(data);
	let dataKeys = Object.keys(dataRefs);
	data = shallowRef(reactive(dataRefs));
	dataRefs = {};
	dataKeys.forEach(k => {
		dataRefs[k] = createRef({
			get() {
				return data.value[k];
			},
			set(value) {
				data.value[k] = value;
			},
		});
	});
	let isDestroyed = false;
	let scope = createEffectScope(bind, onStop => {
		onStop(() => {
			isDestroyed = true;
		});
	});
	let that = {};
	Object.defineProperties(that, {
		$model: {
			value: model,
		},
		$effectScope: {
			value: scope,
		},
		$data: {
			get() {
				return data.value;
			},
			set(value) {
				data.value = reactive(toRefs(value));
			},
		},
		$update: {
			value(data) {
				Object.assign(that, {
					$data: data,
				});
			},
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
		let descriptors = {};
		let {
			options: {
				state = noop,
				getters = {},
				watch: watchProperties = {},
				methods = {},
			} = {},
		} = model;
		(Object
			.entries({
				...dataRefs,
				...toRefs(state({...dataRefs})),
			})
			.forEach(([k, ref]) => {
				descriptors[k] = {
					get() {
						return ref.value;
					},
					set(value) {
						ref.value = value;
					},
				};
			})
		);
		(Object
			.entries(getters)
			.forEach(([k, v]) => {
				let ref = computed(v.bind(that));
				descriptors[k] = {
					get() {
						return ref.value;
					},
				};
			})
		);
		(Object
			.entries(methods)
			.forEach(([k, v]) => {
				descriptors[k] = {
					value: v.bind(that),
				};
			})
		);
		(Object
			.entries(descriptors)
			.forEach(([key, descriptor]) => {
				Object.assign(descriptor, {
					enumerable: !isPrivateProperty(key),
				});
			})
		);
		Object.defineProperties(that, descriptors);
		(Object
			.entries(watchProperties)
			.forEach(([k, v]) => {
				createWatcher(that, v, k);
			})
		);
	});
	return that;
}

function defineModel(options) {
	options = shallowRef(options);
	let that = function(...args) {
		return createInstance(that, ...args);
	};
	Object.defineProperties(that, {
		options: {
			get() {
				return options.value;
			},
			set(value) {
				options.value = value;
			},
		},
		update: {
			value(options) {
				Object.assign(that, {options});
			},
		},
	});
	return that;
}

function c(...args) {
	return createInstance(...args);
}

export {
	c,
	defineModel,
	toRefs,
};
