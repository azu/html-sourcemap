
破壊的なメソッドの例として、配列に要素を追加する`Array#push`メソッドがあります。
`push`メソッドは、`myArray`の配列そのものへ要素を追加しています。
その結果`myArray`の参照する配列が変更されるため破壊的なメソッドです。

{{book.console}}
```js
const myArray = ["A", "B", "C"];
const result = myArray.push("D"); 
// `push`の返り値は配列ではなく、追加後の配列のlength
console.log(result); // => 4
// `myArray`が参照する配列そのものが変更されている
console.log(myArray); // => ["A", "B", "C", "D"]
```

<!-- 具体例:非破壊的メソッド -->

非破壊的なメソッドの例として、配列に要素を結合する`Array#concat`メソッドがあります。
`concat`メソッドは、`myArray`をコピーした配列に対して要素を結合しその配列を返します。
その結果`myArray`の参照する配列は変更されないため非破壊的なメソッドです。
