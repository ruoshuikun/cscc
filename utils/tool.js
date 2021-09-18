//防抖
const debounce = (() => {
    //设定一个定时器
    let timer = 0
    //返回进行防抖处理的函数
    return (callback, ms) => {
        clearTimeout(timer)
        timer = setTimeout(callback, ms)
    }
})()

exports.debounce = debounce
