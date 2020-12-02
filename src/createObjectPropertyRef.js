import createRef from './createRef';

export default function(object, key) {
	return createRef({
		get() {
			return object[key];
		},
		set(value) {
			object[key] = value;
		},
	});
}
