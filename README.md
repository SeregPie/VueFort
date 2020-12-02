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

The instance is bound to the current scope.
When watchEffect is called during a component's setup() function or lifecycle hooks, the watcher is linked to the component's lifecycle and will be automatically stopped when the component is unmounted.

Destroy the instance by explicitly calling the `$destroy` function.

```javascript
instance.$destroy();

console.log(instance.$isDestroyed); // true
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
