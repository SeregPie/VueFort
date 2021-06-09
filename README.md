# VueFort

The state management for Vue.

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
  createInstance,
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

Create a state.

```javascript
let state = reactive({count: 1});
```

Create an instance from the state.

```javascript
let instance = createInstance({
  state,
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

Access the properties and methods of the instance directly.

```javascript
console.log(instance.count); // => 1
console.log(instance.countDouble); // => 2

instance.inc();

console.log(instance.count); // => 2
console.log(instance.countDouble); // => 4
```

The changes to the underlying state are reflected back to the instance and vice versa.

```javascript
state.count = 8;

console.log(instance.count); // => 8

instance.inc();

console.log(state.count); // => 9
```

### state as function

The `state` property can also be a function for the reusable options.

```javascript
let instance = createInstance({
  state() {
    return {count: 1};
  },
});
```

### effect scope

When an instance is created during a component's `setup` function or lifecycle hooks, the instance is bound to the component's lifecycle and will be automatically destroyed when the component is unmounted.

In other cases, the instance can be explicitly destroyed by calling the `$destroy` function.

```javascript
instance.$destroy();

console.log(instance.$isDestroyed); // true
```

### nested instances

An instance can be explicitly bound to the scope of another instance via the `bind` option.

```javascript
let root = createInstance({
  state: {
    items: [],
  },
  methods: {
    addItem(label, value) {
      let {items} = this;
      let item = createInstance({
        state: {
          label,
          value,
        },
        bind: this,
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

## API

### toRefs

`toRefs(object)`

Creates an object where each property is a memoized reference pointing to the corresponding property of the original object.

```javascript
let data = reactive({a: 1});
console.log(toRefs(data).a === toRefs(data).a); // => true
```
