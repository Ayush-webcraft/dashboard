import pick from '../base'
export default {
  formData: {
    boxSize: 36,
    boxRadius: 4,
    iconSize: 20,
    textFontSize: 12,
    textColor: '#e9e9e9',
    padding: 10,
    fontFamily: '',
    maxWidth: 1024,
    tileTitleLines: 1,
    jumpType: 1,
    closeClickOutside: false,
    bookmark: [],
    hiddenAddBtn: false,
    folderBg: 'rgba(36, 36, 40, 0.9)',
    disabledDrag: false
  },
  formConf (formData: any) {
    return {
      boxSize: {
        label: 'iconBoxSize',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 20,
          max: 120,
          style: 'width: 100px'
        },
        unit: 'px',
        tips: 'boxSizeTips'
      },
      iconSize: {
        label: 'iconSize',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 16,
          max: 120,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      boxRadius: {
        label: 'containerRadius',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 120,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      ...pick(formData, [
        'textFontSize',
        'textColor',
        'padding',
        'fontFamily',
      ]),
      boxShadow: {
        label: 'containerShadow',
        type: 'input',
        attrs: {
          placeholder: '请输入合法的box-shadow值'
        }
      },
      maxWidth: {
        label: 'maxWidth',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 200,
          max: 2048,
          style: 'width: 100px'
        },
        unit: 'px'
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
      tileTitleLines: {
        label: 'maxLines',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 4,
          style: 'width: 100px'
        },
      },
      closeClickOutside: {
        label: 'fastClose',
        type: 'switch',
        tips: 'closeClickOutsideTips'
      },
      folderBg: {
        label: 'dialogBackgroundColor',
        slot: () => <standard-color-picker vModel={formData.folderBg} show-alpha />
      },
      hiddenAddBtn: {
        label: 'hideAddButton',
        type: 'switch',
        tips: 'hiddenAddBtnTips'
      },
      disabledDrag: {
        label: 'disableDrag',
        type: 'switch',
        tips: 'disabledDragTips'
      }
    }
  }
}
