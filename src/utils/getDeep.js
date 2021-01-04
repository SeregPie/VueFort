export default function(value, keys) {
	keys.forEach(key => {
		value = value[key];
	});
	return value;
}
