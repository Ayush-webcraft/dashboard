import pick from '../base'
export default {
  formData: {
    weatherMode: 1,
    cityName: '',
    animationIcon: true,
    duration: 120,
    position: 5,
    baseFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    iconShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      weatherMode: {
        label: 'city',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: 'ipAddress',
              value: 1
            },
            {
              name: 'enter',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      cityName: {
        when: (formData: any) => formData.weatherMode === 2,
        type: 'input',
        attrs: {
          placeholder: '请输入城市名(目前仅支持中国城市名)',
          clearable: true
        },
        rules: [{
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (formData.weatherMode === 2 && !value) {
              callback(new Error('请输入城市名'))
            }
            callback();
          }
        }]
      },
      animationIcon: {
        label: 'animation',
        type: 'switch',
        tips: 'animatedIconTips'
      },
      duration: {
        label: 'refreshDuration',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 60,
          max: 12 * 60,
          step: 10,
          style: 'width: 100px'
        },
        unit: 'min',
        tips: 'durationMinuteTips'
      },
      ...pick(formData, [
        'position',
        'baseFontSize',
        'textColor',
        'textShadow',
        'iconShadow',
        'fontFamily',
        'padding'
      ])
    }
  }
}
