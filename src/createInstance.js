import {
	effectScope,
	extendScope,
	hasEffectScope,
	isEffectScope,
	stop,
} from './vue';

import createObject from './utils/createObject';

import applyGetters from './applyGetters';
import applyMethods from './applyMethods';
import applyState from './applyState';
import applyWatch from './applyWatch';

export default function({
	state,
	getters,
	watch,
	methods,
	bind = true,
} = {}) {
	let isDestroyed = false;
	let scope = ((v, fn) => {
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
	})(bind, onStop => {
		onStop(() => {
			isDestroyed = true;
		});
	});
	let that = createObject();
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
		applyGetters(that, getters);
		applyMethods(that, methods);
		applyState(that, state);
		applyWatch(that, watch);
	});
	return that;
}
