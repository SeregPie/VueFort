import {
	isVue2,
	isVue3,
	reactive,
	readonly,
	ref,
	watch,
} from 'vue-demi';
import toRefs from './toRefs';

describe('toRefs', () => {
	test('object', () => {
		let state = {n: 1};
		if (isVue3) {
			expect(toRefs(state).n).not.toBe(toRefs(state).n);
			expect(toRefs(state).n).not.toBe(toRefs(reactive(state)).n);
			expect(toRefs(state).n).not.toBe(toRefs(readonly(state)).n);
			expect(toRefs(state).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(state).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(state)).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(readonly(state)).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(state)).n).not.toBe(toRefs(readonly(state)).n);
			expect(toRefs(readonly(state)).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(readonly(state)).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(readonly(state))).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(readonly(state))).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(reactive(state))).n).toBe(toRefs(readonly(reactive(state))).n);
		} else
		if (isVue2) {
			expect(toRefs(state).n).not.toBe(toRefs(state).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(state)).n);
		}
	});
	test('object with ref', () => {
		let state = {n: ref(1)};
		if (isVue3) {
			expect(toRefs(state).n).toBe(toRefs(state).n);
			expect(toRefs(state).n).toBe(toRefs(reactive(state)).n);
			expect(toRefs(state).n).not.toBe(toRefs(readonly(state)).n);
			expect(toRefs(state).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(state).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(state)).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(readonly(state)).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(state)).n).not.toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(readonly(state)).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(readonly(state))).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(readonly(state))).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(reactive(state))).n).toBe(toRefs(readonly(reactive(state))).n);
		} else
		if (isVue2) {
			expect(toRefs(state).n).toBe(toRefs(state).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(state)).n);
		}
	});
	test('object with readonly ref', () => {
		let state = {n: readonly(ref(1))};
		if (isVue3) {
			expect(toRefs(state).n).toBe(toRefs(state).n);
			expect(toRefs(state).n).toBe(toRefs(reactive(state)).n);
			expect(toRefs(state).n).toBe(toRefs(readonly(state)).n);
			expect(toRefs(state).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(state).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(state)).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(readonly(state)).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(state)).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(readonly(state)).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(readonly(state)).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(reactive(readonly(state))).n).toBe(toRefs(reactive(readonly(state))).n);
			expect(toRefs(reactive(readonly(state))).n).toBe(toRefs(readonly(reactive(state))).n);
			expect(toRefs(readonly(reactive(state))).n).toBe(toRefs(readonly(reactive(state))).n);
		}
	});
	test('watch', () => {
		let spy = jest.fn();
		let state = reactive({n: 1});
		watch(
			() => toRefs(state),
			spy,
			{flush: 'sync'},
		);
		state.n++;
		expect(spy).not.toHaveBeenCalled();
	});
});
