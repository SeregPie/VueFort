let {
	reactive,
	ref,
	toRefs,
	//watch,
	del,
	set,
	isVue2,
} = require('vue-demi');

let createItem = defineModel(props => {
	return {
		index: dummyRef(() => props.index),
		id: dummyRef(() => props.data.id),
		count: dummyRef({
			get() {
				return props.data.count;
			},
			set(value) {
				props.data.count = value;
			},
		}),
		countDouble: computed(() => this.count * 2),
		inc() {
			this.count++;
		},
		del() {
			let {root} = props;
			root.delItem(this.index);
		},
	};
});

let createRoot = defineModel(props => {
	let that = reactive({
		addItem() {
			let {items} = props.data;
			let item = {
				id: Math.random(),
				count: 0,
			};
			items.push(item);
			if (isVue2) {
				items = [...items];
				Object.assign(props.data, {items});
			}
			set(items, item.id, item);
		},
		delItem(id) {
			let {items} = props.data;
			let index = items.findIndex(item => item.id === id);
			if (index >= 0) {
				items.splice(index, 1);
			}
		},
		items: nested(c => {
			let result = {};
			let data = props.data.items;
			data.forEach(data => {
				let item = c(createItem, data.id, {
					data,
					index,
					root,
				});
				result[item.id] = item;
			});
			return result;
		}),
	});
	return that;
});

let data = reactive({
	items: [
		{
			id: 1,
			count: 44,
		},
		{
			id: 2,
			count: 23,
		},
	],
});
let root = createRoot({data});
{
	let {items} = root;
	Object.values(items).forEach(item => {
		console.log(item.countDouble);
	});
}
let item = root.addItem();
console.log(item.count);
console.log(item.countDouble);
item.del();
