import {
	customRef,
	getCurrentInstance,
	onUnmounted,
	watch,
} from 'vue-demi';
import {
	hasChanged,
	isFunction,
	NOOP,
} from '@vue/shared';

function isEffect(value) {
	return !!(value?.$isEffect);
}

let currentScope;

let mapScopeToOptions = new WeakMap();

function recordEffect(effect) {
	if (currentScope) {
		let {effects} = mapScopeToOptions.get(currentScope);
		effects.add(effect);
	}
}

function isEffectScope(value) {
	return mapScopeToOptions.has(value);
}

function stop(value) {
	if (isEffect(value)) {
		let {stop} = value;
		stop();
	} else
	if (isEffectScope(value)) {
		let {stop} = mapScopeToOptions.get(value);
		stop();
	}
}

function effectScope(fn) {
	let onStopHooks = [];
	let onStop = (hook => {
		onStopHooks.push(hook);
	});
	let scope = {};
	let effects = new Set();
	mapScopeToOptions.set(scope, {
		effects,
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
	{
		let previousScope = currentScope;
		currentScope = scope;
		try {
			Object.assign(scope, fn(onStop));
		} finally {
			currentScope = previousScope;
		}
	}
	if (getCurrentInstance()) {
		onUnmounted(() => {
			stop(scope);
		});
	}
	return scope;
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
	return customRef((track, trigger) => {
		let ref;
		return {
			get() {
				if (!ref) {
					effect.stop = watch(get, value => {
						if (!ref) {
							ref = {value};
						} else {
							if (hasChanged(ref.value, value)) {
								ref.value = value;
								trigger();
							}
						}
					}, {
						flush: 'sync',
						immediate: true,
					});
				}
				track();
				return ref.value;
			},
			set,
		};
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
	stop,
};
