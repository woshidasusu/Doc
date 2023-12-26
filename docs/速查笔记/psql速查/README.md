# psql

psql 是 postgresql 数据库的命令行工具，借助命令来操作数据库

## whereis

如果没有配置 psql 环境变量，那么就需要用全路径来使用，可以借助 whereis 命令来查看服务器安装 psql 的路径：

```bash
whereis psql
# psql: /usr/bin/psql
```

## 登录

```bash
/usr/bin/psql -U postgres -p 6543
```

**-U**： 登录的用户名

**-p**： 端口号，默认 5432

**-d**： 数据库名，也可先登录上，再切换数据库

**-h**： 数据库 ip，可以远程登录，默认本机

## 常用命令

**\\l**： 查看数据库列表

**\\c dbname [user]**： 以指定用户切换登录指定数据库，没有指定用户默认当前登录用户

**\\dn**： 查看当前数据库所有的 schema 信息

**\\d**： 查看当前 schema 下所有表

**\\d tableName**： 查看指定表的字段信息

**show search_path;**： 查看当前 schema，分号不能省略

**set search_path to xxSchema**： 切换 schema

**\\s**：查看历史命令

**\x**：切换数据为行显示还是列显示

**\\h [sql关键字]**：查看 sql 语法帮助，当不带参数时，列举所有 sql 关键字

注意，表是与 schema 有关的，登录一个数据库里，用不同的 schema 查看，是会得到不一样的表

所以，当使用 \\d 却显示没有表时，先确认下当前的 schema 以及数据库所有的 schema，然后试试切换 schema 或者直接使用 \\c 连接数据库时顺便指定用户，再看看有没有表

### 常用查询

- 查询当前数据库的连接状态

```sql
select * from pg_stat_activity;

select datname,pid,application_name,state,query_start from pg_stat_activity order by query_start desc;
```

 结果集会显示出当前连接的数据库名，用户，IP地址，连接开始时间，查询的语句等

- 查询数据库剩余连接数

```sql
select max_conn-now_conn as resi_conn from (select setting::int8 as max_conn,(select count(*) from pg_stat_activity) as now_conn from pg_settings where name = 'max_connections') t;
```

- 查看当前总共正在使用的连接数

```sql
select count(1) from pg_stat_activity;
```

- 查看系统允许的最大连接数

```sql
show max_connections;
```

- 查询各种配置项 pg_settings

[ https://blog.csdn.net/gguxxing008/article/details/80374099 ]( https://blog.csdn.net/gguxxing008/article/details/80374099 )

