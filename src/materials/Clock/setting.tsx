import pick from '../base'
export default {
  formData: {
    duration: 5000,
    position: 5,
    textFontSize: 64,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10,
    textHollow: false,
    textHollowBorder: 1,
    textHollowBg: 'rgba(0,0,0,0)'
  },
  formConf (formData: any) {
    return {
      duration: {
        label: 'refreshDuration',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1000,
          max: 60000,
          step: 1000,
          style: 'width: 100px'
        },
        unit: 'ms',
        tips: 'durationTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ]),
      textHollow: {
        label: 'textHollow',
        type: 'switch',
        tips: 'textStrokeTips'
      },
      textHollowBorder: {
        when: (formData: any) => formData.textHollow,
        label: 'hollowBorder',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 10,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      textHollowBg: {
        when: (formData: any) => formData.textHollow,
        label: 'hollowBackgroundColor',
        slot: () => <standard-color-picker show-alpha vModel={formData.textHollowBg} />
      }
    }
  },
}
