import {customRef} from 'vue-demi';
import {
	isFunction,
	NOOP,
} from '@vue/shared';

export default function(arg) {
	let get;
	let set;
	if (isFunction(arg)) {
		get = arg;
		set = NOOP;
	} else {
		({get, set} = arg);
	}
	return customRef(() => ({get, set}));
}
