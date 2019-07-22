这次分享两个 Android Studio 的小技巧，能够有效提高效率和减少犯错，尤其是在团队协作开发中。  

1. **Getter 模板修改--自动处理 null 判断**  
2. **格式化代码自动整理方法位置--广度 or 深度**   

好了，下面优先介绍下这两个小技巧有什么作用，然后再给出使用教程，想直接看教程的可以直接跳到最后。  

# 目的

1. Getter 模板修改  

开发过程中，经常会遇到空指针异常，尤其是在线上 bug 中，由于未进行 null 判断处理导致的 bug 比例肯定不低。  

另外，model 层经常需要根据服务端接口返回的数据结构进行建模，实体类中常见的有 **String** 类型和 **List** 类型的字段。而服务端的接口文档里通常都会说明哪些字段不会为空，所以移动端建模后使用相应的实体类数据时，很少或者说会经常性忘记去做 null 判断处理。  

正常场景下，也许测不出 null 异常的问题，但如果服务器出了问题，返回了错误的数据，或者在某些特殊的场景下，某些字段的值偏偏就是 null，那么此时如果在使用的地方没有进行 null 判断处理，经常就会有问题出现，如果 app 刚好又有缓存策略，那么可能会导致特别严重的问题。  

鉴于此，我是建议，在建模创建实体类时，如果有 **String** 类型和 **List** 类型的变量时，这些类型的 **getXXX()** 方法中直接进行 null 判断处理，确保不会返回 null 值，这样外部使用时就不用再去进行 null 判断处理。如下：  

```  java
private String mString;
private List<String> mList;

//如果String类型的字段为空，那么返回""，外部在使用getString().equal()等之类方法时如果忘记进行null判断，也不会造成空指针异常
public String getString() {
    return mString == null ? "" : mString;
}
//如果List类型字段为空，那么返回空列表。外部在使用getList().get(i)或者getList().size()等时如果忘记进行null判断，也不会造成空指针异常
public List<String> getList() {
    if (mList == null) {
        return new ArrayList<>();
    }
    return mList;
}
```

这样处理的好处是统一在实体类内部进行 null 判断处理，外部使用的地方无需再一个个的去进行 null 判断处理，如果外部使用时忘记进行 null 判断处理，也不会导致空指针异常。  

但，如果每次创建完实体类后都靠开发人员的主观意识来为对应的 getXXX() 方法增加相应的 null 判断处理代码，很不靠谱。**一切靠主观意识来遵守的规范都不靠谱，总会由于各种原因，如任务赶，太久未接触等等而忘记。**  

所以，**推荐 getXXX() 方法都通过 Android Studio 来自动生成相应代码，那么，就可以通过修改 AS 的 Getter 方法的模板文件，来达到自动生成相应的 null 判断处理代码**，以工具代替手工，一提供效率，二强制遵守规范，三解决靠主观意识不靠谱问题。  

***

2. 格式化代码自动整理方法位置

当 app 经过越来越多的迭代，增加越来越多的功能时，项目难免会逐渐庞大起来，有些类里的代码会渐渐多了起来。

为了易于阅读，通常对类里的代码会根据各自的职能划分到一个个方法中，尽量遵守方法的单一职责，这样一来，各个方法之间难免会有关联关系，a 方法调用了 b,c 方法，b  方法调用了 d 方法，等等。

这么多的方法，如果不按照一定的规范来整理、摆放的话，当类里的方法越来越多时，这些方法位置杂乱无章的摆放会给 review 人员的阅读，或者过了很长一段时间后本人回来自己阅读时造成一定的障碍。

常见的是规范有一种是按照权限来归纳整理，private 方法集中在一起，public 方法集中在一起。

还有一种规范是按照就近原则摆放，a 方法调用了 b 方法，那么 b 方法位置就尽量靠近 a，我个人倾向于这一种规范，这样在熟悉一个类里的代码时，从上往下慢慢过下来即可，不同跳过来跳过去的。  

那么，同样的问题，靠开发人员的主观意识来遵守这种规范是很不靠谱的。写代码过程中，新建了一个方法时，并不会特别特意的去考虑要将它放在哪，基本就是就近放，这样也还好，还算稍微有些关联，有些顺序。

但，如果是在后期新增功能，在旧代码中又去新建方法时，如果对这个类不熟悉，这时候通常都不会去仔细的考虑新写的方法应该要放在哪，要么就是放最后，要么随手就近，久而久之，类里的方法就会越来越杂乱无章。  

**所以，一切靠主观意识来遵守规范的行为都不靠谱。**  

鉴于此，**推荐打开 Android Studio 自动整理方法位置的功能，借助工具来遵守规范，提高效率的同时也能写出优美的代码。**  

# 教程  

### Getter模板修改教程

1. 随便建个类，写几个属性，然后按快捷键 **Alt + Insert** 或在代码区域 **右键 -> Generate -> Getter，**然后会有一个弹框：

![第一步](https://upload-images.jianshu.io/upload_images/1924341-d568cdffa6253e4c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  



2. 此时先不要点击 OK 键，先点击右上角的 **…** **的图标**，来修改模板文件：  

![第二步.png](https://upload-images.jianshu.io/upload_images/1924341-b5eeb525851d6209.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  



3. 此时只有一份 AS 默认的生成 Getter 方法的模板，要对这份模板进行修改，所以接下去可以选择新建一份新的模板文件或者在原文件上修改都可以，比如我新建了一份 NotNull_getter 模板文件：

![第三步](https://upload-images.jianshu.io/upload_images/1924341-cc0daa4bc6609c15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  



4. 模板文件需要修改的地方就仅仅是在**$(name){…}** 代码块里的 return 生成规则，原本规则是统一返回字段值本身，根据规范新增两条规则：增加 String 类型和 List 类型的生成规则。以下是修改后的整个模板文件代码，可以拷贝过去直接使用：

```  
#if($field.modifierStatic)
static ##
#end
$field.type ##
#set($name = $StringUtil.capitalizeWithJavaBeanConvention($StringUtil.sanitizeJavaIdentifier($helper.getPropertyName($field, $project))))
#if ($field.boolean && $field.primitive)
  #if ($StringUtil.startsWithIgnoreCase($name, 'is'))
    #set($name = $StringUtil.decapitalize($name))
  #else
    is##
#end
#else
  get##
#end
${name}() {
  #if ($field.string)
     return $field.name == null ? "" : $field.name;
  #else 
    #if ($field.list)
    if ($field.name == null) {
        return new ArrayList<>();
    }
    return $field.name;
    #else 
    return $field.name;
    #end
  #end
}
```



5. 建完新模板文件后点击 OK 键，以后通过**右键** **-> Generate -> Getter** 来生成 getXXX() 方法时，注意一下模板文件选择是否正确，一般首次选择后以后都是默认上一次的:  

![第五步](https://upload-images.jianshu.io/upload_images/1924341-489d9186e775a615.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  



6. 效果，getXXX() 方法都是 AS 自动生成，而且根据修改后的模板，也能保证 String 类型和 List 类型都不会返回null值。

![效果](https://upload-images.jianshu.io/upload_images/1924341-5017663bdb7a4d0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

***

### 格式化代码自动整理方法位置教程  

1. 先开启自动整理方法位置的功能，位置：  
  **File -> Settings -> Editor -> Code Style -> Java -> Arrangement**    

![功能开启](https://upload-images.jianshu.io/upload_images/1924341-7664b2eefe5cee7a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如上图的 2,3 点功能，默认都是关闭的。  

**第 2 点功能：Keep overridden methods together – keep order**  

意思是将由 override 标志的方法都集中放置，建议将此功能开启，override 的方法通常要么是系统的一些回调方法，要么是我们自己定义的一些接口，这部分方法本身就有一定的关联性，集中在一起很合理。  

注意，AS支持两种规则，一种是 keep order（按原有顺序），一种是 order by name（按照方法字母表顺序）。至于哪一种较合适，个人喜好，我是选择的 keep order。   

**第3点功能：Keep dependent methods together** 

意思是将相关的方法按照某则规则放在一起，AS支持两种规则：  

**breadth-first order & depth-first order**   

我的理解，说得通俗点也就是广度优先和深度优先，这个功能建议开启。  

举个例子，假设一个类里有这么几个方法，a 调用了 b, c, d, 而 b 调用了 e, f，如果是按照广度优先来整理这些方法的位置时，breadth-first order:    

![广度优先](https://upload-images.jianshu.io/upload_images/1924341-a61611ca05b2a58c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    

广度优先整理后的方法顺序：a, b, c, d, e, f。也就是说，方法 a 里面调用了三个方法，那么优先将这三个方法摆放在方法 a 下方，此时并不去考虑这三个方法里是否还调用了其他方法。等过完方法 a，那么以同样的道理再去整理方法 b 中调用的方法的位置。  

但如果是深度优先，那么整理后的方法顺序就不同了，如下，depth-first order：  

![深度优先](https://upload-images.jianshu.io/upload_images/1924341-5d4f627286ad06d7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

深度优先整理后的方法顺序：a, b, e, f, c, d。也就是说，方法 a 内调用了三个方法，第一个方法是 b, 然后方法 b 又调用了 e, f。所以方法 b 紧接着 a 方法下面摆放，方法 e, f 紧接着方法 b 下面摆放，直到 e, f 里都没有其他方法了。然后再重新回到方法 a 内继续往下过方法 c 的位置，以此类推。  

两种规则有各自的好处，广度优先侧重于优先梳理每个方法的大体工作；而深度优先则侧重于梳理每个方法的实现细节，流程步骤；

目前我是选择广度优先，因为我更侧重于关注每个方法大体的工作，对于一个不熟悉的方法，大概过一下它里面的每个方法大体上做了什么，就能大概理解这个方法的大体工作。  

2. 以上仅仅只是开启功能而已，而要借助 Android Studio 来自动整理方法位置，就是通过 AS 的格式化代码功能，快捷键也就是 **Ctrl + Alt + L** 。但这个格式化操作默认是没有启动对方法进行整理的操作的，每次按完快捷键后会有如下提示：  

![功能开启2](https://upload-images.jianshu.io/upload_images/1924341-0e61742bb89c1e22.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

重点在底部那行灰色的字体，通过快捷键 **Ctrl + Alt + Shift + L** 可以打开配置 dialog：  

![配置](https://upload-images.jianshu.io/upload_images/1924341-3b91c79f6eec4c09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

**Rearrange code** 默认是没有勾选的，所以想要启用整理方法的功能，需要将这个勾选上，以后在通过 **Ctrl + Alt + L** 来格式化代码时，AS 就会根据我们在第一个步骤中设定的规则来自动整理方法的位置。  



***
