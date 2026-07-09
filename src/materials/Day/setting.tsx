import pick from '../base'
const DAYJS_FORMAT_LINK = 'https://day.js.org/docs/zh-CN/display/format'
export default {
  formData: {
    formatter: 'M月D日 dddd',
    custom: '',
    chineseWeekDay: true,
    timeZone: '',
    duration: 5,
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    showTTS1: false,
    showTTS2: false,
    ttsFontSize: 16,
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      formatter: {
        label: 'formatter',
        type: 'radio-group',
        attrs: {
          class: 'block-radio-group'
        },
        radio: {
          list: [
            'M月D日 dddd',
            'YYYY-MM-DD HH:mm:ss',
            'YYYY-MM-DD HH:mm dddd',
            '自定义'
          ]
        },
        tips: 'dayjsFormatterTips'
      },
      custom: {
        when: (formData: any) => formData.formatter === '自定义',
        formItemStyle: {
          marginTop: '-15px'
        },
        type: 'input',
        attrs: {
          placeholder: '请自定义的Dayjs格式',
          clearable: true
        },
        rules: [{
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (formData.formatter === '自定义' && !value) {
              callback(new Error('请输入自定义的Dayjs格式'))
            }
            callback();
          }
        }],
        tips: 'dayjsFormatterTips'
      },
      dayLinkTips: {
        formItemStyle: {
          marginTop: '-12px'
        },
        slot: () => <a href={DAYJS_FORMAT_LINK} target="_blank" rel="noreferrer" style="font-weight:bold;">Dayjs格式化参考此处</a>
      },
      chineseWeekDay: {
        label: 'chineseWeekday',
        type: 'switch',
        tips: 'chineseWeekDayTips'
      },
      timeZone: {
        label: 'timeZone',
        type: 'select',
        attrs: {
          placeholder: '请选择时区',
          clearable: true,
          allowCreate: true,
          filterable: true
        },
        option: {
          list: [
            { label: 'systemDefault', value: '' },
            { label: 'asiaShanghai', value: 'Asia/Shanghai' },
            { label: 'asiaTokyo', value: 'Asia/Tokyo' },
            { label: 'americaNewYork', value: 'America/New_York' },
            { label: 'europeLondon', value: 'Europe/London' },
            { label: 'europeParis', value: 'Europe/Paris' },
            { label: 'australiaSydney', value: 'Australia/Sydney' },
            { label: 'asiaDubai', value: 'Asia/Dubai' },
            { label: 'americaLosAngeles', value: 'America/Los_Angeles' }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'timeZoneTips'
      },
      duration: {
        label: 'refreshDuration',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 24 * 3600,
          step: 1,
          style: 'width: 100%'
        },
        tips: 'durationSecondTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ]),
      showTTS1: {
        label: 'ttsText1',
        type: 'switch',
        tips: 'holidayTomorrowTtsTips'
      },
      showTTS2: {
        label: 'ttsText2',
        type: 'switch',
        tips: 'holidayNextTtsTips'
      },
      ttsFontSize: {
        label: 'ttsSize',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 12,
          max: 256,
          style: 'width: 100px'
        },
        unit: 'px'
      }
    }
  },
}
