var List = require('list');
var assert = require('assert');
var isArray = require('isarray');

/**
 * Compares an array like objects.
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 */
function compare(a, b) {
	try {
		if (a.length !== b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false;
		}
	} catch (e) {
		return false;
	}
	return true;
}

describe('List([array])', function () {
	it('should inherit from Array', function () {
		assert(new List() instanceof Array);
	});
	it('should not require a new keyword' , function () {
		assert(List() instanceof List);
	});
	it('should initialize empty when nothing is passed', function () {
		var list = new List();
		assert(list[0] == null);
		assert(list.length === 0);
	});
	it('should initialize empty when non array-like object is passed', function () {
		var list = new List('foo');
		assert(list[0] == null);
		assert(list.length === 0);
	});
	it('should absorb an Array when passed as 1st argument', function () {
		var a = 'abc'.split('');
		var list = new List(a);
		assert(compare(a, list));
	});
	it('should absorb a List when passed as 1st argument', function () {
		var a = new List('abc'.split(''));
		var list = new List(a);
		assert(compare(a, list));
	});
	it('should for...in loop only thorugh items', function () {
		var list = new List('abc'.split(''));
		var keys = [];
		for (var key in list) keys.push(key);
		assert(compare(keys, ['0','1','2']));
	});
});

describe('#concat(arrayLike1, ..., arrayLikeN)', function () {
	var a = new List('abc'.split(''));
	var b = a.concat('def'.split(''), 'ghi'.split(''), 'j');
	it('should return a new Array', function () {
		assert(isArray(b));
	});
	it('should work', function () {
		assert(b.join('') === 'abcdefghij');
	});
});

describe('#every(callback, [thisArg]) - inherited, IE9+', function () {
	it('should work', function () {
		assert(new List([1,2,3]).every(biggerThanZero));
		function biggerThanZero(v) {
			return v > 0;
		}
	});
});

describe('#filter(callback, [thisArg]) - inherited, IE9+', function () {
	var a = new List([1,2,3,4,5]);
	var b = a.filter(biggerThanTwo);
	function biggerThanTwo(v) {
		return v > 2;
	}
	it('should return a new Array', function () {
		assert(isArray(b));
	});
	it('should work', function () {
		assert(compare(b, [3,4,5]));
	});
});

describe('#forEach(callback, [thisArg]) - inherited, IE9+', function () {
	it('should work', function () {
		var a = new List([1,2,3,4,5]);
		var b = [];
		a.forEach(addToB);
		assert(compare(a, b));
		function addToB(v) {
			return b.push(v);
		}
	});
});

describe('#indexOf(searchElement, [fromIndex]) - inherited, IE9+', function () {
	it('should work', function () {
		var list = new List('abxdefgx'.split(''));
		assert(list.indexOf('x') === 2);
		assert(list.indexOf('x', 3) === 7);
	});
});

describe('#join([separator]) - inherited', function () {
	it('should work', function () {
		var seed = 'abxdefgx'.split('');
		var list = new List(seed);
		assert(list.join() === seed.join());
		assert(list.join('') === seed.join(''));
	});
});

describe('#lastIndexOf(searchElement, [fromIndex]) - inherited, IE9+', function () {
	it('should work', function () {
		var list = new List('abxdefgx'.split(''));
		assert(list.lastIndexOf('x') === 7);
		assert(list.lastIndexOf('x', 3) === 2);
	});
});

describe('#map(callback, [thisArg]) - inherited, IE9+', function () {
	var a = new List([1,2,3,4]);
	var b = a.map(timesTen);
	function timesTen(v) {
		return v * 10;
	}
	it('should return a new Array', function () {
		assert(isArray(b));
	});
	it('should work', function () {
		assert(compare(b, [10,20,30,40]));
	});
});

describe('#pop() - inherited', function () {
	it('should work', function () {
		var list = new List('abcdefgx'.split(''));
		var lengthBefore = list.length;
		var popped = list.pop();
		assert(popped === 'x');
		assert(lengthBefore === list.length + 1);
	});
});

describe('#push(element1, ..., elementN) - inherited', function () {
	it('should work', function () {
		var list = new List();
		var lengthBefore = list.length;
		var returned = list.push('x');
		assert(list.length === returned);
		assert(list.length === lengthBefore + 1);
		assert(list[list.length-1] === 'x');
	});
});

describe('#reduce(callback, [initialValue]) - inherited, IE9+', function () {
	it('should work', function () {
		var arr = new List([[0,1],[2,3],[4,5]]).reduce(function(a, b) {
			return a.concat(b);
		});
		assert(compare(arr, [0,1,2,3,4,5]));
	});
});

describe('#reduceRight(callback, [initialValue]) - inherited, IE9+', function () {
	it('should work', function () {
		var arr = new List([[0,1],[2,3],[4,5]]).reduceRight(function(a, b) {
			return a.concat(b);
		});
		assert(compare(arr, [4,5,2,3,0,1]));
	});
});

describe('#reverse() - inherited', function () {
	it('should work', function () {
		var list = new List([0,1,2,3,4,5]);
		var returned = list.reverse();
		assert(compare(list, [5,4,3,2,1,0]));
		assert(returned === list);
	});
});

describe('#shift() - inherited', function () {
	it('should work', function () {
		var list = new List([0,1,2,3,4,5]);
		var beforeLength = list.length;
		var item = list.shift();
		assert(beforeLength === list.length + 1);
		assert(item === 0);
		assert(list[0] === 1);
	});
});

describe('#slice(begin, [end]) - inherited', function () {
	var seed = 'abcdef'.split('');
	var a = new List(seed);
	it('should return a new Array', function () {
		assert(isArray(a.slice()));
	});
	it('should work', function () {
		var b, c;
		// positive indexes
		b = a.slice(2);
		c = a.slice(2, 4);
		assert(compare(b, 'cdef'.split('')));
		assert(compare(c, 'cd'.split('')));
		// negative indexes
		b = a.slice(-2);
		c = a.slice(-4, -2);
		assert(compare(b, 'ef'.split('')));
		assert(compare(c, 'cd'.split('')));
		// don't mutate original
		assert(compare(a, seed));
	});
});

describe('#some(callback, [thisArg]) - inherited, IE9+', function () {
	it('should work', function () {
		assert(new List([1,2,3]).some(biggerThanTwo));
		function biggerThanTwo(v) {
			return v > 2;
		}
	});
});

describe('#sort(callback, [thisArg]) - inherited', function () {
	it('should work', function () {
		var list = new List([4,1,2,3]);
		list.sort();
		assert(compare(list, [1,2,3,4]));
	});
});

describe('#splice(index , howMany, [element1, ..., elementN])', function () {
	var seed = 'abcdef'.split('');
	it('should return a new Array', function () {
		assert(isArray(new List(seed).splice(2, 1)));
	});
	it('should work', function () {
		var a, beforeLength;
		// removing elements
		a = new List(seed);
		beforeLength = a.length;
		a.splice(2, 1);
		assert(compare(a, 'abdef'.split('')));
		assert(a.length === beforeLength - 1);
		// adding elements
		a = new List(seed);
		beforeLength = a.length;
		a.splice(2, 1, 'x', 'y');
		assert(compare(a, 'abxydef'.split('')));
		assert(a.length === beforeLength + 1);
	});
});

describe('#unshift(element1, ..., elementN) - inherited', function () {
	it('should work', function () {
		var list = new List();
		list.unshift(1, 2);
		assert(compare(list, [1,2]));
	});
});

describe('#add(mixed1, ..., mixed2)', function () {
	it('should add items', function () {
		var list = new List();
		list.add(1, 2);
		assert(compare(list, [1,2]));
	});
	it('should add Arrays', function () {
		var list = new List();
		list.add([1], [2]);
		assert(compare(list, [1,2]));
	});
	it('should add Lists', function () {
		var list = new List();
		list.add(List([1]), List([2]));
		assert(compare(list, [1,2]));
	});
});

describe('#each(callback, [thisArg]) - alias for #forEach()', function () {
	it('should work', function () {
		var a = new List([1,2,3,4,5]);
		var b = [];
		a.each(addToB);
		assert(compare(a, b));
		function addToB(v) {
			return b.push(v);
		}
	});
});

describe('#reset()', function () {
	it('should delete all items and reset length to 0', function () {
		var list = new List([1,2]);
		list.reset();
		assert(list.length === 0);
		assert(!(0 in list));
		assert(!(1 in list));
	});
});

describe('#toArray()', function () {
	it('should return a new native Array', function () {
		var list = new List([1,2]);
		var arr = list.toArray();
		assert(compare(list, arr));
		assert(arr instanceof Array);
		assert(!(arr instanceof List));
		arr[2] = 3;
		assert(arr.length === 3);
	});
});