import {shallowRef} from 'vue-demi';

export default function() {
	let ref = shallowRef({});
	return {
		track() {
			ref.value;
		},
		trigger() {
			ref.value = {};
		},
	};
}
