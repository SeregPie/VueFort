import {reactive} from 'vue-demi';
import applyMethods from './applyMethods';

describe('applyMethods', () => {
	test('basic', () => {
		let state = reactive({count: 1});
		let instance = {
			get count() {
				return state.count;
			},
			set count(value) {
				state.count = value;
			},
			get countDouble() {
				return this.count * 2;
			},
		};
		applyMethods(instance, {
			inc() {
				this.count++;
			},
		});
		expect(state.count).toBe(1);
		expect(instance.count).toBe(1);
		expect(instance.countDouble).toBe(2);
		instance.inc();
		expect(state.count).toBe(2);
		expect(instance.count).toBe(2);
		expect(instance.countDouble).toBe(4);
		state.count = 3;
		expect(state.count).toBe(3);
		expect(instance.count).toBe(3);
		expect(instance.countDouble).toBe(6);
		instance.inc();
		expect(state.count).toBe(4);
		expect(instance.count).toBe(4);
		expect(instance.countDouble).toBe(8);
	});
});
