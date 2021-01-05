import {customRef} from 'vue-demi';

import {
	isFunction,
	noop,
} from './utils';

export default function(arg) {
	let get;
	let set;
	if (isFunction(arg)) {
		get = arg;
		set = noop;
	} else {
		({get, set} = arg);
	}
	return customRef(() => ({get, set}));
}
