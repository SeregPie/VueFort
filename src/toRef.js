import dummyRef from './dummyRef';

export default function(object, key) {
	return dummyRef({
		get() {
			return object[key];
		},
		set(value) {
			object[key] = value;
		},
	});
}
