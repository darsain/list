# List

Minimalistic reimplementation of a native Array as an array like object.

The purpose of List is to be extensible so you can create special arrays with custom behavior. Read more in the [Extending section](#extending) below.

Also look at [Limitations](#limitations).

#### Extensions

- [darsain/sortedlist](https://github.com/darsain/sortedlist) -
	Makes sure the list is sorted by using binary search when inserting new items. Supports custom sorting function.

- [darsain/uniquelist](https://github.com/darsain/uniquelist) -
	Makes sure the list has only unique items without duplicates. Supports custom comparing function.

- [darsain/uniquesortedlist](https://github.com/darsain/uniquesortedlist) -
	Makes sure the list is both sorted **and** unique. Supports custom sorting function.

## Install

With [component(1)](https://github.com/component/component):

```bash
component install darsain/list
```

## Usage

```js
var List = require('list');
var list = List(['a', 'b', 'c']);
list[2];     // 'c'
list.length; // 3
list.push('d');
list.length; // 4
list[3];     // 'd'
```

## API

### List([array])

List constructor. `new` keyword is optional.

#### [array]

Array, or an array-like object to create a List from.

Can be `Array`, `List`, `NodeList`, `arguments`, ... everything that looks like `{ 0: 'foo', length: 1 }`.

#### *Inherits all methods from Array.prototype with some notable behaviors:*

- `#concat()` - Returns a native Array.
- `#filter()` - Returns a native Array.
- `#map()` - Returns a native Array.
- `#slice()` - Returns a native Array.
- `#splice()` - Returns a native Array.

*Methods documented below are either new, or vary from their previous behavior.*

### #add(mixed1, ..., mixedN)

Works exactly like `#concat()`, but mutates the original List instead of returning a new Array.

Example:

```js
var list = new List();
a.add(1, [2, 3], 4);
console.log(a); // [1, 2, 3, 4]
```

### #each()

Alias to `#forEach()`.

### #reset()

Deletes all items and resets the list length to `0`. An alternative to:

```js
array.length = 0;
```

### #toArray()

Returns a native array.

## Limitations

List is an object pretending to be an Array. This means there are some limitations.

```js
var list = new List();
Array.isArray(list);    // false
list[list.length] = 42; // list.length won't be updated, use #push()
list.length = 0;        // doesn't reset the list, use #reset()
list instanceof Array;  // true, but don't use it! context issues
```

If you want to check for List, use `instanceof List`, or something like [darsain/isarraylike](https://github.com/darsain/isarraylike).

#### for...in

List **can** be for...in looped:

```js
var array = new List(['a', 'b', 'c']);
for (var i in array) console.log(array[i]);
// logs 'a', 'b', 'c'
```

But this works only in browsers that support `Object.defineProperty` (IE9+), otherwise it'll also loop through method names and `.length` property.

## Extending

Basic example (using [component/inherit](https://github.com/component/inherit)):

```js
var List = require('list');
var inherit = require('inherit');

module.exports = MyList;

function MyList(array) {
	if (!(this instanceof MyList)) return new MyList(array);
	List.apply(this, arguments);
}

inherit(MyList, List);

// override #push() method
MyList.prototype.push = function push(item) {
	// do something special
	return List.prototype.push.apply(this, arguments);
};
```

This works, but `#constructor` and `#push()` are now enumerable, which breaks for...in looping. To fix that, you have to define methods with `Object.defineProperty` and make them non-enumerable. You can use [darsain/definer](https://github.com/darsain/definer) as a lightweight `Object.defineProperty` wrapper that falls back to a dumb `obj.prop = value` for browsers that don't support it.

```js
var List = require('list');
var inherit = require('inherit');
var definer = require('definer');

module.exports = MyList;

function MyList(array) {
	if (!(this instanceof MyList)) return new MyList(array, comparator);
	List.apply(this, arguments);
}

inherit(MyList, List);

// create a definer instance for MyList.prototype object
var proto = definer(MyList.prototype);

// define non-enumerable properties
proto.define('constructor', MyList);
proto.define('push', function push(item) {
	// do something special
	return List.prototype.push.apply(this, arguments);
});

// or the same with chaining
definer(MyList.prototype)
	.define('constructor', MyList)
	.define('push', function push(item) {
		// do something special
		return List.prototype.push.apply(this, arguments);
	});

// less verbose with definer's type() method
definer(MyList.prototype)
	.type('m')
	.m('constructor', MyList)
	.m('push', function push(item) {
		// do something special
		return List.prototype.push.apply(this, arguments);
	});
```

Wee need to redefine `#constructor` because [component/inherit](https://github.com/component/inherit) isn't using defineProperty, thus making it enumerable.

If you need to create and return a new List from a method, use `new this.constructor()` instead of `new YourList()`! You never know the instance of which constructor you're working with. It can be `YourList`, but it can be `YourSuperList` which extends it.

Example:

```js
definer(MyList.prototype)
	// clone a List
	.define('clone', function () {
		return new MyList(this); // wrong
		return new this.constructor(this); // correct
	});
```

## Testing

To run tests:

```
component build --dev
```

And open `test/index.html`

## License

MIT