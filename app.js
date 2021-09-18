const fs = require('fs')
const path = require('path') // 解析需要遍历的文件夹
const {debounce} = require('./utils/tool')

// 目录文件
const filePath = path.resolve('/Users/lin/Downloads/vue-vben-admin/src/')

// 过滤文件
function suffixFunc(array) {
    const result = []
    array.map((item, index) => {
        if (item.endsWith('.vue') || item.endsWith('.ts') || !item.includes('.')) {
            result.push(item)
        }
    })
    return result
}

let totalFile = 0
let codeData = ''

// 调用文件遍历方法
fileDisplay(filePath)

// 文件遍历方法
async function fileDisplay(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {

            files = suffixFunc(files)
            // console.info('files', files)

            // 遍历读取到的文件列表
            files.forEach(function (filename) {
                // 获取当前文件的绝对路径
                const filedir = path.join(filePath, filename)
                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败')
                    } else {
                        const isFile = stats.isFile() // 是文件
                        const isDir = stats.isDirectory() // 是文件夹
                        if (isFile) {
                            // console.log(filedir) // 读取文件内容

                            let content = fs.readFileSync(filedir, 'utf-8')
                            // 调试少部分文件，判断条件 totalFile < 2
                            if (true) {
                                console.info('totalFile', `${filename} ---> 读取第${totalFile}个文件`)

                                // 去掉 行注释
                                content = removeLineAnnotation(content)

                                // 去掉 块注释
                                content = removeBlockAnnotation(content)

                                // 去掉 空行
                                content = removeEmptyLines(content)

                                codeData += content
                                debounce(writeFileFunc, 1000)
                                totalFile++
                            }
                        }
                        if (isDir) {
                            fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            })
        }
    })
}

/**
 * 已适配：<a href="https://www.baidu.com"></a>
 */
// 有 "//" 就获取匹配值
const removeLineAnnotation = (content) => {
    const lineExecData = /\/\/.*/g.exec(content)
    if (lineExecData) {
        // 获取下标
        const {index} = lineExecData
        // 根据下标往前推一个字符，判断是不是 ":" 号
        const isColon = content.slice(index - 1, index)
        // 是 ":" 号就跳过
        if (/:/.exec(isColon)) {
            // console.info('\033[31m不是行注释===========> 跳过\033[0m')
        } else {
            // 不是单词，那么就是行注释
            // 去掉 “//” 注释
            content = content.replace(/\/\/.*/g, '')
        }
    }
    return content
}

/**
 * 已适配：accept="image/*"
 */
// 有 "/*" 就获取匹配值
const removeBlockAnnotation = (content) => {
    const blockExecData = /\/\*/g.exec(content)
    if (blockExecData) {
        // 获取到下标
        const {index} = blockExecData
        // 根据下标往前推一个字符，判断是不是单词
        const isWord = content.slice(index - 1, index)
        // 是单词就跳过
        if (/[A-z]/.exec(isWord)) {
            // console.info('\033[31m不是块注释===========> 跳过\033[0m')
        } else {
            // 不是单词，那么就是块注释
            // 去掉 “/*/” 注释
            content = content.replace(/\/\*(\s|.)*?\*\//g, '')
        }
    }
    return content
}

/**
 * 应用场景：<!--<h1>你好</h1>-->
 */
// 去掉空行
const removeEmptyLines = (content) => {
    const reg = /\n(\n)*( )*(\n)*\n/g
    content = content.replace(reg, '\n')
    const result = new RegExp(reg)
    // 去掉空行，如果还有空行，再次去除空行
    if (result.test(content)) {
        content = content.replace(reg, '\n')
    }
    return content
}

function writeFileFunc(data = codeData) {
    fs.writeFile('./code/code.txt', data, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log('数据写入成功！', `共${totalFile}个文件`, new Date())
    })
}

