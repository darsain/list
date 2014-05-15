var definer = require('definer');
var inherit = require('inherit');
var arrayProto = Array.prototype;
var writableDescriptor = { writable: true };

module.exports = List;

function isArrayLike(obj) {
	return typeof obj === 'object' && 'length' in obj;
}

function List(array) {
	if (!(this instanceof List)) return new List(array);
	definer(this).define('length', 0, writableDescriptor);
	if (isArrayLike(array)) this.add(array);
}

inherit(List, Array);

definer(List.prototype)
	.type('m')

	.m('constructor', List)

	/* modified native methods */
	.m('concat', concat)
	.m('filter', filter)
	.m('map', map)
	.m('slice', slice)
	.m('splice', splice)

	/* custom methods */
	.m('add', add)
	.m('each', arrayProto.forEach)
	.m('reset', reset)
	.m('toArray', toArray);

function concat() {
	var newList = new this.constructor(this);
	newList.add.apply(newList, arguments);
	return newList;
}

function filter(fun, thisArg) {
	var newList = new this.constructor();
	for (var i = 0; i < this.length; i++) {
		if (fun.call(thisArg, this[i], i, this)) newList.push(this[i]);
	}
	return newList;
}

function map(fun, thisArg) {
	var newList = new this.constructor();
	for (var i = 0; i < this.length; i++) newList.push(fun.call(thisArg, this[i], i, this));
	return newList;
}

function slice() {
	return new this.constructor(arrayProto.slice.apply(this, arguments));
}

function splice() {
	return new this.constructor(arrayProto.splice.apply(this, arguments));
}

function add() {
	var args = arguments;
	var a, i;
	for (a = 0; a < args.length; a++) {
		if (isArrayLike(args[a]))
			for (i = 0; i < args[a].length; i++) this.push(args[a][i]);
		else this.push(args[a]);
	}
	return this.length;
}

function reset() {
	while (this.length) delete this[--this.length];
}

function toArray() {
	var array = [];
	for (var i = 0; i < this.length; i++) array[i] = this[i];
	return array;
}