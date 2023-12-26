### 背景

先来看个代码：

```js
[1,2,13,14,5,6,17,18,9,10,11,12,31,41].sort(()=>0)
```

你觉得这个数组这么排序后，结果会是什么

按照我们正常理解，给 sort 方法传递的比较函数返回 0，那应该表示位置不用改变，所以应该是原数组输出，是把

你可以用你浏览器试试

结果也是你想的那样没错，不过啊，如果你的浏览器版本比较旧，比如跟我一样是 59 版本的，这时你就会发现有趣的现象了：

```js
[18, 1, 13, 14, 5, 6, 17, 2, 9, 10, 11, 12, 31, 41]
```

数组内居然有元素位置发生错乱了！

这个现象是当初做项目期间遇到的：有个表格需要根据某列排序，而这列里又不是所有行都有数据的，所以就会有比较函数返回 0 的场景

当时还一度很担心会被提 BUG：排序结果有问题

后来问了些前端的大佬朋友，他们也表示很好奇，而且在他们新版浏览器上并没有这个问题，那显然是一个旧版本的 BUG，于是他们就深入源码层面去分析

非常感谢大佬们的指点，最近也尝试去源码看看，所以做些记录

如果你也想自己测试这现象，又苦于没有 59 版本的 chrome，那可以把下面代码复制到你浏览器执行，这是我从 5.9.221 版的 v8 源码里拷过来，然后删除一些调用内部函数，只留下基本场景下的排序算法的代码

下面的源码分析也是基于这份代码，因为 sort 源码本身可以解决很多场景的排序，包括稀疏数组、类数组等都能够排序，但我把这些非普通场景代码都删了，只留下本篇所遇现象的源码来分析

```js
function InnerArraySort(array, length, comparefn) {
  
  function InsertionSort(a, from, to) {
    for (var i = from + 1; i < to; i++) {
      var element = a[i];
      for (var j = i - 1; j >= from; j--) {
        var tmp = a[j];
        var order = comparefn(tmp, element);
        if (order > 0) {
          a[j + 1] = tmp;
        } else {
          break;
        }
      }
      a[j + 1] = element;
    }
  };

  function GetThirdIndex(a, from, to) {
    var t_array = new InternalArray();
    // Use both 'from' and 'to' to determine the pivot candidates.
    var increment = 200 + ((to - from) & 15);
    var j = 0;
    from += 1;
    to -= 1;
    for (var i = from; i < to; i += increment) {
      t_array[j] = [i, a[i]];
      j++;
    }
    t_array.sort(function(a, b) {
      return comparefn(a[1], b[1]);
    });
    var third_index = t_array[t_array.length >> 1][0];
    return third_index;
  }

  function QuickSort(a, from, to) {
    var third_index = 0;
    while (true) {
      // Insertion sort is faster for short arrays.
      if (to - from <= 10) {
        InsertionSort(a, from, to);
        return;
      }
      if (to - from > 1000) {
        third_index = GetThirdIndex(a, from, to);
      } else {
        third_index = from + ((to - from) >> 1);
      }
      // Find a pivot as the median of first, last and middle element.
      var v0 = a[from];
      var v1 = a[to - 1];
      var v2 = a[third_index];
      var c01 = comparefn(v0, v1);
      if (c01 > 0) {
        // v1 < v0, so swap them.
        var tmp = v0;
        v0 = v1;
        v1 = tmp;
      } // v0 <= v1.
      var c02 = comparefn(v0, v2);
      if (c02 >= 0) {
        // v2 <= v0 <= v1.
        var tmp = v0;
        v0 = v2;
        v2 = v1;
        v1 = tmp;
      } else {
        // v0 <= v1 && v0 < v2
        var c12 = comparefn(v1, v2);
        if (c12 > 0) {
          // v0 <= v2 < v1
          var tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
      }
      // v0 <= v1 <= v2
      a[from] = v0;
      a[to - 1] = v2;
      var pivot = v1;
      var low_end = from + 1;   // Upper bound of elements lower than pivot.
      var high_start = to - 1;  // Lower bound of elements greater than pivot.
      a[third_index] = a[low_end];
      a[low_end] = pivot;

      // From low_end to i are elements equal to pivot.
      // From i to high_start are elements that haven't been compared yet.
      partition: for (var i = low_end + 1; i < high_start; i++) {
        var element = a[i];
        var order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[low_end];
          a[low_end] = element;
          low_end++;
        } else if (order > 0) {
          do {
            high_start--;
            if (high_start == i) break partition;
            var top_elem = a[high_start];
            order = comparefn(top_elem, pivot);
          } while (order > 0);
          a[i] = a[high_start];
          a[high_start] = element;
          if (order < 0) {
            element = a[i];
            a[i] = a[low_end];
            a[low_end] = element;
            low_end++;
          }
        }
      }
      if (to - high_start < low_end - from) {
        QuickSort(a, high_start, to);
        to = low_end;
      } else {
        QuickSort(a, from, low_end);
        from = high_start;
      }
    }
  };

  if (length < 2) return array;

  QuickSort(array, 0, array.length);

  return array;
}

Array.prototype._sort = function(compareFn) {
    return InnerArraySort(this, this.length, compareFn);
}
```

### 源码

#### 第一步：找源码

第一步，怎么找到 Array.prototype.sort 在 chrome 59 版的浏览器上的 v8 源码呢？

v8 源码在 Github 上，每个版本都有一个分支，所以得先清楚 chrome 59 版浏览器对应的 v8 版本是多少，直接在浏览器的地址栏输入 chrome://version

![图片看不了可到简书平台看该文章](https://upload-images.jianshu.io/upload_images/1924341-05dedd4613d65dc8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

上图是我新版浏览器的信息，59 版 chrome 对应的 v8 版本是 5.9.221 

然后就可以根据版本号找到 v8 的对应分支的源码了

但关键是如何找到数组 sort 这个方法的在哪里实现呢？

我也不是很清楚，有说可以借助 Github 搜索的高级用法，比如：

```
"Array.prototype.sort" in:file
```

这表示在当前仓库的文件里寻找前面字符串一整串出现的地方

但我搜出来的结果，其实并没有找到

其他的方案，其实就是在网上搜一下，借助下别人已经找到的地方

知乎上也有人说，通常这些源码的实现在 `src/js` 目录下，可自行去查找

当然，不管用什么方法，能找到实现的地方就好，5.9.221 版的 v8 实现 Array.prototype.sort 的源码在这里：[v8/src/js/array.js](https://github.com/v8/v8/blob/5.9.221/src/js/array.js#L996)

#### 第二步：分析

接下来就开始分析

Array.js 里有这么一段代码：

```js
utils.InstallFunctions(GlobalArray.prototype, DONT_ENUM, [
    //...
    "sort", getFunction("sort", ArraySort),
    //...
]);
```

意思是 Array.prototype.sort 方法由 ArraySort 函数实现，看看这个函数：

```js
function ArraySort(comparefn) {
  //...
  return InnerArraySort(array, length, comparefn);
}
```

关键点还是 InnerArraySort 这个函数：

```js
function InnerArraySort(array, length, comparefn) {
  
  function InsertionSort(a, from, to) {
    // 对数组 a[from]...a[to] 使用插入排序算法进行排序
  };

  function QuickSort(a, from, to) {
    var third_index = 0;
    while (true) {
      // 当待处理数组长度小于10时，用插入排序
      if (to - from <= 10) {
        InsertionSort(a, from, to);
        return;
      }
      //其他场景使用快速排序
    }
  };

  if (length < 2) return array;
  //使用快速排序
  QuickSort(array, 0, array.length);

  return array;
}
```

我删掉了很多代码，只留下基本的流程，也就是对于一个普通数组的排序，sort 方法内部其实是使用快速排序算法结合插入排序算法两种来进行的

当待排序数组，不管这个数组是原数组，还是经过 n 轮快排后的分段数组，只要数组长度小于等于 10，都换成插入排序来处理

**那么，为什么要使用这种快速排序结合插入排序的方式呢？**

这是因为，插入排序对于数组基本有序的场景，速度很快，最优情况下时间复杂度可以达到 O(n)；而快速排序则是能够将无序数组快速的变化为基本有序

而插入排序是稳定排序，快速排序是不稳定排序，所以会出现位置错误的原因肯定是在快速排序的处理里的，所以就来看看

```js
function QuickSort(a, from, to) {
    var third_index = 0;
    while (true) {
      // 当待处理数组长度小于10时，用插入排序
      if (to - from <= 10) {
        InsertionSort(a, from, to);
        return;
      }
      //其他场景使用快速排序
        
      // 排序前的预处理，包括基准元素的寻找策略  
      if (to - from > 1000) {
        // 当长度超过1000时的基准元素下标的选择策略，这里就不详细看这种场景了
        third_index = GetThirdIndex(a, from, to);
      } else {
        // 1. 长度小于 1000 时，直接拿待排数组中间的元素的下标作为初步基准元素的下标  
        third_index = from + ((to - from) >> 1);
      }
      
      // 2. 取出首尾元素和基准元素 
      var v0 = a[from];
      var v1 = a[to - 1];
      var v2 = a[third_index];
      // 3. 下面这么多判断，就是对首尾元素和基准元素一共三个元素做排序
      //    排序逻辑由比较函数决定
      var c01 = comparefn(v0, v1);
      if (c01 > 0) {
        // v1 < v0, so swap them.
        var tmp = v0;
        v0 = v1;
        v1 = tmp;
      } // v0 <= v1.
      var c02 = comparefn(v0, v2);
      if (c02 >= 0) { // 注意，这里的 >= 就是产生问题的地方，先留个眼，后面再讲
        // v2 <= v0 <= v1.
        var tmp = v0;
        v0 = v2;
        v2 = v1;
        v1 = tmp;
      } else {
        // v0 <= v1 && v0 < v2
        var c12 = comparefn(v1, v2);
        if (c12 > 0) {
          // v0 <= v2 < v1
          var tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
      }
      // v0 <= v1 <= v2
      // 经过上面的排序处理后，首尾元素和基准元素三个值就已排好序，可以简单理解成从小到大  
      
      // 4. 最小值赋值给数组首元素，最大值给尾元素，基准元素取中间值  
      a[from] = v0;
      a[to - 1] = v2;
      var pivot = v1;
        
      // 5. 这样一来，首尾两元素已经是有序的了，所以需要处理的数组就是扣除首尾元素  
      var low_end = from + 1;   // Upper bound of elements lower than pivot.
      var high_start = to - 1;  // Lower bound of elements greater than pivot.
      
      // 6. 这里的快速排序用的是挖坑法，但基准元素又是在中间，所以进行数组处理前，
      //    先将待处理的数组第一个元素和基准元素交换  
      a[third_index] = a[low_end];
      a[low_end] = pivot;
      
      //... 省略开始遍历数组排序的工作  
          
    }
  };
```

快速排序，就是一种分治思想，先找个基准元素，然后处理数组，将小于基准元素的放一边，大于的放一边，这个过程其实也可以看做是寻找基准元素在排序完后的下标位置

经过一轮处理后，基准元素的下标位置就确定了，也将数组划分成两段，再分别对两部分进行同样处理

那么，上面的 v8 快速排序的具体做法，其实是这么处理：

1. 待排数组长度不大于 10 时，直接使用插入排序，否则进入 2
2. 待排数组长度不超过 1000 时，取中间那个元素作为基准元素候选人之一
3. 再取出待排数组的首尾元素，与第 2 步取出的元素，总共三个元素两两比较，得到从小到大的三个元素
4. 给首元素赋值为最小的那个元素，末元素赋值为最大的那个元素，基准元素赋值为中间大的元素
5. 经过 3,4 步处理，待排数组的首元素肯定比基准元素小，末元素比基准元素大，所以参与处理的数组就可以扣除首尾元素，也就是 left 和 right 指针的取值
6. 快速排序使用的是挖坑法，但基准元素是在中间的，所以开始处理数组前，将 left 指向的元素和基准元素做交换，这样 left 这个坑就挖好了
7. 接下去就是按照快排的处理

上面的步骤存在的问题就是，即使数组不需要排序，但在数组进入遍历处理前的基准元素寻找过程中，就发生了多次数组元素的交换操作

对应的也就是上面的第 4 步，第 6 步

首元素、尾元素、基准元素、首元素的下个元素，这四个元素会有交换的操作

一旦我们的 compareFn 比较函数不是严格按照 compareFn(a, b) 返回值大于 0 表示 a > b，小于 0 时表示 a < b，等于 0 时表示 a = b 时这种逻辑来编写，那么就会有问题了

比如我们开头例子直接使用 `sort(() => 0)` 这种方式，我们本意是说返回 0 表示两者不做交换，即使这两者不相等，但 v8 会认为返回 0 表示两者相等，那即使做交换也不影响，就导致了最后输出数组并不是原数组

细心的你可以仔细的观察下，开头的例子输出的数组是不是就只有首尾元素，基准元素（可以认为就是中间那个元素），以及首元素的下个元素，这四个元素间的位置有可能发生交换

```js
[1,2,13,14,5,6,17,18,9,10,11,12,31,41].sort(()=>0)
// [18, 1, 13, 14, 5, 6, 17, 2, 9, 10, 11, 12, 31, 41]
```

#### 第三步：优化 v8 排序，解决 BUG

上面的分析里我们知道了，之所以 `sort(() => 0)` 输出的数组并非原数组，是因为 v8 在数组开始进行快速排序的基准元素寻找过程中，默认会做几次元素的交换操作

**那么，有办法来解决这个问题吗？**

当然有，给需要交换的操作加个判断，如果 compareFn 返回值为 0 时，就不做交换不就好了，比如：

```js
// 上面代码的第 6 步加个判断，原来是直接进行的交换
// a[third_index] = a[low_end];
// a[low_end] = pivot;

if(comparefn(pivot,a[low_end])!==0){
  a[third_index] = a[low_end];
  a[low_end] = pivot;
} else {
  a[third_index] = pivot
}
```

另外，不止这个地方有问题，在上面代码第 3 步里，对首尾元素和基准元素的两两比较过程中也有问题需要修改：

```js
// 下面这是原代码处理逻辑，显然，它把等于 0 的场景归纳到大于里，所以等于 0 时也就会发生交换
var c02 = comparefn(v0, v2);
if (c02 >= 0) { 
   var tmp = v0;
   v0 = v2;
   v2 = v1;
   v1 = tmp;
} 

// 那么，我们要改的，就是把等于 0 的场景去掉，只有大于时才进行交换，就可以了
var c02 = comparefn(v0, v2);
if (c02 > 0) { 
   //...
} 
```

还有最后一个地方，首尾元素和基准元素三个排完序后，源代码本意是认为 v0 <= v1 <= v2，然后依次赋值给首元素、基准元素、尾元素

那么，当比较函数都返回 0 表示不交换的场景下，那么 v0、v1、v2 这三者的本身存的应该也是要对应首、基准、尾这个样子

但源代码在一开始取这三个值时，却将 v1=尾元素，v2=基准元素，所以这个地方我们还需要修改下：

```js
// 2. 取出首尾元素和基准元素 
// 原本 v1 = a[to - 1];v2 = a[third_index];
// 改成下面这种
var v0 = a[from];
var v1 = a[third_index];
var v2 = a[to - 1];
```

要修改的地方就是上面三个地方，这样改完后，比较函数返回 0 的场景也就是原数组输出了

```js
[1,2,13,14,5,6,17,18,9,10,11,12,31,41]._sort(()=>0)
// [1, 2, 13, 14, 5, 6, 17, 18, 9, 10, 11, 12, 31, 41]
```

以上，就是本篇内容

当然，在新版本的浏览器上这个问题就被修复了，至于是从哪个版本开始，又是怎么修好的，后续有时间再研究

### 参考

[我那大佬朋友的源码分析](https://gahing.top/2019/07/04/2019Q3/JS源码解析之Array.prototype.sort/)