# VueFort

Data modeling for Vue.

Works for Vue 2 & 3.

## dependencies

- [VueDemi](https://github.com/antfu/vue-demi)

## setup

### npm

```shell
npm i vue-fort

npm i @vue/composition-api # if using Vue 2
```

---

```javascript
import {
  defineModel,
  toRefs,
} from 'vue-fort';
```

### browser

```html
<!-- if using Vue 2 -->
<script src="https://unpkg.com/vue@2"></script>
<script src="https://unpkg.com/@vue/composition-api"></script>

<!-- if using Vue 3 -->
<script src="https://unpkg.com/vue@3"></script>

<script src="https://unpkg.com/vue-demi"></script>
<script src="https://unpkg.com/vue-fort"></script>
```

The module is globally available as `VueFort`.

## guide

### basics

Define a model.

```javascript
let model = defineModel({
  getters: {
    countDouble() {
      return this.count * 2;
    },
  },
  watch: {
    countDouble(value) {
      console.log(value);
    },
  },
  methods: {
    inc() {
      this.count++;
    },
  },
});
```

Create an instance from the data.

```javascript
let data = reactive({count: 1});

let instance = model(data);
```

Access the properties and methods of the instance directly.

```javascript
console.log(instance.count); // => 1
console.log(instance.countDouble); // => 2

instance.inc();

console.log(instance.count); // => 2
console.log(instance.countDouble); // => 4
```

The changes to the underlying data are reflected back to the instance and vice versa.

```javascript
data.count = 8;

console.log(instance.count); // => 8

instance.inc();

console.log(data.count); // => 9
```

### internal state

Use the `state` method to rename the passed references and add the new properties.

```javascript
let model = defineModel({
  state({tags}) {
    return {
      _tags: tags,
      updated: false,
    };
  },
  getters: {
    tags() {
      let {_tags: tags} = this;
      return [...(new Set(tags))].sort();
    },
  },
  methods: {
    addTag(tag) {
      let {_tags: tags} = this;
      tags.push(tag);
      this.updated = true;
    },
  },
});

let data = reactive({
  tags: ['fluffy', 'bright'],
});

let instance = model(data);

console.log(instance.tags); // => ['bright', 'fluffy']
console.log(instance.updated); // => false

instance.addTag('angry');

console.log(instance.tags); // => ['angry', 'bright', 'fluffy']
console.log(instance.updated); // => true
```

The instance does not overwrite or extend the underlying data.

```javascript
console.log(data.tags); // => ['fluffy', 'bright', 'angry']
console.log(data.updated); // => undefined
```

### effect scope

When the instance is created during a component's `setup` function or lifecycle hooks, the instance is linked to the component's lifecycle and will be automatically destroyed when the component is unmounted.

In other cases, the instance can be explicitly destroyed by calling the `$destroy` function.

```javascript
instance.$destroy();

console.log(instance.$isDestroyed); // true
```

### nested instances

The instances can be created and used within another instances. The instances are tied to the scope of the parent instance in which they were created.

```javascript
let itemModel = defineModel();

let rootModel = defineModel({
  state() {
    return {items: []};
  },
  methods: {
    addItem(label, value) {
      let {items} = this;
      let item = itemModel({
        label,
        value,
      });
      items.push(item);
    },
    delItem(index) {
      let {items} = this;
      let [item] = items.splice(index, 1);
      item.$destroy();
    },
  },
});

let root = rootModel();

root.addItem('a', 23);
root.addItem('b', 25);
root.addItem('c', 27);

console.log(root.items.length); // => 3

root.delItem(1);

console.log(root.items.length); // => 2
```

Destroying a parent instance will automatically destroy all its child instances.

```javascript
root.$destroy();

console.log(root.$isDestroyed); // true
console.log(root.items.every(item => item.$isDestroyed)); // true
```

### nested instances ???

...

```javascript
let itemModel = defineModel();

let rootModel = defineModel({
  state() {
    return {items: []};
  },
  methods: {
    async addItem(label) {
      let value = await addItem(label);
      let {items} = this;
      let item = itemModel({
        label,
        value,
      }, {
        bind: this,
      });
      items.push(item);
    },
  },
});
```

## API

### defineModel

```
defineModel({
  state,
  getters,
  watch,
  methods,
})
```

See the guide.

### toRefs

`toRefs(object)`

Creates an object where each property is a memoized reference pointing to the corresponding property of the original object.

```javascript
let data = reactive({a: 1});
console.log(toRefs(data).a === toRefs(data).a); // => true
```
