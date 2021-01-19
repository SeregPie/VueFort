let assert = require('assert/strict');

(async f => {
	let run = async function(modules) {
		modules = Object.entries(modules).reduce((result, [id, path]) => {
			path = require.resolve(path);
			delete require.cache[path];
			result[id] = path;
			return result;
		}, {});
		module.constructor.prototype.require = function(id) {
			return this.constructor._load(modules[id] ?? id, this);
		};
		await f();
	};
	await run({
		'vue': 'vue-v3',
		'vue-demi': 'vue-demi/lib/v3/index.cjs.js',
		'vue-fort': './',
	});
	await run({
		'vue': 'vue-v2',
		'vue-demi': 'vue-demi/lib/v2/index.cjs.js',
		'vue-fort': './',
	});
})(async () => {
	let {
		isVue2,
		isVue3,
		reactive,
		readonly,
		ref,
		watch,
	} = require('vue-demi');
	let {
		createInstance,
		toRefs,
	} = require('vue-fort');
	if (isVue3) {
		let state = {n: 1};
		assert.notEqual(toRefs(state).n, toRefs(state).n);
		assert.notEqual(toRefs(state).n, toRefs(reactive(state)).n);
		assert.notEqual(toRefs(state).n, toRefs(readonly(state)).n);
		assert.notEqual(toRefs(state).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(state).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(state)).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(readonly(state)).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(readonly(reactive(state))).n);
		assert.notEqual(toRefs(readonly(state)).n, toRefs(readonly(state)).n);
		assert.notEqual(toRefs(readonly(state)).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(readonly(state)).n, toRefs(readonly(reactive(state))).n);
		assert.notEqual(toRefs(reactive(readonly(state))).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(reactive(readonly(state))).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(readonly(reactive(state))).n, toRefs(readonly(reactive(state))).n);
	} else
	if (isVue2) {
		let state = {n: 1};
		assert.notEqual(toRefs(state).n, toRefs(state).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(state)).n);
	}
	if (isVue3) {
		let state = {n: ref(1)};
		assert.equal(toRefs(state).n, toRefs(state).n);
		assert.equal(toRefs(state).n, toRefs(reactive(state)).n);
		assert.notEqual(toRefs(state).n, toRefs(readonly(state)).n);
		assert.notEqual(toRefs(state).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(state).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(state)).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(readonly(state)).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(reactive(readonly(state))).n);
		assert.notEqual(toRefs(reactive(state)).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(readonly(state)).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(reactive(readonly(state))).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(reactive(readonly(state))).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(readonly(reactive(state))).n, toRefs(readonly(reactive(state))).n);
	} else
	if (isVue2) {
		let state = {n: ref(1)};
		assert.equal(toRefs(state).n, toRefs(state).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(state)).n);
	}
	if (isVue3) {
		let state = {n: readonly(ref(1))};
		assert.equal(toRefs(state).n, toRefs(state).n);
		assert.equal(toRefs(state).n, toRefs(reactive(state)).n);
		assert.equal(toRefs(state).n, toRefs(readonly(state)).n);
		assert.equal(toRefs(state).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(state).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(state)).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(readonly(state)).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(reactive(state)).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(readonly(state)).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(readonly(state)).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(reactive(readonly(state))).n, toRefs(reactive(readonly(state))).n);
		assert.equal(toRefs(reactive(readonly(state))).n, toRefs(readonly(reactive(state))).n);
		assert.equal(toRefs(readonly(reactive(state))).n, toRefs(readonly(reactive(state))).n);
	}
	{
		let state = reactive({n: 1});
		let t = 0;
		watch(
			() => toRefs(state),
			() => {
				t++;
			},
			{flush: 'sync'},
		);
		state.n++;
		assert.equal(t, 0);
	}
	{
		let state = reactive({count: 1});
		let instance = createInstance({
			state,
			getters: {
				countDouble() {
					return this.count * 2;
				},
			},
			watch: {
				countDouble: {
					handler(value) {
						if (value > 8) {
							this.count = 0;
						}
					},
					immediate: true,
					flush: 'sync',
				},
			},
			methods: {
				inc() {
					this.count++;
				},
			},
		});
		assert.equal(state.count, 1);
		assert.equal(instance.count, 1);
		assert.equal(instance.countDouble, 2);
		instance.inc();
		assert.equal(state.count, 2);
		assert.equal(instance.count, 2);
		assert.equal(instance.countDouble, 4);
		state.count = 3;
		assert.equal(state.count, 3);
		assert.equal(instance.count, 3);
		assert.equal(instance.countDouble, 6);
		instance.inc();
		assert.equal(state.count, 4);
		assert.equal(instance.count, 4);
		assert.equal(instance.countDouble, 8);
		instance.inc();
		assert.equal(state.count, 0);
		assert.equal(instance.count, 0);
		assert.equal(instance.countDouble, 0);
	}
	{
		let state = reactive({count: 1});
		let t = 0;
		let instance = createInstance({
			state,
			getters: {
				countDouble() {
					return this.count * 2;
				},
			},
			watch: {
				countDouble: {
					handler() {
						t++;
					},
					flush: 'sync',
				},
			},
		});
		watch(
			() => instance.countDouble,
			() => {
				t++;
			},
			{flush: 'sync'},
		);
		assert.equal(t, 0);
		state.count++;
		assert.equal(t, 2);
		instance.$destroy();
		assert.equal(instance.$isDestroyed, true);
		state.count++;
		assert.equal(t, 2);
	}
	{
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
		assert.equal(item.$isDestroyed, true);
		assert.equal(root.$isDestroyed, false);
		root.addItem();
		root.addItem();
		root.addItem();
		root.$destroy();
		assert.equal(root.$isDestroyed, true);
		assert.equal(root.items.every(item => item.$isDestroyed), true);
	}
	{
		let root = createInstance({
			state: {
				items: [],
			},
			methods: {
				async addItem() {
					await new Promise(resolve => {
						setTimeout(resolve, 1);
					});
					let {items} = this;
					let item = createInstance({
						bind: this,
					});
					items.push(item);
					return item;
				},
			},
		});
		let item = await root.addItem();
		item.$destroy();
		assert.equal(item.$isDestroyed, true);
		assert.equal(root.$isDestroyed, false);
		await root.addItem();
		await root.addItem();
		await root.addItem();
		root.$destroy();
		assert.equal(root.$isDestroyed, true);
		assert.equal(root.items.every(item => item.$isDestroyed), true);
	}
});
