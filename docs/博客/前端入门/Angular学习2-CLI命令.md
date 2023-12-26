# 声明

本系列文章内容梳理自以下来源：

- [Angular 官方中文版教程](https://www.angular.cn/docs)

官方的教程，其实已经很详细且易懂，这里再次梳理的目的在于复习和巩固相关知识点，刚开始接触学习 Angular 的还是建议以官网为主。

因为这系列文章，更多的会带有我个人的一些理解和解读，由于目前我也才刚开始接触 Angular 不久，在该阶段的一些理解并不一定是正确的，担心会有所误导，所以还是以官网为主。

# 正文- Angular-CLI 命令

Angular 的项目其实相比老旧的前端项目模式或者是 Vue 的项目来说，都会比较重一点，因为它包括了： 模块 @NgModel， 组件 @Component， 指令 @Directive 等各种各样的东西，而每一种类型的 ts 文件，都需要有一些元数据的配置项。

这就导致了，如果是手工创建 ts 文件，需要自己编写很多重复代码，因此，可以借助 Angular-CLI 命令来创建这些文件，自动生成所需的这些重复代码。

而且，不仅在创建文件方面，在对项目的编译、打包等各种操作中也需要借助 Angular-CLI。

所以，日常开发中，不管是借助 WebStrom 的图形操作，还是直接自己使用命令方式，都需要跟 Angular-CLI 打交道，了解一些基本的配置和命令也是有好处的。

安装的方式就不讲了，要么直接使用 WebStrom 内置的，要么借助 npm 下载一个，要么通过 WebStrom 创建的 Angular 项目的 package.json 中就会自动配置一个 cli 依赖库。

### 概览

 命令格式：ng commandNameOrAlias arg \[optionalArg] \[options]

也就是 ng 之后带相应命令或命令的别名，接着带命令所需的参数，如果有多个参数就紧接着，最后是一些选项配置，选项的格式都加 `--` 前缀，如 `--spec=false` 

示例：ng g component --flat --spec=false

g 是 generate 命令的别名，component 是 g 命令的参数，表示要创建组件，--flat 和 --spec 是选项配置，具体意思后面说。

Angular-CLI 大体上两种类型的命令，一是创建或修改文件，二是类似运行某个脚本来编译、构建项目。

比如创建项目生成初始骨架的命令、创建组件、指令、服务这类文件命令；

或者是执行 build 编译命令，或者是 server 构建命令等等。

以下是概览，粗体字是我较为常接触的：

|     命令     | 别名  |                             说明                             |
| :----------: | :---: | :----------------------------------------------------------: |
| **generate** | **g** | 创建相应的文件，如组件、指令、管道、服务、模块、路由、实体类等 |
|  **build**   | **b** | 编译项目，并输出最后的文件到指定目录，可以配置很多参数来达到各种效果，比如实时更新等目的 |
|  **server**  | **s** |       编译项目，并让它运行起来，且默认支持实时更新修改       |
|     new      |   n   | 创建新项目，生成项目初始骨架，默认包括根模块、根视图，还有基本的各种配置文件 |
|     e2e      |   e   |           编译并运行项目，跑起来后，运行 e2e 测试            |
|     lint     |   l   |                     对项目进行 lint 检查                     |
|     test     |   t   |                         运行单元测试                         |
|     help     |       |                      查看命令的帮助信息                      |
|     ...      |  ...  |         还有一些没用过，也不大清楚的命令，后续再补充         |

### 常见命令

其实，这么多命令中，我最常使用的，就只有 `ng g` 命令，也就是 generate 命令，用来生成各种类型的文件代码，比如生成组件、生成服务等。

因为项目开发过程中，就是在编写组件，编写服务，而这些文件又都需要一些元数据配置，自己创建 ts 文件再去写那么代码有些繁琐，借助命令比较方便。

还有，运行项目时，会使用 build 或 server 命令。

所以，下面就只介绍这三个命令，其他命令，等到后续有接触，深入了解后再补充。

#### ng g component

`ng g component xxx` 是用来创建组件的，直接使用该命令，会默认在当前目录下创建一个 xxx 文件夹，并在内部创建以下几个文件：

- xxx.component.css 
- xxx.component.html
- xxx.component.spec.ts
- xxx.component.ts

每个文件内都会自动生成一些所需的代码，另外，还会在当前目录所属的模块文件中，将该 xxxComponent 组件声明在相应的 declarations 列表中。

以上是命令的默认行为，如果要改变这个默认行为，有两种方式，一是使用命令时携带一些选项配置，二是直接修改 angular.json 配置文件来替换掉默认行为。

先介绍第一种方式，使用命令时，加上一些选项配置：

| 选项配置                                   | 说明                                                         |
| ------------------------------------------ | ------------------------------------------------------------ |
| **--export=true\|false**                   | 生成的组件在对应的模块文件中，是否自动在 exports 列表中声明该组件好对外公开，默认值 false。 |
| **--flat=true\|false**                     | 当为 true 时，生成的组件不自动创建 xxx 的文件夹，直接在当前目录下创建那几份文件，默认值 false。 |
| **--spec=true\|false**                     | 当为 false 时，不自动创建 .spec.ts 文件，默认值为 true。     |
| **--skipTests=true\|false**                | 当为 true 时，不自动创建 .spec.ts 文件，默认值 false。该选项配置是新版才有，旧版就使用 --spec 配置。 |
| **--styleext=css\|scss\|sass\|less\|styl** | 设置组件是否使用预处理器，旧版接口                           |
| **--style=css\|scss\|sass\|less\|styl**    | 设置组件是否使用预处理器，新版接口                           |
| **--entryComponent=true\|false**           | 当为 true 时，生成的组件自动在其对应的模块内的 entryComponents 列表中声明，默认 false。 |
| **--inlineStyle=true\|false**              | 当为 true 时，组件使用内联的 style，不创建对应的 css 文件，默认 false。 |
| **--inlineTemplate=true\|false**           | 当为 true 时，组件使用内联的模板，不创建对应的 html 文件，默认 false。 |
| --lintFix=true\|false                      | 当为 true 时，组件创建后，自己进行 lintFix 操作，默认 false。 |
| --module=module                            | 指定组件归属的模块，默认当前目录所属的模块。                 |
| --prefix=prefix                            | 指定组件 selector 取值的前缀，默认 app。                     |
| --project=project                          | 指定组件归属的 project。                                     |
| --selector=selector                        | 指定组件的 selector 名。                                     |
| --skipImport=true\|false                   | 当为 true，生成的组件不在对应的模块中声明任何信息，默认 false。 |
| --changeDetection=Default\|OnPush          | 设置改变组件的检测策略，默认 Default。                       |

以上，是使用 ng g component 命令时，可以携带的一些选项配置，来修改默认的行为，其中，如果选项配置为 true，那么 value 值可以省略，如 `--flat=true` 可以简写成 `--flat`。

比如：`ng g component xxx --flat --inlineStyle --inlineTemplate --spec=false --export`

另外，其实这些选项配置中，除了前面几项可能比较常用外，其他的我基本都还没怎么接触过。

下面，讲讲第二种方式，修改 angular.json 配置文件来修改默认行为：

![](https://upload-images.jianshu.io/upload_images/1924341-644a7544a3b0e38f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

也就是在 projects 里选择当前项目，然后再其 schematics 下进行配置，至于 `@schematics/angular:component` 这串怎么来的，可以去开头第一行所指的那份 schema.json 文件中查找。

其实，这份 schema.json 文件，就是 Angular-CLI 的默认配置，当忘记都有哪些命令或参数，除了可以借助 help 命令或到官网查阅外，也可以到这份文件中查阅。

![](https://upload-images.jianshu.io/upload_images/1924341-cbbce632792906e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

除了组件外，也还有指令、模块等命令的默认配置，可以看下其中一项默认配置：

```json
{
    "@schematics/angular:component": {
        "type": "object",
        "properties": {
            "changeDetection": {
                "description": "Specifies the change detection strategy.",
                "enum": [
                    "Default",
                    "OnPush"
                ],
                "type": "string",
                "default": "Default",
                "alias": "c"
            },
            "entryComponent": {
                "type": "boolean",
                "default": false,
                "description": "Specifies if the component is an entry component of declaring module."
            },
            "export": {
                "type": "boolean",
                "default": false,
                "description": "Specifies if declaring module exports the component."
            },
            "flat": {
                "type": "boolean",
                "description": "Flag to indicate if a directory is created.",
                "default": false
            },
            "inlineStyle": {
                "description": "Specifies if the style will be in the ts file.",
                "type": "boolean",
                "default": false,
                "alias": "s"
            },
            "inlineTemplate": {
                "description": "Specifies if the template will be in the ts file.",
                "type": "boolean",
                "default": false,
                "alias": "t"
            },
            "module": {
                "type": "string",
                "description": "Allows specification of the declaring module.",
                "alias": "m"
            },
            "prefix": {
                "type": "string",
                "format": "html-selector",
                "description": "The prefix to apply to generated selectors.",
                "alias": "p"
            },
            "selector": {
                "type": "string",
                "format": "html-selector",
                "description": "The selector to use for the component."
            },
            "skipImport": {
                "type": "boolean",
                "description": "Flag to skip the module import.",
                "default": false
            },
            "spec": {
                "type": "boolean",
                "description": "Specifies if a spec file is generated.",
                "default": true
            },
            "styleext": {
                "description": "The file extension to be used for style files.",
                "type": "string",
                "default": "css"
            },
            "viewEncapsulation": {
                "description": "Specifies the view encapsulation strategy.",
                "enum": [
                    "Emulated",
                    "Native",
                    "None",
                    "ShadowDom"
                ],
                "type": "string",
                "alias": "v"
            }
        }
    }
}
```

可以看到，在官网中看到的关于 component 的各个选项配置的信息，其实在这份文件中也全列出来了，每一项配置的值类型，描述，默认值都清清楚楚在文件中了。

#### ng g directive

这个是创建指令的命令，组件其实是指令的一种，所以，上面介绍的关于组件命令中的各种选项配置，在指令这里也基本都可以使用，这里不列举了，清楚相关默认文件来源后，不懂的，去翻阅下就可以了。

因为指令并没有对应的 Template 模板和 CSS 样式文件，所以，默认生成的文件中，只有 xxx.directive.ts 和 xxx.spec.ts 两份文件。

#### ng g pipe

这个是创建管道的命令，它支持的选项配置跟指令的命令基本一样。

所以，同样的，它生成的也只有两份文件，ts 文件和测试文件。

#### ng g service

这个是创建服务类的命令，支持的选项配置参考上面几种命令。

默认生成的有两份文件，ts 和 测试文件。

#### ng g class/interface/enum

创建实体类，接口，或枚举的命令，因为这些类型的文件，默认需要的代码模板并不多，即使不用命令创建，手动创建也行。

#### ng g module

创建一个模块，这个命令有几个比较常用的选项配置：

- **--flat=true|false**

当为 true 时，在当前目录下创建指定的 xxx.module.ts 和 xxx-routing.module.ts 文件，默认 false，会自动创建 xxx 的文件夹。

- **--routing=true|false**

当为 true 时，会自动创建对应的 routing 路由模块，默认 false。

- **--routingScope=Child|Root**

创建路由模块时，配置项是 Child 还是 Root，默认 Child。

以上，是 `ng generate` 命令的常见用法，它还可以用来创建其他东西，但我常用的就这几种，而且，很多时候，都不是使用默认的行为，因此常常需要配置选项配置一起使用。

另外，为什么非得用 Angular-CLI 命令来创建文件，用 WebStrom 自己创建个 ts 文件不行吗？

借助 CLI 工具其实就是为了高效开发，减少繁琐的处理，比如，创建一个 xxx.component.ts 文件：

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cc',
  template: `
    <p>
      cc works!
    </p>
  `,
  styles: []
})
export class CcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
```

上面就是执行了 `ng g component cc --inlineStyle --inlineTemplate` 命令后创建的 cc.component.ts 文件的内容，如果不借助 CLI 工具，那么这些代码就需要自己手动去输入，即使复制黏贴也比较繁琐。

#### ng server

使用该命令，可以编译我们的项目，并在本地某个端口上运行该项目，默认还可以做到实时更新修改，不用重新编译，是本地调试项目常用的命令。

目前对该命令的使用，只接触到默认配置，还不清楚一些选项配置的适用场景，后续有了解再补充。

#### ng build

该命令用来将 Angular 项目编译、打包输出到指定目录下，最终输出的文件就是些 HTML，CSS，JavaScript 这些浏览器能够识别、运行的文件。

有时候，前端和后端的工作都由同一个人开发，此时在本地调试时，前端就没必要造假数据，可以直接将 Angular 项目编译输出到后端项目的容器中，直接在本地调试后端接口。

那么，这种时候就不能用 `ng server` 命令了，只能使用 `ng build` 命令，但该命令，默认只是编译项目，那么岂不是每次代码发生修改，都得重新跑一次 `ng build` 命令？当项目有些复杂时，岂不是需要浪费很多时间？

这种时候，就该来了解了解这个命令的一些选项配置了，经过配置，它也可以达到类似 `ng server` 命令一样自动检测文件变更并增量更新部署，提高开发效率。

| 选项配置                | 说明                                                     |
| ----------------------- | -------------------------------------------------------- |
| **--watch=true\|false** | 当为 true 时，会自动检测文件变更，并同步更新，默认 false |

还有其他配置项，没使用过，就用过这个，因为我们是直接前端后端一起做，后端用了 spring boot，所以 Angular 项目使用 `ng build` 命令编译输出到后端项目的容器中，后端跑起来，就可以直接在本地调试了。

#### 

