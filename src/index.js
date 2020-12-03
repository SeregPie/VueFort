import {
	computed,
	effectScope,
	extendScope,
	stop,
	watch,
} from './vue';
import {
	isArray,
	isFunction,
	isObject,
	isString,
	NOOP,
} from '@vue/shared';

import toRefs from './toRefs';

function getDeep(value, keys) {
	keys.forEach(key => {
		value = value[key];
	});
	return value;
}

function createPathGetter(value, key) {
	let keys = key.split('.');
	return ((keys.length === 1)
		? (() => value[key])
		: (() => getDeep(value, keys))
	);
}

function createInstanceMethod(that, fn) {
	return function(...args) {
		let result;
		extendScope(that, () => {
			result = fn.apply(that, args);
		});
		return result;
	};
}

function createInstanceWatcher(that, getter, v) {
	if (isArray(v)) {
		v.forEach(v => {
			createInstanceWatcher(that, getter, v);
		});
	} else {
		let callback;
		let options;
		if (isString(v)) {
			callback = that[v];
		} else
		if (isFunction(v)) {
			callback = createInstanceMethod(that, v);
		} else
		if (isObject(v)) {
			({handler: v, ...options} = v);
			if (isString(v)) {
				callback = that[v];
			} else
			if (isFunction(v)) {
				callback = createInstanceMethod(that, v);
			}
		}
		watch(
			getter,
			callback,
			options,
		);
	}
}

function isPrivateProperty(key) {
	return key.startsWith('_');
}

function createInstance(model, data, {
	bind,
} = {}) {
	let that = {};
	let dataRefs = toRefs(data);
	let isDestroyed = false;
	let scopeFunc = (onStop => {
		onStop(() => {
			isDestroyed = true;
		});
	});
	let scope = (bind
		? extendScope(bind, scopeFunc)
		: effectScope(scopeFunc)
	);
	Object.defineProperties(that, {
		$model: {
			value: model,
		},
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
		let descriptors = {};
		let {
			options: {
				state = NOOP,
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
			.forEach(([key, ref]) => {
				descriptors[key] = {
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
			.forEach(([key, getter]) => {
				let ref = computed(createInstanceMethod(that, getter));
				descriptors[key] = {
					get() {
						return ref.value;
					},
				};
			})
		);
		(Object
			.entries(methods)
			.forEach(([key, method]) => {
				descriptors[key] = {
					value: createInstanceMethod(that, method),
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
			.forEach(([key, value]) => {
				let getter = createPathGetter(that, key);
				createInstanceWatcher(that, getter, value);
			})
		);
	});
	return that;
}

function defineModel(options) {
	let model = function(...args) {
		return createInstance(model, ...args);
	};
	Object.defineProperties(model, {
		options: {
			get() {
				return options;
			},
		},
	});
	return model;
}

export {
	defineModel,
	toRefs,
};
