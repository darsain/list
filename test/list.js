var assert = require('assert');
var List = require('list');

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
});

describe('#concat(arrayLike1, ..., arrayLikeN)', function () {
	it('should return a new List', function () {
		var seed = 'abcd'.split('');
		var a = new List(seed);
		var b = a.concat();
		assert(b instanceof List);
		assert(a !== b);
		assert(compare(b, seed));
	});
	it('should concatenate an Array', function () {
		var a = new List('abc'.split(''));
		var b = 'def'.split('');
		var c = a.concat(b);
		var result = 'abcdef'.split('');
		assert(compare(c, result));
	});
	it('should concatenate a List', function () {
		var a = new List('abc'.split(''));
		var b = new List('def'.split(''));
		var c = a.concat(b);
		var result = 'abcdef'.split('');
		assert(compare(c, result));
	});
	it('should accept multiple arguments', function () {
		var a = new List('abc'.split(''));
		var b = new List('de'.split(''));
		var c = 'fgh'.split('');
		var d = 'ij'.split('');
		var e = a.concat(b, c, d);
		var result = 'abcdefghij'.split('');
		assert(compare(e, result));
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

describe('#filter(callback, [thisArg])', function () {
	var a = new List([1,2,3,4,5]);
	var b = a.filter(biggerThanTwo);
	function biggerThanTwo(v) {
		return v > 2;
	}
	it('should filter an array', function () {
		assert(compare(b, [3,4,5]));
	});
	it('should return a new List', function () {
		assert(b instanceof List);
		assert(a !== b);
	});
	it('should accept thisArg', function () {
		var thisArg = {};
		var passed;
		new List([1]).filter(catchThisArg, thisArg);
		assert(thisArg === passed);
		function catchThisArg() {
			passed = this;
		}
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

describe('#map(callback, [thisArg])', function () {
	var a = new List([1,2,3,4]);
	var b = a.map(timesTen);
	function timesTen(v) {
		return v * 10;
	}
	it('should map a List', function () {
		assert(compare(b, [10,20,30,40]));
	});
	it('should return a new List', function () {
		assert(b instanceof List);
		assert(a !== b);
	});
	it('should accept thisArg', function () {
		var thisArg = {};
		var passed;
		new List([1]).map(catchThisArg, thisArg);
		assert(thisArg === passed);
		function catchThisArg() {
			passed = this;
		}
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

describe('#slice(begin, [end])', function () {
	var seed = 'abcdef'.split('');
	var a = new List(seed);
	it('should return a new List', function () {
		var b = a.slice();
		assert(b instanceof List);
		assert(a !== b);
	});
	it('should slice with positive indexes', function () {
		var b = a.slice(2);
		var c = a.slice(2, 4);
		assert(compare(b, 'cdef'.split('')));
		assert(compare(c, 'cd'.split('')));
	});
	it('should slice with negative indexes', function () {
		var b = a.slice(-2);
		var c = a.slice(-4, -2);
		assert(compare(b, 'ef'.split('')));
		assert(compare(c, 'cd'.split('')));
	});
	it('should not mutate original List', function () {
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
	it('should return a new List', function () {
		var a = new List(seed);
		var returned = a.splice(2, 1);
		assert(returned instanceof List);
		assert(compare(returned, ['c']));
	});
	it('should remove elements', function () {
		var a = new List(seed);
		var beforeLength = a.length;
		a.splice(2, 1);
		assert(compare(a, 'abdef'.split('')));
		assert(a.length === beforeLength - 1);
	});
	it('should add elements', function () {
		var a = new List(seed);
		var beforeLength = a.length;
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