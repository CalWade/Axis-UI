// 自定义 ESM loader：将 .css 文件解析为空模块
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return {
      shortCircuit: true,
      url: new URL(`data:text/javascript,export default {}`).href,
    }
  }
  return nextResolve(specifier, context)
}
