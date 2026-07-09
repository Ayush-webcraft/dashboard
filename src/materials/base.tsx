export default function (formData: any, fields: string[] | string) {
  const baseTemplate: Record<string, any> = {
    position: {
      label: 'textAlign',
      slot: () => <position-selector vModel={formData.position}></position-selector>
    },
    textFontSize: {
      label: 'textSize',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 12,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px'
    },
    baseFontSize: {
      label: 'baseSize',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 12,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px',
      tips: 'baseFontSizeTips'
    },
    textColor: {
      label: 'fontColor',
      slot: () => <standard-color-picker vModel={formData.textColor} />
    },
    textShadow: {
      label: 'textShadow',
      type: 'input',
      attrs: {
        placeholder: 'e.g. "0 0 1px #464646"'
      },
      tips: 'textShadowTips'
    },
    iconShadow: {
      label: 'iconShadow',
      type: 'input',
      tips: 'iconShadowTips'
    },
    fontFamily: {
      label: 'fontFamily',
      slot: () => <font-selector vModel={formData.fontFamily} showRefresh></font-selector>
    },
    padding: {
      label: 'padding',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 0,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px'
    },
    showTitle: {
      label: 'tileLogo',
      type: 'switch',
      attrs: {
        'active-text': '展示顶部标题LOGO'
      }
    },
    clickActionType: {
      when: (formData: any) => formData.showTitle,
      label: 'clickLogo',
      type: 'select',
      option: {
        list: [
          { label: 'none', value: 0 },
          { label: 'refreshList', value: 1 },
          { label: 'jumpToHomePage', value: 2 }
        ],
        label: 'label',
        value: 'value'
      },
      tips: 'configureTheLogoClickAction'
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
          }
        ],
        label: 'name',
        value: 'value'
      }
    }
  }
  const result: Record<string, any> = {}
  if (typeof fields === 'string') {
    result[fields] = baseTemplate[fields]
  } else {
    fields.map(key => {
      result[key] = baseTemplate[key]
    })
  }
  return result
}
