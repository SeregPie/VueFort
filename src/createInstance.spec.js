import {
	reactive,
	watch,
} from 'vue-demi';
import createInstance from './createInstance';

describe('createInstance', () => {
	test('basic functionality', () => {
		let state = reactive({count: 1});
		let instance = createInstance({
			state,
			getters: {
				countDouble() {
					return this.count * 2;
				},
			},
			methods: {
				inc() {
					this.count++;
				},
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
	test('destroy instance', () => {
		let state = reactive({count: 1});
		let spy = jest.fn();
		let instance = createInstance({
			state,
			getters: {
				countDouble() {
					return this.count * 2;
				},
			},
		});
		watch(
			() => instance.countDouble,
			spy,
			{flush: 'sync'},
		);
		expect(spy).not.toHaveBeenCalled();
		state.count++;
		expect(instance.countDouble).toBe(4);
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockClear();
		instance.$destroy();
		expect(instance.$isDestroyed).toBe(true);
		state.count++;
		expect(instance.countDouble).toBe(4);
		expect(spy).not.toHaveBeenCalled();
	});
	test('destroy nested instances', () => {
		let root = createInstance({
			state: {
				items: [],
			},
			methods: {
				addItem() {
					let {items} = this;
					let item = createInstance({
						bind: this,
					});
					items.push(item);
					return item;
				},
			},
		});
		let item = root.addItem();
		item.$destroy();
		expect(item.$isDestroyed).toBe(true);
		expect(root.$isDestroyed).toBe(false);
		root.addItem();
		root.addItem();
		root.addItem();
		root.$destroy();
		expect(root.$isDestroyed).toBe(true);
		expect(root.items.every(item => item.$isDestroyed)).toBe(true);
	});
});
