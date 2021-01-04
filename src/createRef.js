import {customRef} from 'vue-demi';

import isFunction from './utils/isFunction';
import noop from './utils/noop';

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
