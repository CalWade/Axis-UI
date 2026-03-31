import { bench, describe } from 'vitest'

/**
 * Tree 核心算法性能基准
 *
 * 运行方式: pnpm bench
 */

interface TreeNode {
  key: string
  children: TreeNode[]
}

let nodeCounter = 0

function createTreeData(depth: number, breadth: number): TreeNode[] {
  if (depth === 0) return []
  return Array.from({ length: breadth }, () => ({
    key: `node-${nodeCounter++}`,
    children: createTreeData(depth - 1, breadth),
  }))
}

function collectKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = []
  const stack = [...nodes]
  while (stack.length) {
    const node = stack.pop()!
    keys.push(node.key)
    for (const child of node.children) stack.push(child)
  }
  return keys
}

function flattenTree(nodes: TreeNode[], expandedKeys: Set<string>): TreeNode[] {
  const result: TreeNode[] = []
  const stack: TreeNode[] = []
  for (let i = nodes.length - 1; i >= 0; i--) stack.push(nodes[i])
  while (stack.length) {
    const node = stack.pop()!
    result.push(node)
    if (expandedKeys.has(node.key) && node.children.length) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i])
      }
    }
  }
  return result
}

// ========================================
// Benchmarks
// ========================================

describe('Tree — Flatten 1K nodes (depth=3, breadth=10)', () => {
  nodeCounter = 0
  const data = createTreeData(3, 10)
  const allKeys = new Set(collectKeys(data))

  bench('all expanded', () => {
    flattenTree(data, allKeys)
  })

  bench('none expanded (root only)', () => {
    flattenTree(data, new Set())
  })

  const partialKeys = new Set(collectKeys(data).filter(() => Math.random() < 0.3))
  bench('30% expanded', () => {
    flattenTree(data, partialKeys)
  })
})

describe('Tree — Flatten 10K nodes (depth=4, breadth=10)', () => {
  nodeCounter = 0
  const data = createTreeData(4, 10)
  const allKeys = new Set(collectKeys(data))

  bench('all expanded', () => {
    flattenTree(data, allKeys)
  })

  const partialKeys = new Set(collectKeys(data).filter(() => Math.random() < 0.3))
  bench('30% expanded', () => {
    flattenTree(data, partialKeys)
  })
})
