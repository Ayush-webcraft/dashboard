import pick from '../base'
export default {
  formData: {
    source: 1,
    duration: 5,
    clickActionType: 0,
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      source: {
        label: 'randomSource',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: 'poetry',
              value: 1
            },
            {
              name: 'quote',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        }
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
            { label: 'copyText', value: 3 }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'clickVerseActionTypeTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ])
    }
  },
}
