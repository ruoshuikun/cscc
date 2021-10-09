## 指定目录地址

```js
// 目录地址替换为，需要读取的文件夹、文件
const filePath = path.resolve('/Users/lin/Downloads/vue-vben-admin/src/')
```

## 指定需要读取的文件后缀

```js
function suffixFunc(array) {
    const result = []
    array.map((item, index) => {
        // 替换为，需要读取的文件后缀
        // 如：.vue 读取 vue 文件、.ts 读取 ts 文件
        if (item.endsWith('.vue') || item.endsWith('.ts') || !item.includes('.')) {
            result.push(item)
        }
    })
    return result
}
```

## 执行脚本

```
node app.js
```

