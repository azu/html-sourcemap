
先ほど示したように`typeof`ではオブジェクトと配列の区別は付きません。
また、`length`プロパティが存在するかでは、それが配列であるとは判断できません。

そのため、あるオブジェクトが配列なのかを知りたい場合には、`Array.isArray`メソッドを利用します。
`Array.isArray`メソッドは引数が配列ならば`true`を返します。

{{book.console}}
```js
const array = [];
console.log(Array.isArray(array)); // => true
// 配列のようなオブジェクト
const object = {
    length: 0
};
console.log(Array.isArray(object)); // => false
```



### [コラム] TypedArray {#typed-array}

JavaScriptの配列は可変長のみですが、`TypedArray`という固定長でかつ型付きの配列を扱う別のオブジェクトが存在します。
`TypedArray`はバイナリデータを扱うためのオブジェクトで、WebGLやバイナリを扱う場面で利用されます。
`TypedArray`は文字列や数値などのプリミティブ型の値はそのままでは扱えないため、扱う値はTypedArrayオブジェクトという形式にする必要があります。
そのため、通常の配列とは異なる使い勝手や用途が存在します。

JavaScriptで配列といった場合には`Array`を示します。

## 配列の作成とアクセス {#create-and-access}

配列の作成と要素へのアクセス方法は[データ型とリテラル](../data-type/#array)ですでに紹介していますが、
もう一度振り返ってみましょう。

配列の作成には配列リテラルを使うのが簡単です。
配列リテラル（`[`と`]`）の中に要素をカンマ（`,`）区切りで記述するだけです。

{{book.console}}
```js
const emptyArray = [];
const numbers = [1, 2, 3];
const matrix = [
    [0, 1],
    [0, 1]
]; // ２次元配列
```

作成した配列の要素へインデックスとなる数値を、`配列[インデックス]`と記述することで、
そのインデックスにある要素を配列から読み取ることができます。
配列の先頭要素のインデックスは`0`となります。配列のインデックスは、`0`以上`2^32 - 1`未満の整数となります。

{{book.console}}
```js
const array = ["one", "two", "three"];
console.log(array[0]); // => "one"
```

先ほど学んだように、配列の`length`プロパティは配列の要素の数を返します。
そのため、配列の最後の要素へアクセスするには `array.length - 1` をインデックスとして指定します。

{{book.console}}
```js
const array = ["one", "two", "three"];
console.log(array[array.length - 1]); // => "three"
```

一方、存在しないインデックスにアクセスした場合はどうなるでしょうか？
多くの言語では、配列の存在しないインデックスへアクセスするとエラーなりますが、JavaScriptでは`undefined`が返ってきます。

{{book.console}}
```js
const array = ["one", "two", "three"];
console.log(array[100]); // => undefined
```

これは、配列がオブジェクトであることを考えると、次のように存在しないプロパティへのアクセスと同じということが分かります。
オブジェクトでも、存在しないプロパティへのアクセスした場合には`undefined`が返ってきます。

{{book.console}}
```js
const object = {
    "0": "one",
    "1": "two",
    "2": "three",
    "length": 3
};
// object[100]はobject["100"]としてアクセスされる
// objectにはプロパティ名が"100"のものがないため、undefinedが返る
console.log(object[100]); // => undefined
```

また、配列は常に`length`の数だけ要素を持っているとは限りません。
次のように、配列リテラルでは値を省略することで、未定義の要素を含めることができます。
このような、配列の中に隙間があるものを**疎な配列**と呼びます。
一方、隙間がなくすべてのインデックスに要素がある配列を**密な配列**と呼びます。

{{book.console}}
```js
// 未定義の箇所が1つ含まれる疎な配列
const sparseArray = [1,, 3];
console.log(sparseArray.length); // => 3 
// 1番目の要素は存在しないため undefined が返る
console.log(sparseArray[1]); // => undefined
```

## [コラム] undefinedの要素と未定義の要素の違い {#diff-undefined-and-no-element}

疎な配列で該当するインデックスに要素がない場合は`undefined`を返します。
しかし、JavaScriptに`undefined`値も存在するため、配列に`undefined`値がある場合に区別できません。

{{book.console}}
```js
// 要素として`undefined`を持つ密な配列
const denseArray = [1, undefined, 3];
// 要素そのものがない疎な配列
const sparseArray = [1, , 3];
console.log(denseArray[1]); // => undefined
console.log(sparseArray[1]); // => undefined
```
