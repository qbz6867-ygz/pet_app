<script setup>
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '220px' }
})

const el = ref(null)
let chart = null

function render() {
  if (!chart) chart = echarts.init(el.value)
  chart.setOption(props.option, true)
}

function handleResize() {
  if (chart) chart.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', handleResize)
})

watch(() => props.option, render, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<template>
  <div ref="el" class="echart-box" :style="{ width: '100%', height }" />
</template>
