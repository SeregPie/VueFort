import {shallowRef} from 'vue-demi';
import {
	computed,
	effectScope,
	extendScope,
	hasEffectScope,
	isEffectScope,
	stop,
	watch,
} from './vue';

import {
	getDeep,
	isArray,
	isFunction,
	isObject,
	isString,
} from './utils';

import createRef from './createRef';
import customEffect from './customEffect';
import toRefs from './toRefs';

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

function isPrivateProperty(k) {
	return k.startsWith('_');
}

function createInstance(model, data, {
	bind = true,
} = {}) {
	let dataRefs = {};
	let dataSetters = {};
	let updateDataRefs = (value => {
		(Object
			.entries(dataSetters)
			.forEach(([k, set]) => {
				set(value[k]);
			})
		);
	});
	(Object
		.entries(toRefs(data))
		.forEach(([k, ref]) => {
			let {track, trigger} = customEffect();
			dataRefs[k] = createRef({
				get() {
					track();
					return ref.value;
				},
				set(value) {
					ref.value = value;
				},
			});
			dataSetters[k] = (value => {
				if (ref !== value) {
					ref = value;
					trigger();
				}
			});
		})
	);
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
		$update: {
			value(data) {
				updateDataRefs(toRefs(data));
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
		let refs = {...dataRefs};
		let {
			options: {
				state: stateFn,
				getters,
				watch: watchProperties,
				methods,
			} = {},
		} = model;
		if (stateFn) {
			if (isFunction(stateFn)) {
				Object.assign(refs, toRefs(stateFn({...dataRefs})));
			} else {
				// warn
			}
		}
		let descriptors = {};
		(Object
			.entries(refs)
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
		if (getters) {
			(Object
				.entries(getters)
				.forEach(([k, v]) => {
					if (isFunction(v)) {
						let ref = computed(v.bind(that));
						descriptors[k] = {
							get() {
								return ref.value;
							},
						};
					} else {
						// warn
					}
				})
			);
		}
		if (methods) {
			(Object
				.entries(methods)
				.forEach(([k, v]) => {
					if (isFunction(v)) {
						descriptors[k] = {
							value: v.bind(that),
						};
					} else {
						// warn
					}
				})
			);
		}
		(Object
			.entries(descriptors)
			.forEach(([key, descriptor]) => {
				Object.assign(descriptor, {
					enumerable: !isPrivateProperty(key),
				});
			})
		);
		Object.defineProperties(that, descriptors);
		if (watchProperties) {
			(Object
				.entries(watchProperties)
				.forEach(([k, v]) => {
					createWatcher(that, v, k);
				})
			);
		}
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
