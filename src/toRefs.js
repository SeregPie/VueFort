import {
	isReactive,
	isReadonly,
	isRef,
	shallowReadonly,
	shallowRef,
	toRaw,
} from 'vue-demi';
import {isObject} from '@vue/shared';

import createObjectPropertyRef from './createObjectPropertyRef';

let mapReactiveObjectToRefs = new WeakMap();

export default function(object) {
	let result = {};
	if (isObject(object)) {
		if (isReactive(object)) {
			let refs = mapReactiveObjectToRefs.get(object);
			if (!refs) {
				refs = {};
				mapReactiveObjectToRefs.set(object, refs);
			}
			let raw = toRaw(object);
			if (isReadonly(object)) {
				Object.keys(object).forEach(key => {
					let ref = refs[key];
					if (!ref) {
						if (isReactive(raw)) {  // isVue2
							ref = shallowReadonly(createObjectPropertyRef(object, key));
						} else {
							let value = raw[key];
							ref = (isRef(value)
								? (isReadonly(value)
									? value
									: shallowReadonly(value)
								)
								: shallowReadonly(createObjectPropertyRef(object, key))
							);
						}
						refs[key] = ref;
					}
					result[key] = ref;
				});
			} else {
				Object.keys(object).forEach(key => {
					let ref = refs[key];
					if (!ref) {
						if (isReactive(raw)) {  // isVue2
							ref = createObjectPropertyRef(object, key);
						} else {
							let value = raw[key];
							ref = (isRef(value)
								? value
								: createObjectPropertyRef(object, key)
							);
						}
						refs[key] = ref;
					}
					result[key] = ref;
				});
			}
		} else {
			if (isReadonly(object)) {
				object = toRaw(object);
				Object.entries(object).forEach(([key, value]) => {
					result[key] = (isRef(value)
						? (isReadonly(value)
							? value
							: shallowReadonly(value)
						)
						: shallowReadonly(shallowRef(value))
					);
				});
			} else {
				Object.entries(object).forEach(([key, value]) => {
					result[key] = (isRef(value)
						? value
						: shallowRef(value)
					);
				});
			}
		}
	}
	return result;
}
