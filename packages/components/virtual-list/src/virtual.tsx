import { createNamespace } from '@axis-ui/utils'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { virtualListProps } from './virtual-list'

export default defineComponent({
  name: 'AxVirtualList',
  props: virtualListProps,
  setup(props, { slots }) {
    const bem = createNamespace('vl')
    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()
    //计算显示的区域
    const state = reactive({
      start: 0,
      end: props.remain,
    })

    //当前可见的数据，需要展示三屏，防止滚动时出现空白
    const prev = computed(() => {
      return Math.min(props.remain, state.start)
    })
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end)
    })
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    const offsetY = ref(0)

    //根据当前滚动的位置，计算过去了几个数据
    const handleScroll = () => {
      const scrollTop = wrapperRef.value!.scrollTop
      state.start = Math.floor(scrollTop / props.size)
      state.end = state.start + props.remain
      offsetY.value = state.start * props.size - props.size * prev.value //计算偏移量(滚过去了多少个数据)
    }

    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + 'px'
      barRef.value!.style.height = props.items.length * props.size + 'px'
    }
    watch(() => props.items, initWrapper)

    onMounted(() => {
      initWrapper()
    })
    return () => {
      return (
        // 滚动条：模拟总长度
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0,${offsetY.value}px,0)` }}
          >
            {visibleData.value.map(node => slots.default?.({ node }))}
          </div>
        </div>
      )
    }
  },
})
