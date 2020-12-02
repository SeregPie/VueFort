import {
	computed,
	effectScope,
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
			callback = v.bind(that);
		} else
		if (isObject(v)) {
			({handler: v, ...options} = v);
			if (isString(v)) {
				callback = that[v];
			} else
			if (isFunction(v)) {
				callback = v.bind(that);
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

function createInstance(model, data) {
	let that = {};
	let scope = effectScope(onStop => {
		let descriptors = {};
		let {
			options: {
				state = NOOP,
				getters = {},
				watch: watchProperties = {},
				methods = {},
			} = {},
		} = model;
		let dataRefs = toRefs(data);
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
				let ref = computed(getter.bind(that));
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
					value: method.bind(that),
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
		let isDestroyed = false;
		onStop(() => {
			isDestroyed = true;
		});
		Object.assign(descriptors, {
			$model: {
				value: model,
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
