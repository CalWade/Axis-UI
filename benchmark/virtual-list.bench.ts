import { bench, describe } from 'vitest'

/**
 * VirtualList 核心算法性能基准
 *
 * 运行方式: pnpm bench
 * 输出 ops/sec，不做 pass/fail 判断
 */

// 模拟高度缓存
function createHeightCache(size: number, measuredRatio = 0.3): Map<number, number> {
  const cache = new Map<number, number>()
  for (let i = 0; i < size * measuredRatio; i++) {
    cache.set(i, 30 + Math.random() * 40)
  }
  return cache
}

function getItemHeight(index: number, cache: Map<number, number>, estimatedSize: number): number {
  return cache.get(index) ?? estimatedSize
}

function getItemOffset(index: number, cache: Map<number, number>, estimatedSize: number): number {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getItemHeight(i, cache, estimatedSize)
  }
  return offset
}

function findStartIndex(
  scrollTop: number,
  totalItems: number,
  cache: Map<number, number>,
  estimatedSize: number,
): number {
  let low = 0
  let high = totalItems - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const offset = getItemOffset(mid, cache, estimatedSize)
    const height = getItemHeight(mid, cache, estimatedSize)
    if (offset + height <= scrollTop) {
      low = mid + 1
    } else if (offset > scrollTop) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return low
}

function getTotalHeight(totalItems: number, cache: Map<number, number>, estimatedSize: number): number {
  let total = 0
  for (let i = 0; i < totalItems; i++) {
    total += getItemHeight(i, cache, estimatedSize)
  }
  return total
}

// ========================================
// Benchmarks
// ========================================

const ESTIMATED_SIZE = 50

describe('VirtualList — Fixed Mode (100K items)', () => {
  const size = 32

  bench('scrollTop / size lookup', () => {
    void Math.floor((50000 * size) / size)
  })

  bench('calculate total height', () => {
    void (100_000 * size)
  })
})

describe('VirtualList — Dynamic Mode (100K items)', () => {
  const cache = createHeightCache(100_000)

  bench('getTotalHeight', () => {
    getTotalHeight(100_000, cache, ESTIMATED_SIZE)
  })

  bench('findStartIndex (middle position)', () => {
    findStartIndex(100_000 * ESTIMATED_SIZE * 0.5, 100_000, cache, ESTIMATED_SIZE)
  })

  bench('findStartIndex (near end)', () => {
    findStartIndex(100_000 * ESTIMATED_SIZE * 0.9, 100_000, cache, ESTIMATED_SIZE)
  })

  bench('findStartIndex (near start)', () => {
    findStartIndex(100_000 * ESTIMATED_SIZE * 0.1, 100_000, cache, ESTIMATED_SIZE)
  })
})

describe('VirtualList — Dynamic Mode (10K items)', () => {
  const cache = createHeightCache(10_000)

  bench('getTotalHeight', () => {
    getTotalHeight(10_000, cache, ESTIMATED_SIZE)
  })

  bench('findStartIndex (middle)', () => {
    findStartIndex(10_000 * ESTIMATED_SIZE * 0.5, 10_000, cache, ESTIMATED_SIZE)
  })
})
