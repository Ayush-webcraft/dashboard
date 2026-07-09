import pick from '../base'

type KeySetting = {
  key: string;
  url: string;
  remark?: string;
  iconType?: string;
  iconLink?: string;
}

export default {
  formData: {
    userSettingKeyMap: {} as Record<string, KeySetting>,
    position: 5,
    useKeyboardEvent: true,
    jumpType: 1,
    keyboardMaxWidth: 920,
    keyGutter: 8,
    keyBorderRadius: 4,
    keyBackground: 'rgba(255,255,255,0.9)',
    textColor: '#363636',
    padding: 10,
    fontFamily: '',
  },
  formConf (formData: any) {
    return {
      position: {
        label: 'align',
        slot: () => <position-selector vModel={formData.position}></position-selector>
      },
      keyboardMaxWidth: {
        label: 'keyboardMaxWidth',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 720,
          max: 1280,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      useKeyboardEvent: {
        label: 'keyEvent',
        type: 'switch',
        tips: 'keyboardEventTips'
      },
      jumpType: {
        label: 'jumpType',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: 'newWindow',
              value: 1
            },
            {
              name: 'currentPage',
              value: 2
            },
            {
              name: 'openInPageIframe',
              value: 3
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      keyGutter: {
        label: 'itemGutter',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 2,
          max: 32,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      keyBorderRadius: {
        label: 'itemRadius',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 16,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      keyBackground: {
        label: 'itemBgcolor',
        slot: () => <standard-color-picker vModel={formData.keyBackground} show-alpha />
      },
      textColor: {
        label: 'fontColor',
        slot: () => <standard-color-picker vModel={formData.textColor} />
      },
      ...pick(formData, [
        'padding',
        'fontFamily',
      ])
    }
  }
}
