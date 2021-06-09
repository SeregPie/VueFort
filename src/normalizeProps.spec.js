import normalizeProps from './normalizeProps';

describe('normalizeProps', () => {
	test('as array', () => {
		let props = normalizeProps([
			'a',
			'b',
			'c',
		]);
		expect(props).toEqual({
			a: {},
			b: {},
			c: {},
		});
	});
	test('as object', () => {
		let props = {
			a: {
				default: 1,
				as: 'aa',
			},
			b: {
				detached: true,
			},
			c: {},
		};
		expect(normalizeProps(props)).toEqual(props);
	});
});
