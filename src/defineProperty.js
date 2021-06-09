import isPrivateKey from './isPrivateKey';
import isReservedKey from './isReservedKey';

export default function(target, k, attrs) {
	if (!isReservedKey(k)) {
		if (!(k in target)) {
			Object.defineProperty(target, k, {
				configurable: false,
				enumerable: !isPrivateKey(k),
				...attrs,
			});
		} else {
			// warn
		}
	} else {
		// warn
	}
}
