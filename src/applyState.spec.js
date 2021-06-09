import applyState from './applyState';

describe('applyState', () => {
	test('as object', () => {
		let instance = {
			inc() {
				this.count++;
			},
			get countDouble() {
				return this.count * 2;
			},
		};
		applyState(instance, {count: 1});
		expect(instance.count).toBe(1);
		expect(instance.countDouble).toBe(2);
		instance.inc();
		expect(instance.count).toBe(2);
		expect(instance.countDouble).toBe(4);
	});
	test('as function', () => {
		let instance = {
			inc() {
				this.count++;
			},
			get countDouble() {
				return this.count * 2;
			},
		};
		applyState(instance, () => {
			return {count: 1};
		});
		expect(instance.count).toBe(1);
		expect(instance.countDouble).toBe(2);
		instance.inc();
		expect(instance.count).toBe(2);
		expect(instance.countDouble).toBe(4);
	});
});
