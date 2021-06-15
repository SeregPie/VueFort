import createInstance from './createInstance';
import symbol from './ModelSymbol';

import isFunction from './utils/isFunction';
import partial from './utils/partial';
import stubObject from './utils/stubObject';

export default function(fn) {
	if (isFunction(fn)) {
		// ok
	} else {
		// warn
		fn = stubObject;
	}
	let result = partial(createInstance, fn);
	Object.defineProperties(result, {
		[symbol]: {value: true},
	});
	return result;
}
