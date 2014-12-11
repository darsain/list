var definer = require('definer');
var inherit = require('inherit');
var isArrayLike = require('isarraylike');

module.exports = List;

var arrayProto = Array.prototype;
var writableDescriptor = { writable: true };

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

	/* custom methods */
	.m('add', add)
	.m('each', arrayProto.forEach)
	.m('reset', reset)
	.m('toArray', toArray);

function concat() {
	return arrayProto.concat.apply(this.toArray(), arguments);
}

function add() {
	var args = arguments;
	var a, i;
	for (a = 0; a < args.length; a++) {
		if (isArrayLike(args[a], 1)) {
			for (i = 0; i < args[a].length; i++) this.push(args[a][i]);
		} else {
			this.push(args[a]);
		}
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