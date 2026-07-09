import pick from '../base'
export default {
  formData: {
    showPoster: true,
    posterType: 2,
    posterFilter: 'brightness(0.4)',
    asBackground: false,
    showCite: true,
    duration: 5,
    position: 5,
    clickActionType: 1,
    textFontSize: 24,
    textColor: '#ffffff',
    textShadow: '0 1px 3px #363636',
    fontFamily: '',
    padding: 10,
    showDecoration: true,
    themeColor: '#69c0eb',
    maxWidth: 600,
    useSpotlight: false
  },
  formConf(formData: any) {
    return {
      showPoster: {
        label: 'showPoster',
        slot: () => {
          return (
            <div>
              <el-switch v-model={formData.showPoster}></el-switch>
              {
                formData.showPoster && (
                  <div style="margin-left: -90px;margin-top: 12px;">
                    <background-filter-selector v-models={[[formData.posterFilter, 'filter']]} />
                  </div>
                )
              }
            </div>
          )
        }
      },
      posterType: {
        when: (formData: any) => formData.showPoster,
        label: 'posterType',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: 'poster',
              value: 1
            },
            {
              name: 'stillWallpaper',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        },
        tips: 'posterTypeTips'
      },
      asBackground: {
        when: (formData: any) => formData.showPoster && formData.posterType === 2,
        label: 'useAsWallpaper',
        type: 'switch',
        tips: 'applyPosterAsGlobalWallpaperTips'
      },
      showCite: {
        label: 'movieName',
        type: 'switch'
      },
      duration: {
        label: 'refreshDuration',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 12 * 60,
          style: 'width: 100px'
        },
        unit: 'min',
        tips: 'durationMinuteTips'
      },
      clickActionType: {
        label: 'clickAction',
        type: 'select',
        option: {
          list: [
            { label: 'none', value: 0 },
            { label: 'switchToNext', value: 1 },
            { label: 'viewDetail', value: 2 },
            { label: 'copyLine', value: 3 }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'clickMovieLinesActionTypeTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ]),
      showDecoration: {
        label: 'decoration',
        type: 'switch'
      },
      themeColor: {
        when: (formData: any) => formData.showDecoration,
        label: 'decorationColor',
        slot: () => <standard-color-picker vModel={formData.themeColor} />
      },
      useSpotlight: {
        when: (formData: any) => formData.showPoster && !formData.asBackground,
        label: 'spotlightFilter',
        type: 'switch',
        tips: 'spotlightTips'
      },
      maxWidth: {
        label: 'boxMaxWidth',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 100,
          max: 4080,
        }
      }
    }
  },
}
