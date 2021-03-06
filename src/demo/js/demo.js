import '../sass/demo.scss'
import { insertStyle, removeStyle } from '../../js/utils'
import { builderActions, renderActions, demoActions } from './actionButtons'

const localeSessionKey = 'formBuilder-locale'
const defaultLocale = 'en-US'

const dataTypes = document.querySelectorAll('.demo-dataType')
const dataType = window.sessionStorage.getItem('dataType') || 'json'
const changeDataType = ({ target }) => {
  window.sessionStorage.setItem('dataType', target.value)
  demoActions.resetDemo()
}
for (let i = 0; i < dataTypes.length; i++) {
  if (dataType === dataTypes[i].value) {
    dataTypes[i].checked = true
  }
  dataTypes[i].addEventListener('click', changeDataType, false)
}

const toggleBootStrap = ({ target }) => {
  if (!target.checked) {
    removeStyle('bootstrap')
  } else {
    insertStyle({
      src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
      id: 'bootstrap',
    })
  }
}
document.getElementById('toggleBootstrap').addEventListener('click', toggleBootStrap, false)

jQuery($ => {
  const fields = [{
    type: 'targetForm',
    label: 'Target Form',
    icon: '🌟',

  },
  {
    type: 'autocomplete',
    label: 'Custom Autocomplete',
    required: true,
    values: [
      { label: 'SQL' },
      { label: 'C#' },
      { label: 'JavaScript' },
      { label: 'Java' },
      { label: 'Python' },
      { label: 'C++' },
      { label: 'PHP' },
      { label: 'Swift' },
      { label: 'Ruby' },
    ],
  },
  {
    label: 'Star Rating',
    attrs: {
      type: 'starRating',
    },
    icon: '🌟',
  },

// {
//   label: 'Star Rating',
//   attrs: {
//     type: 'newBin',
//   },
//   icon: '🌟',
// }
  ]

  const replaceFields = [
    {
      type: 'textarea',
      subtype: 'tinymce',
      datatype: 'custom-tinymce',
      label: 'tinyMCE',
      required: true,
    },
  ]

  const actionButtons = [
    {
      id: 'smile',
      className: 'btn btn-success',
      label: '😁',
      type: 'button',
      events: {
        click: () => {
          // @todo toggle options editor instead
          alert('😁😁😁 !SMILE! 😁😁😁')
        },
      },
    },
    'save',
  ]

  const templates = {
    starRating: function (fieldData) {
      return {
        field: '<span id="' + fieldData.name + '">',
        onRender: () => {
          $(document.getElementById(fieldData.name)).rateYo({ rating: 3.6 })
        },
      }
    },
  }

  const inputSets = [
    {
      label: 'User Details',
      icon: '👨',
      name: 'user-details', // optional
      showHeader: true, // optional
      fields: [
        {
          type: 'text',
          label: 'First Name',
          className: 'form-control',
        },
        {
          type: 'select',
          label: 'Profession',
          className: 'form-control',
          values: [
            {
              label: 'Street Sweeper',
              value: 'option-2',
              selected: false,
            },
            {
              label: 'Brain Surgeon',
              value: 'option-3',
              selected: false,
            },
          ],
        },
        {
          type: 'textarea',
          label: 'Short Bio:',
          className: 'form-control',
        },

      ],
      style: 'border: 1px solid red'
    }
  ]

  const typeUserDisabledAttrs = {
    autocomplete: ['access'],
  }

  const typeUserAttrs = {
    text: {
      asdf: {
        label: 'Class',
        multiple: true,
        options: {
          'red form-control': 'Red',
          'green form-control': 'Green',
          'blue form-control': 'Blue',
        },
        style: 'border: 1px solid red',
      },
      readonly: {
        label: 'readonly',
        value: false,
      },
      customItem: {
        type: 'customItem',// custom item add remove
        label: 'Goods Lost Destroyed Item',
        multiple: true,
        items: {
          'item1': 23,
          'item2': 55,
          'item3': 89,
          'item4': 88
        },
        style: 'border: 1px solid red',
      }
    },
    // targetForm: {
    //   asdf: {
    //     label: 'Menulist',
    //     multiple: true,
    //     options: {
    //       'red form-control': 'Red',
    //       'green form-control': 'Green',
    //       'blue form-control': 'Blue',
    //     },
    //     style: 'border: 1px solid red',
    //   },
    // }
  }

  // test disabledAttrs
  const disabledAttrs = ['placeholder', 'name']

  const fbOptions = {
    disabledSubtypes: {
      text: ['password'],
    },
    // disableHTMLLabels: true,
    disabledAttrs,
    // allowStageSort: false,
    dataType,
    subtypes: {
      text: ['datetime-local'],
    },
    onSave: (e, formData) => {
      window.sessionStorage.setItem('formData', formData)
      toggleEdit()
    },
    onAddField: fieldId => {
      document.getElementById('currentFieldId').value = fieldId
    },
    onClearAll: () => window.sessionStorage.removeItem('formData'),
    stickyControls: {
      enable: true,
    },
    sortableControls: true,
    fields: fields,
    templates: templates,
    inputSets: inputSets,
    typeUserDisabledAttrs: typeUserDisabledAttrs,
    typeUserAttrs: typeUserAttrs,
    disableInjectedStyle: false,
    actionButtons: actionButtons,
    disableFields: ['autocomplete', 'custom-tinymce'],
    replaceFields: replaceFields,
    disabledFieldButtons: {
      text: ['copy'],
    },
    controlPosition: 'right', // left|right,
    i18n: {
      override: {
        [defaultLocale]: {
          number: 'Big Numbers',
        },
      },
    },
    typeUserEvents: {
      select: {
        onadd: function (e) {
          const yy = $(e).find('.form-elements')
          yy.wrap('<div clsss="custom_class"></div>')
        }
      }
    }
  }
  /**
   * Toggles the edit mode for the demo
   * @return {Boolean} editMode
   */

  const formData = window.sessionStorage.getItem('formData')
  let editing = true

  if (formData) {
    fbOptions.formData = formData
  }

  /**
   * Toggles the edit mode for the demo
   * @return {Boolean} editMode
   */
  function toggleEdit() {
    document.body.classList.toggle('form-rendered', editing)
    if (!editing) {
      const udata = $('.render-wrap').formRender('userData')
      // console.log(udata)
      $('.build-wrap').formBuilder('setData', udata)
      // console.log('a')
    } else {
      // console.log('b')
      // console.log(dataType)
      // console.log(templates)
      const formRenderData = $('.build-wrap').formBuilder('getData', dataType)
      $('.render-wrap').formRender({
        formData: formRenderData,
        templates: templates,
        dataType,
      })
      // console.log(formRenderData)
      window.sessionStorage.setItem('formData', formRenderData)
    }
    return (editing = !editing)
  }

  // const formBuilder = $('.build-wrap').formBuilder(fbOptions)
  // const fbPromise = formBuilder.promise

  const $fbPages = $(document.getElementById('form-builder-pages'));
  // const addPageTab = document.getElementById('add-page-tab');
  const fbInstances = [];

  $('#add-page-tab').on('click', function (e) {
    const _self = $(e.target).parent()
    const tabCount = document.getElementById('tabs').children.length - 1
    const tabId = Math.random().toString(36).substring(2, 15) // assign random name to each tab to be unique
    const $newPageTemplate = $(document.getElementById('new-page'))
    const $newPage = $newPageTemplate
      .clone()
      .attr('id', tabId)
      .addClass('fb-editor')
    const $newTab = $(_self)
      .clone()
      .removeAttr('id')

    const $tabLink = $('a', $newTab)
    $tabLink.attr('href', '#' + tabId).text('Page ' + tabCount);
    $newPage.insertBefore($newPageTemplate);
    $newTab.insertBefore($(_self));
    $fbPages.tabs('refresh');
    $fbPages.tabs('option', 'active', tabCount);
    fbInstances.push($newPage.formBuilder(fbOptions));
   
  })
  $(document).on('click','.testClick',function(){
    console.log(fbInstances)
    const forData='[{"type":"select","required":true,"label":"Mode of&nbsp; Transport","className":"form-control","name":"select-1545714463533","wrapper_class":"col-lg-6","values":[{"label":"Ship","value":"ship","selected":true,"showHide":false,"mapElement":[]},{"label":"Air Plane","value":"airplane","showHide":false,"mapElement":[]},{"label":"Road Vehicle","value":"vehcile","showHide":false,"mapElement":[]},{"label":"Train","value":"train","showHide":false,"mapElement":[]}]},{"type":"text","required":true,"label":"Name of Carrier","className":"form-control","name":"text-1545714629448","subtype":"text","wrapper_class":"col-lg-6"},{"type":"date","required":true,"label":"Date of Loading","className":"form-control","name":"date-1545714668700","wrapper_class":"col-lg-6"},{"type":"date","required":true,"label":"Arrival Date","className":"form-control","name":"date-1545714688701","wrapper_class":"col-lg-6"},{"type":"select","required":true,"label":"Departure from","className":"form-control","name":"select-1545714741481","wrapper_class":"col-lg-6","values":[{"label":"Usa","value":"usa","selected":true,"showHide":false,"mapElement":[]},{"label":"Hong Kong","value":"hongkong","showHide":false,"mapElement":[]},{"label":"India","value":"india","showHide":false,"mapElement":[]}]},{"type":"select","required":true,"label":"Transport to","className":"form-control","name":"select-1545714743985","wrapper_class":"col-lg-6","values":[{"label":"Usa","value":"usa","selected":true,"showHide":false,"mapElement":[]},{"label":"Hong Kong","value":"hongkong","showHide":false,"mapElement":[]},{"label":"India","value":"india","showHide":false,"mapElement":[]}]},{"type":"text","required":true,"label":"Bill of Lading","className":"form-control","name":"text-1545714942949","subtype":"text","wrapper_class":"col-lg-12"},{"type":"checkbox-group","label":"Consignee","name":"checkbox-group-1545714965156","wrapper_class":"col-lg-6","values":[{"label":"Yes","value":"yes","showHide":true,"mapElement":["text-1545715022423","text-1545715040596","text-1545715056446","select-1545715076816"]}]},{"type":"text","label":"Consignee Name","className":"form-control","name":"text-1545715022423","subtype":"text","wrapper_class":"col-lg-6"},{"type":"text","label":"Address","className":"form-control","name":"text-1545715040596","subtype":"text","wrapper_class":"col-lg-6"},{"type":"text","label":"Post Code","className":"form-control","name":"text-1545715056446","subtype":"text","wrapper_class":"col-lg-6"},{"type":"select","label":"Country","className":"form-control","name":"select-1545715076816","wrapper_class":"col-lg-6","values":[{"label":"Usa","value":"usa","selected":true,"showHide":false,"mapElement":[]},{"label":"Hong Kong","value":"hongkong","showHide":false,"mapElement":[]},{"label":"India","value":"india","showHide":false,"mapElement":[]}]},{"type":"textarea","label":"Additional Information","className":"form-control","name":"textarea-1545716004850","subtype":"textarea","maxlength":"200","rows":"4"}]';
    // fbInstances[0].actions.setData(forData);
    fbInstances.forEach(element => {
      element.actions.setData(forData)
       console.log(element)
    })
  })


  $fbPages.tabs({
    beforeActivate: function (event, ui) {
      if (ui.newPanel.selector === '#new-page') {
        return false;
      }
    }
  });


  const formBuilder = $('.fb-editor').formBuilder(fbOptions)
  fbInstances.push(formBuilder);
  const fbPromise = formBuilder.promise


  fbPromise.then(function (fb) {
    const apiBtns = {
      ...builderActions,
      ...renderActions,
      ...demoActions,
    }

    Object.keys(apiBtns).forEach(function (action) {
      document.getElementById(action).addEventListener('click', function (e) {
        apiBtns[action]()
      })
    })

    document.querySelectorAll('.editForm').forEach(element => element.addEventListener('click', toggleEdit), false)
    const langSelect = document.getElementById('setLanguage')
    const savedLocale = window.sessionStorage.getItem(localeSessionKey)

    if (savedLocale && savedLocale !== defaultLocale) {
      langSelect.value = savedLocale
      fb.actions.setLang(savedLocale)
    }

    langSelect.addEventListener(
      'change',
      ({ target: { value: lang } }) => {
        window.sessionStorage.setItem(localeSessionKey, lang)
        fb.actions.setLang(lang)
      },
      false
    )
  })
})
