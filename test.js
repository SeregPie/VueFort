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
		defineModel,
		toRefs,
	} = require('vue-fort');
	if (isVue3) {
		let object = {n: 1};
		assert.notEqual(toRefs(object).n, toRefs(object).n);
		assert.notEqual(toRefs(object).n, toRefs(reactive(object)).n);
		assert.notEqual(toRefs(object).n, toRefs(readonly(object)).n);
		assert.notEqual(toRefs(object).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(object).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(object)).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(readonly(object)).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(readonly(reactive(object))).n);
		assert.notEqual(toRefs(readonly(object)).n, toRefs(readonly(object)).n);
		assert.notEqual(toRefs(readonly(object)).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(readonly(object)).n, toRefs(readonly(reactive(object))).n);
		assert.notEqual(toRefs(reactive(readonly(object))).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(reactive(readonly(object))).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(readonly(reactive(object))).n, toRefs(readonly(reactive(object))).n);
	} else
	if (isVue2) {
		let object = {n: 1};
		assert.notEqual(toRefs(object).n, toRefs(object).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(object)).n);
	}
	if (isVue3) {
		let object = {n: ref(1)};
		assert.equal(toRefs(object).n, toRefs(object).n);
		assert.equal(toRefs(object).n, toRefs(reactive(object)).n);
		assert.notEqual(toRefs(object).n, toRefs(readonly(object)).n);
		assert.notEqual(toRefs(object).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(object).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(object)).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(readonly(object)).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(reactive(readonly(object))).n);
		assert.notEqual(toRefs(reactive(object)).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(readonly(object)).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(reactive(readonly(object))).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(reactive(readonly(object))).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(readonly(reactive(object))).n, toRefs(readonly(reactive(object))).n);
	} else
	if (isVue2) {
		let object = {n: ref(1)};
		assert.equal(toRefs(object).n, toRefs(object).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(object)).n);
	}
	if (isVue3) {
		let object = {n: readonly(ref(1))};
		assert.equal(toRefs(object).n, toRefs(object).n);
		assert.equal(toRefs(object).n, toRefs(reactive(object)).n);
		assert.equal(toRefs(object).n, toRefs(readonly(object)).n);
		assert.equal(toRefs(object).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(object).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(object)).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(readonly(object)).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(reactive(object)).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(readonly(object)).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(readonly(object)).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(reactive(readonly(object))).n, toRefs(reactive(readonly(object))).n);
		assert.equal(toRefs(reactive(readonly(object))).n, toRefs(readonly(reactive(object))).n);
		assert.equal(toRefs(readonly(reactive(object))).n, toRefs(readonly(reactive(object))).n);
	}
	{
		let object = reactive({n: 1});
		let t = 0;
		watch(
			() => toRefs(object),
			() => {
				t++;
			},
			{flush: 'sync'},
		);
		object.n++;
		assert.equal(t, 0);
	}
	{
		let model = defineModel({
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
		let data = reactive({count: 1});
		let instance = model(data);
		assert.equal(data.count, 1);
		assert.equal(instance.count, 1);
		assert.equal(instance.countDouble, 2);
		instance.inc();
		assert.equal(data.count, 2);
		assert.equal(instance.count, 2);
		assert.equal(instance.countDouble, 4);
		data.count = 3;
		assert.equal(data.count, 3);
		assert.equal(instance.count, 3);
		assert.equal(instance.countDouble, 6);
		instance.inc();
		assert.equal(data.count, 4);
		assert.equal(instance.count, 4);
		assert.equal(instance.countDouble, 8);
		instance.inc();
		assert.equal(data.count, 0);
		assert.equal(instance.count, 0);
		assert.equal(instance.countDouble, 0);
	}
	{
		let t = 0;
		let model = defineModel({
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
		let data = reactive({count: 1});
		let instance = model(data);
		watch(
			() => instance.countDouble,
			() => {
				t++;
			},
			{flush: 'sync'},
		);
		assert.equal(t, 0);
		data.count++;
		assert.equal(t, 2);
		instance.$destroy();
		assert.equal(instance.$isDestroyed, true);
		data.count++;
		assert.equal(t, 2);
	}
	{
		let itemModel = defineModel();
		let rootModel = defineModel({
			state() {
				return {items: []};
			},
			methods: {
				addItem() {
					let {items} = this;
					let item = itemModel();
					items.push(item);
					return item;
				},
			},
		});
		{
			let root = rootModel();
			root.addItem();
			root.addItem();
			root.addItem();
			root.$destroy();
			assert.equal(root.$isDestroyed, true);
			assert.equal(root.items.every(item => item.$isDestroyed), true);
		}
		{
			let root = rootModel();
			let item = root.addItem();
			item.$destroy();
			assert.equal(item.$isDestroyed, true);
			assert.equal(root.$isDestroyed, false);
		}
	}
	{
		let itemModel = defineModel();
		let rootModel = defineModel({
			state() {
				return {items: []};
			},
			methods: {
				async addItem() {
					await new Promise(resolve => {
						setTimeout(resolve, 1);
					});
					let {items} = this;
					let item = itemModel({}, {
						bind: this,
					});
					items.push(item);
					return item;
				},
			},
		});
		{
			let root = rootModel();
			await root.addItem();
			await root.addItem();
			await root.addItem();
			root.$destroy();
			assert.equal(root.$isDestroyed, true);
			assert.equal(root.items.every(item => item.$isDestroyed), true);
		}
		{
			let root = rootModel();
			let item = await root.addItem();
			item.$destroy();
			assert.equal(item.$isDestroyed, true);
			assert.equal(root.$isDestroyed, false);
		}
	}
});
