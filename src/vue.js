import {
	getCurrentInstance,
	onUnmounted,
	shallowRef,
	watch,
} from 'vue-demi';
import {
	hasChanged,
	isFunction,
	NOOP,
} from '@vue/shared';

import createRef from './createRef';

function isEffect(value) {
	return !!(value && value.$isEffect === true);
}

function hasEffect(value) {
	return !!(value && value.$effect && isEffect(value.$effect));
}

let currentScope;

let mapScopeToOptions = new WeakMap();

function recordEffect(effect) {
	if (currentScope) {
		let {effects} = mapScopeToOptions.get(currentScope);
		effects.add(effect);
	} else
	if (getCurrentInstance()) {
		onUnmounted(() => {
			stop(effect);
		});
	}
}

function isEffectScope(value) {
	return mapScopeToOptions.has(value);
}

function hasEffectScope(value) {
	return !!(value && value.$effectScope && isEffectScope(value.$effectScope));
}

function stop(value) {
	if (isEffect(value)) {
		let {stop} = value;
		return stop();
	}
	if (isEffectScope(value)) {
		let {stop} = mapScopeToOptions.get(value);
		return stop();
	}
	if (hasEffect(value)) {
		return stop(value.$effect);
	}
	if (hasEffectScope(value)) {
		return stop(value.$effectScope);
	}
}

function effectScope(fn) {
	let onStopHooks = [];
	let onStop = (hook => {
		onStopHooks.push(hook);
	});
	let scope = {};
	let effects = new Set();
	let extend = (fn => {
		if (fn) {
			let previousScope = currentScope;
			currentScope = scope;
			try {
				Object.assign(scope, fn(onStop));
			} finally {
				currentScope = previousScope;
			}
		}
		return scope;
	});
	mapScopeToOptions.set(scope, {
		effects,
		extend,
		stop() {
			effects.forEach(effect => {
				stop(effect);
			});
			onStopHooks.forEach(hook => {
				hook();
			});
		},
	});
	recordEffect(scope);
	extend(fn);
	return scope;
}

function extendScope(value, fn) {
	if (isEffectScope(value)) {
		let {extend} = mapScopeToOptions.get(value);
		return extend(fn);
	}
	if (hasEffectScope(value)) {
		return extendScope(value.$effectScope, fn);
	}
}

function _computed(arg) {
	let get;
	let set;
	if (isFunction(arg)) {
		get = arg;
		set = NOOP;
	} else {
		({get, set} = arg);
	}
	let effect = {
		$isEffect: true,
		stop: NOOP,
	};
	recordEffect(effect);
	let ref;
	return createRef({
		get() {
			if (!ref) {
				effect.stop = watch(get, value => {
					if (!ref) {
						ref = shallowRef(value);
					} else {
						if (hasChanged(ref.value, value)) {
							ref.value = value;
						}
					}
				}, {
					flush: 'sync',
					immediate: true,
				});
			}
			return ref.value;
		},
		set,
	});
}

function _watch(...args) {
	let stop = watch(...args);
	let effect = {
		$isEffect: true,
		stop,
	};
	recordEffect(effect);
	return stop;
}

export {
	_computed as computed,
	_watch as watch,
	effectScope,
	extendScope,
	stop,
};
