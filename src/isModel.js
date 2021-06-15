import symbol from './ModelSymbol';

export default function(value) {
	return !!(value && value[symbol]);
}
