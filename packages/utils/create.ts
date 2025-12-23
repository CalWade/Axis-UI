//block 代码块 element 元素 modifier 修饰符

//用于拼接字符串：传入各部分单词，函数进行拼接
function _bem(
  prefixName: string,
  blockSuffix: string,
  element: string,
  modifier: string
) {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }
  if (element) {
    prefixName += `__${element}`
  }
  if (modifier) {
    prefixName += `--${modifier}`
  }
  return prefixName
}

//提供多种函数，提供b()、e()、m()等多种方式拼接类名
function createBEM(prefixName: string) {
  const b = (blockSuffix: string = '') => _bem(prefixName, blockSuffix, '', '')
  const e = (element: string = '') =>
    element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string = '') =>
    modifier ? _bem(prefixName, '', '', modifier) : ''

  const be = (blockSuffix: string = '', element: string = '') =>
    blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  const em = (element: string = '', modifier: string = '') =>
    element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bm = (blockSuffix: string = '', modifier: string = '') =>
    blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : ''

  const bem = (
    blockSuffix: string = '',
    element: string = '',
    modifier: string = ''
  ) =>
    blockSuffix && element && modifier
      ? _bem(prefixName, blockSuffix, element, modifier)
      : ''

  const is = (name: string, state: boolean | undefined) =>
    state ? `is-${name}` : ''
  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  }
}

//拼接前缀为ax-，创建命名空间
export function createNamespace(name: string) {
  const prefixName = `ax-${name}`
  return createBEM(prefixName)
}

/**
const bem = createNamespace('tree')
console.log(bem.b()) // ax-tree
console.log(bem.e('item')) // ax-tree__item
console.log(bem.m('active')) // ax-tree--active
console.log(bem.be('node', 'item')) // ax-tree-node__item
console.log(bem.em('item', 'active')) // ax-tree__item--active
console.log(bem.bm('node', 'active')) // ax-tree-node--active
console.log(bem.bem('node', 'item', 'active')) // ax-tree-node__item--active
console.log(bem.is('selected', true)) // is-selected
**/
