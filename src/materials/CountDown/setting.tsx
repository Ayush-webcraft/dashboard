import pick from '../base'
export default {
  formData: {
    eventName: '',
    eventTime: '',
    unit: '小时',
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      eventName: {
        label: 'eventName',
        type: 'input',
        attrs: {
          placeholder: '请输入事件名称'
        }
      },
      eventTime: {
        label: 'eventTime',
        type: 'date-picker',
        attrs: {
          type: 'datetime',
          placeholder: '选择日期时间',
          format: 'YYYY-MM-DD HH:mm',
          disabledDate(time: Date) {
            return time.getTime() < Date.now();
          }
        }
      },
      unit: {
        label: 'unit',
        type: 'select',
        option: {
          list: ['天', '小时', '分钟']
        }
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
  }
}
