<template>
  <div class="theme-demo">
    <h4>主题切换</h4>
    <div class="demo-section">
      <button class="demo-btn" @click="toggleMode">
        当前模式: {{ mode }} — 点击切换
      </button>
    </div>

    <h4>从主色生成主题</h4>
    <div class="demo-section">
      <div class="color-picker-row">
        <label>选择主色：</label>
        <input type="color" v-model="primaryColor" />
        <span class="color-hex">{{ primaryColor }}</span>
        <button class="demo-btn" @click="applyFromColor">应用</button>
      </div>
    </div>

    <h4>恢复默认</h4>
    <div class="demo-section">
      <button class="demo-btn" @click="reset">恢复樱花粉默认主题</button>
    </div>

    <h4>预览效果</h4>
    <div class="demo-preview">
      <div class="preview-card">
        <div class="preview-title">主色调</div>
        <div class="preview-color primary"></div>
      </div>
      <div class="preview-card">
        <div class="preview-title">成功</div>
        <div class="preview-color success"></div>
      </div>
      <div class="preview-card">
        <div class="preview-title">警告</div>
        <div class="preview-color warning"></div>
      </div>
      <div class="preview-card">
        <div class="preview-title">危险</div>
        <div class="preview-color danger"></div>
      </div>
      <div class="preview-card">
        <div class="preview-title">信息</div>
        <div class="preview-color info"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme, generateThemeFromColor } from '@packages/utils'

const { mode, toggleMode, applyTokens, resetTokens, setMode } = useTheme()

const primaryColor = ref('#409eff')

function applyFromColor() {
  const tokens = generateThemeFromColor(primaryColor.value)
  applyTokens(tokens)
}

function reset() {
  resetTokens()
  setMode('light')
}
</script>

<style scoped>
.theme-demo {
  padding: 20px;
  border: 1px solid var(--ax-border-color, #e5e7eb);
  border-radius: 12px;
  background: var(--ax-bg-color, #fff);
}

.theme-demo h4 {
  margin: 16px 0 8px;
  color: var(--ax-text-color, #333);
}

.demo-section {
  margin-bottom: 16px;
}

.demo-btn {
  padding: 8px 16px;
  border: 1px solid var(--ax-border-color, #ddd);
  border-radius: 6px;
  background: var(--ax-color-primary, #ff9eb5);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  opacity: 0.85;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-hex {
  font-family: monospace;
  color: var(--ax-text-color-secondary, #999);
}

.demo-preview {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.preview-card {
  text-align: center;
}

.preview-title {
  font-size: 12px;
  color: var(--ax-text-color-secondary, #999);
  margin-bottom: 4px;
}

.preview-color {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.preview-color.primary { background: var(--ax-color-primary, #ff9eb5); }
.preview-color.success { background: var(--ax-color-success, #a8e6cf); }
.preview-color.warning { background: var(--ax-color-warning, #ffd3b6); }
.preview-color.danger { background: var(--ax-color-danger, #ffb3ba); }
.preview-color.info { background: var(--ax-color-info, #b8a9c9); }
</style>
