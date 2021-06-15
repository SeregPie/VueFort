import defineModel from './defineModel';
import isModel from './isModel';

describe('isModel', () => {
	test('gbejimfjxjtn', () => {
		let createInstance = defineModel(() => ({}));
		let instance = createInstance();
		expect(isModel(defineModel)).toBe(false);
		expect(isModel(createInstance)).toBe(true);
		expect(isModel(instance)).toBe(false);
		expect(isModel(null)).toBe(false);
		expect(isModel({})).toBe(false);
	});
});
