<template>
  <div
    v-mouse-menu="mouseMenuOptions"
    class="page"
    :style="global.globalFontFamily && `font-family: ${global.globalFontFamily}`"
  >
    <BackgroundImage ref="bg" :background="global.background" :filter="global.backgroundFilter" />
    <BackgroundEffect />
    <GooeyMenu
      v-if="global.showMenuBtn !== false || isMobile"
      @add-component="showAddDialog"
      @show-global-config="showGlobalConfig"
      @show-auxiliary-config="showAuxiliaryConfig"
    />
    <Layout @edit="showEditDialog" />
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
    <AuxiliaryConfig v-model:visible="axuiliaryConfigVisible" />
    <DefaultTheme v-if="needShowDefaultThemePicker" />
    <TabCarousel />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, h, onMounted } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
import BackgroundImage from '@/components/Global/BackgroundImage.vue'
import BackgroundEffect from '@/components/Global/BackgroundEffect.vue'
import DefaultTheme from '@/components/Global/DefaultTheme.vue'
import AuxiliaryConfig from '@/components/AuxiliaryConfig.vue'
import TabCarousel from './components/Global/TabCarousel.vue'
import vMouseMenu from '@/plugins/mouse-menu'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { uid, loadHarmonyOSFont, isIOSSafari } from '@/utils'
import { svgBase64ToPng } from '@/utils/images'
import Icon from '@/components/Tools/Icon.vue'
import { ElNotification } from 'element-plus'
const store = useStore()
const global = computed(() => store.global)
const isLock = computed(() => store.isLock)
const { t } = useI18n()

const isMobile = 'ontouchstart' in window

if (global.value.siteTitle) {
  document.title = global.value.siteTitle
}
if (global.value.siteIcon) {
  const iconDom = document.querySelector("link[rel='icon']") as HTMLLinkElement
  if (iconDom) {
    iconDom.href = global.value.siteIcon
  }
}

const bg = ref()

const baseConfig = ref()
const showAddDialog = () => {
  baseConfig.value.open()
}
const showEditDialog = (id: string) => {
  baseConfig.value.open(id)
}

const globalConfigVisible = ref(false)
const showGlobalConfig = () => {
  globalConfigVisible.value = true
}

const axuiliaryConfigVisible = ref(false)
const showAuxiliaryConfig = () => {
  axuiliaryConfigVisible.value = true
}

const handleDownloadBg = () => {
  const url = document.querySelector('.global-bg-img')?.getAttribute('src')
  if (url) {
    // Cross-origin images can't be downloaded directly, so this opens a new window instead
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'background')
    a.setAttribute('target', '_blank')
    a.click()
  }
}

const menuList = ref([
  {
    label: () => t('addComponent'),
    fn: () => {
      showAddDialog()
    },
    icon: h(Icon, { name: 'add', size: 20 })
  },
  {
    label: () => t('globalSetting'),
    fn: () => {
      showGlobalConfig()
    },
    icon: h(Icon, { name: 'setting-4', size: 18 })
  },
  {
    label: () => t('auxiliaryConfig'),
    fn: () => {
      showAuxiliaryConfig()
    },
    icon: h(Icon, { name: 'tools', size: 18 })
  },
  {
    line: true
  },
  {
    label: () => t('refreshWallpaper'),
    hidden: () => !global.value.background.includes('api/randomPhoto'),
    fn: () => {
      bg.value.refresh()
    },
    icon: h(Icon, { name: 'refresh', size: 18 })
  },
  {
    label: () => t('downloadWallpaper'),
    hidden: () => !global.value.background.includes('api/randomPhoto'),
    fn: () => {
      handleDownloadBg()
    },
    icon: h(Icon, { name: 'download-cloud', size: 18 })
  },
  {
    line: true,
    hidden: () => !global.value.background.includes('api/randomPhoto')
  },
  {
    label: () => t('paste'),
    hidden: () => isLock.value,
    fn: async () => {
      try {
        const res = await navigator.clipboard.readText()
        const componentData = JSON.parse(res)
        if (componentData.material && componentData.componentSetting) {
          // Offset the position slightly when pasting a Fixed-mode component so overlap is noticeable
          if (componentData.position === 2) {
            componentData.affixInfo.x = componentData.affixInfo?.x + 20
            componentData.affixInfo.y = componentData.affixInfo?.y + 20
          }
          store.addComponent({ ...componentData, i: uid() })
        } else {
          throw new Error('Not Howdz component data')
        }
      } catch (e) {
        ElNotification({ title: t('pasteError'), type: 'error', message: t('pasteErrorDetail')})
        console.error(e)
      }
    },
    icon: h(Icon, { name: 'clipboard', size: 18 })
  },
  {
    label: () => (isLock.value ? t('enterEditMode') : t('lock')),
    fn: () => {
      store.updateIsLock(!isLock.value)
    },
    icon: () =>
      isLock.value ? h(Icon, { name: 'unlock', size: 18 }) : h(Icon, { name: 'lock', size: 18 })
  }
])

const mouseMenuOptions = computed(() => ({
  menuList: menuList.value,
  disabled: (params, clickDom) => {
    const isLongPressBookmark = isMobile && !!clickDom.closest('.material-bookmark .item')
    return isLongPressBookmark || (isMobile && !isLock.value)
  },
  iconType: 'vnode-icon'
}))

const needShowDefaultThemePicker = computed(() => {
  if (store.tabList && store.tabList.length > 1) return false
  const isPreviewMode = location.href.includes('preview=')
  if (isPreviewMode) return false
  const config = JSON.parse(localStorage.getItem('config') || '{}')
  if ((!config.list || config.list.length === 0) && (!config.affix || config.affix.length === 0)) {
    return true
  } else {
    return false
  }
})

onMounted(async () => {
  // Load the HarmonyOS font
  if (store.global.loadHarmonyOSFont) {
    loadHarmonyOSFont()
  }
  // iOS Safari doesn't support svg icons, so convert to png specially
  if (isIOSSafari() && global.value.siteIcon) {
    const appleTouchIconDom = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
    if (appleTouchIconDom) {
      appleTouchIconDom.href = await svgBase64ToPng(global.value.siteIcon, 256)
    }
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100%;
  position: relative;
}
</style>
