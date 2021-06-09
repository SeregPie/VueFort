import {
	reactive,
	shallowRef,
	toRefs,
	watch,
} from 'vue-demi';
import createInstance from './createInstance';

describe('createInstance', () => {
	test('basic', () => {
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
		let spy = jest.fn();
		let state = reactive({count: 1});
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
	test('props', () => {
		let model = {
			props: {
				a: {},
				b: {
					default: 'bbb',
				},
				c: {
					as: 'cc',
				},
				d: {
					detached: true,
				},
				e: {
					default: 'eee',
					as: 'ee',
				},
				f: {
					default: 'fff',
					detached: true,
				},
				g: {
					as: 'gg',
					detached: true,
				},
				h: {
					default: 'hhh',
					as: 'hh',
					detached: true,
				},
			},
			setup(props) {
				let propsRefs = toRefs(props);
				let state = reactive(propsRefs);
				return {state};
			},
		};
		let propsRef = shallowRef();
		let instance = createInstance(model, propsRef);
		expect(instance).toHaveProperty('a');
		expect(instance.a).toBeUndefined();
		expect(instance.state).toHaveProperty('a');
		expect(instance.state.a).toBeUndefined();
		expect(instance).toHaveProperty('b');
		expect(instance.b).toBe('bbb');
		expect(instance.state).toHaveProperty('b');
		expect(instance.state.b).toBe('bbb');
		expect(instance).not.toHaveProperty('c');
		expect(instance).toHaveProperty('cc');
		expect(instance.cc).toBeUndefined();
		expect(instance.state).not.toHaveProperty('c');
		expect(instance.state).toHaveProperty('cc');
		expect(instance.state.cc).toBeUndefined();
		expect(instance).not.toHaveProperty('d');
		expect(instance.state).toHaveProperty('d');
		expect(instance.state.d).toBeUndefined();
		expect(instance).not.toHaveProperty('e');
		expect(instance).toHaveProperty('ee');
		expect(instance.ee).toBe('eee');
		expect(instance.state).not.toHaveProperty('e');
		expect(instance.state).toHaveProperty('ee');
		expect(instance.state.ee).toBe('eee');
		expect(instance).not.toHaveProperty('f');
		expect(instance.state).toHaveProperty('f');
		expect(instance.state.f).toBe('fff');
		expect(instance).not.toHaveProperty('g');
		expect(instance.state).not.toHaveProperty('g');
		expect(instance.state).toHaveProperty('gg');
		expect(instance.state.gg).toBeUndefined();
		expect(instance).not.toHaveProperty('h');
		expect(instance.state).not.toHaveProperty('h');
		expect(instance.state).toHaveProperty('hh');
		expect(instance.state.hh).toBe('hhh');
		propsRef.value = {
			a: 'aaaa',
			b: 'bbbb',
			c: 'cccc',
			d: 'dddd',
			e: 'eeee',
			f: 'ffff',
			g: 'gggg',
			h: 'hhhh',
			i: 'iiii',
		};
		expect(instance).toHaveProperty('a');
		expect(instance.a).toBe('aaaa');
		expect(instance.state).toHaveProperty('a');
		expect(instance.state.a).toBe('aaaa');
		expect(instance).toHaveProperty('b');
		expect(instance.b).toBe('bbbb');
		expect(instance.state).toHaveProperty('b');
		expect(instance.state.b).toBe('bbbb');
		expect(instance).not.toHaveProperty('c');
		expect(instance).toHaveProperty('cc');
		expect(instance.cc).toBe('cccc');
		expect(instance.state).not.toHaveProperty('c');
		expect(instance.state).toHaveProperty('cc');
		expect(instance.state.cc).toBe('cccc');
		expect(instance).not.toHaveProperty('d');
		expect(instance.state).toHaveProperty('d');
		expect(instance.state.d).toBe('dddd');
		expect(instance).not.toHaveProperty('e');
		expect(instance).toHaveProperty('ee');
		expect(instance.ee).toBe('eeee');
		expect(instance.state).not.toHaveProperty('e');
		expect(instance.state).toHaveProperty('ee');
		expect(instance.state.ee).toBe('eeee');
		expect(instance).not.toHaveProperty('f');
		expect(instance.state).toHaveProperty('f');
		expect(instance.state.f).toBe('ffff');
		expect(instance).not.toHaveProperty('g');
		expect(instance.state).not.toHaveProperty('g');
		expect(instance.state).toHaveProperty('gg');
		expect(instance.state.gg).toBe('gggg');
		expect(instance).not.toHaveProperty('h');
		expect(instance.state).not.toHaveProperty('h');
		expect(instance.state).toHaveProperty('hh');
		expect(instance.state.hh).toBe('hhhh');
		expect(instance).not.toHaveProperty('i');
		expect(instance.state).not.toHaveProperty('i');
	});
});
