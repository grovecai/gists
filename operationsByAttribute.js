function makeOperationByAttribute(operation, candidatesStratgey){
  var recur = function(){
    if(arguments.length === 2)
      return arguments[1];

    var attribute = arguments[0];
    var arr1 = arguments[1];
    var arr2 = arguments[2];
    var rest = Array.prototype.slice.call(arguments, 3);

    var attributeValuesOfOperation = operation(_(arr1).pluck(attribute),
                                              _(arr2).pluck(attribute));
    var candidates = candidatesStratgey(arr1, arr2);

    var getFirstObjectWithAttributeValue = (attributeValue) => _(candidates).find( (candidate)=> attributeValue === candidate[attribute] );
    var mem = _(attributeValuesOfOperation).map(getFirstObjectWithAttributeValue);

    rest.unshift(mem);
    rest.unshift(attribute);

    return recur(rest);
  };

  return function(){
    var length = arguments.length;
    if(length < 2)
      return [];

    var args = Array.prototype.slice.call(arguments, 0)
    if(length === 2)
      args.push([]);
    return recur.apply(null, args);
  };
}

var first = (arr1, arr2) => arr1;
var both = (arr1, arr2) => _.flattern([arr1, arr2]);

var unionByAttribute = makeOperationByAttribute(_.union, both);
var intersectionByAttribute = makeOperationByAttribute(_.intersection, first);
var differenceByAttribute = makeOperationByAttribute(_.difference, first);
