<template>
  <div class="wrapper">
    <div class="item">
      <p class="title">
        {{ $t('project') }}
      </p>
      <ul class="list">
        <li>
          {{ $t('about_desc_1_1') }}
          <code>{{ $t('about_desc_1_2') }}</code>{{ $t('about_comma') }}<code>{{ $t('about_desc_1_3') }}</code>{{ $t('about_comma') }}<code style="text-decoration: line-through;">{{ $t('about_desc_1_4') }}</code>{{ $t('about_desc_1_5') }}<a :href="INTRODUCTION" target="_blank">{{ $t('about_desc_1_6') }}</a>
        </li>
        <li>
          {{ $t('about_desc_2_1') }}
          <a :href="MIT" target="_blank">MIT</a>
          {{ $t('about_desc_2_2') }} &copy;
          <a :href="AUTHOR_BLOG" target="_blank">Leon.D</a>{{ $t('about_desc_2_3') }}
          <a :href="GITHUB" target="_blank">Github</a>
        </li>
        <li>
          {{ $t('about_desc_3_1') }}
          <code>Vite</code>{{ $t('about_comma') }}<code>Vue3</code>{{ $t('about_comma') }}<code>Typescript</code>{{ $t('about_desc_3_2') }}
        </li>
        <li>
          {{ $t('about_desc_4_1') }}
          <a :href="ISSUE" target="_blank">Issue</a>{{ $t('about_desc_4_2') }}
        </li>
        <li>
          {{ $t('about_desc_5_1') }}
          <code>LocalStorage</code>{{ $t('about_desc_5_2') }}
        </li>
        <li>{{ $t('about_desc_6') }}</li>
      </ul>
    </div>
    <div class="item">
      <p class="title">
        {{ $t('demoVideo') }}
      </p>
      <a class="video-wrapper" :href="VIDEO" target="_blank">
        <img src="@/assets/imgs/video-thumb.png" alt="">
        <div class="mask">
          <Icon name="play-circle" size="1em" />
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const MIT = 'https://github.com/leon-kfd/Dashboard/blob/main/LICENSE'
const AUTHOR_BLOG = 'https://kongfandong.cn'
const GITHUB = 'https://github.com/leon-kfd/Dashboard'
const ISSUE = 'https://github.com/leon-kfd/Dashboard/issues'
const VIDEO = 'https://www.bilibili.com/video/BV1Vu411Z7i1?share_source=copy_web'
const INTRODUCTION = 'https://doc.howdz.xyz'
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  padding-right: 20px;
  .item {
    margin-bottom: 20px;
  }
  .title {
    color: $color-grey1;
    margin-bottom: 8px;
    position: relative;
    font-weight: bold;
    display: inline-block;
    &:after {
      position: absolute;
      content: "";
      left: 0;
      width: 100%;
      bottom: 0;
      height: 8px;
      background: rgba(233, 174, 49, 0.2);
    }
  }
  .list {
    padding-left: 25px;
    li {
      color: $color-grey2;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      margin-bottom: 6px;
      &::before {
        position: absolute;
        left: -26px;
      }
      $emojis: '📙', '🌈', '🎉', '📧', '⚡', '💻';
      @each $e in $emojis {
        $i: index($emojis, $e);
        &:nth-child(#{$i}) {
          &::before {
            content: $e;
          }
        }
      }
      code {
        display: inline-block;
        padding: 0 2px;
        background: #fff2f2;
        border-radius: 2px;
        margin: 0 2px;
        font-size: 13px;
        font-weight: bold;
        font-family: inherit;
      }
      a {
        color: $color-primary;
        text-decoration: none;
        &:hover {
          color: $color-warning;
          text-decoration: underline;
        }
      }
    }
  }
  .video-wrapper {
    display: block;
    width: 100%;
    min-height: 120px;
    position: relative;
    img {
      width: 100%;
      height: auto;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: #fff;
      cursor: pointer;
      background: rgba(0,0,0,.4);
      backdrop-filter: blur(3px);
    }
  }
}
</style>
