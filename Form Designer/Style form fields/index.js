// Inject required modules
ej.pdfviewer.PdfViewer.Inject(
  ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification,
  ej.pdfviewer.Navigation,
  ej.pdfviewer.Annotation,
  ej.pdfviewer.LinkAnnotation,
  ej.pdfviewer.ThumbnailView,
  ej.pdfviewer.BookmarkView,
  ej.pdfviewer.TextSelection,
  ej.pdfviewer.TextSearch,
  ej.pdfviewer.FormFields,
  ej.pdfviewer.FormDesigner
);

// Create and configure the viewer
var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
});

// Apply default settings for all fields (used when adding from Form Designer toolbar)
pdfviewer.textFieldSettings = {
  name: 'Textbox',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'Textbox',
  thickness: 4,
  value: 'Textbox',
  fontFamily: 'Courier',
  fontSize: 10,
  fontStyle: 'None',
  color: 'black',
  borderColor: 'black',
  backgroundColor: 'White',
  alignment: 'Left',
  maxLength: 0,
  isMultiline: false
};

pdfviewer.passwordFieldSettings = {
  name: 'Password',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'Password',
  thickness: 4,
  value: 'Password',
  fontFamily: 'Courier',
  fontSize: 10,
  fontStyle: 'None',
  color: 'black',
  borderColor: 'black',
  backgroundColor: 'white',
  alignment: 'Left',
  maxLength: 0
};

pdfviewer.checkBoxFieldSettings = {
  name: 'CheckBox',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'CheckBox',
  thickness: 4,
  isChecked: true,
  backgroundColor: 'white',
  borderColor: 'black'
};

pdfviewer.radioButtonFieldSettings = {
  name: 'RadioButton',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'RadioButton',
  thickness: 4,
  isSelected: true,
  backgroundColor: 'white',
  borderColor: 'black',
  value: 'RadioButton'
};

var customListOptions = [
  { itemName: 'item1', itemValue: 'item1' },
  { itemName: 'item2', itemValue: 'item2' },
  { itemName: 'item3', itemValue: 'item3' }
];

pdfviewer.listBoxFieldSettings = {
  name: 'ListBox',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'ListBox',
  thickness: 4,
  value: 'ListBox',
  fontFamily: 'Courier',
  fontSize: 10,
  fontStyle: 'None',
  color: 'black',
  borderColor: 'black',
  backgroundColor: 'White',
  alignment: 'Left',
  options: customListOptions
};

var dropDownOptions = [
  { itemName: 'item1', itemValue: 'item1' },
  { itemName: 'item2', itemValue: 'item2' },
  { itemName: 'item3', itemValue: 'item3' }
];

pdfviewer.dropDownFieldSettings = {
  name: 'DropDown',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'DropDown',
  thickness: 4,
  value: 'DropDown',
  fontFamily: 'Courier',
  fontSize: 10,
  fontStyle: 'None',
  color: 'black',
  borderColor: 'black',
  backgroundColor: 'White',
  alignment: 'Left',
  options: dropDownOptions
};

pdfviewer.signatureFieldSettings = {
  name: 'Signature',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'Signature',
  thickness: 4,
  signatureIndicatorSettings: {
    opacity: 1,
    backgroundColor: '#237ba2',
    height: 50,
    fontSize: 15,
    text: 'Signature Field',
    color: 'white'
  }
};

pdfviewer.initialFieldSettings = {
  name: 'Initial',
  isReadOnly: false,
  visibility: 'visible',
  isRequired: false,
  isPrint: true,
  tooltip: 'Initial',
  thickness: 4,
  initialIndicatorSettings: {
    opacity: 1,
    backgroundColor: '#237ba2',
    height: 50,
    fontSize: 15,
    text: 'Initial Field',
    color: 'white'
  }
};

// Mount viewer
pdfviewer.appendTo('#PdfViewer');

// Utility to safely get fields (waits until document is loaded if needed)
function getFields() {
  // prefer live collection when available
  if (pdfviewer.formFieldCollections && pdfviewer.formFieldCollections.length) {
    return pdfviewer.formFieldCollections;
  }
  // fallback to retrieve API
  try {
    return pdfviewer.retrieveFormFields ? pdfviewer.retrieveFormFields() : [];
  } catch {
    return [];
  }
}

// Wire up buttons

document.getElementById('updateTextboxStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var tb = fields.find(function (f) { return f.name === 'First Name'; }) || fields[0];
  if (tb) {
    pdfviewer.formDesignerModule.updateFormField(tb, {
      value: 'John',
      fontFamily: 'Courier',
      fontSize: 12,
      fontStyle: ej.pdfviewer.FontStyle.None,
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white',
      alignment: 'Left',
      thickness: 2
    });
  }
});

document.getElementById('updatePasswordStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var pw = fields.find(function (f) { return f.name === 'Password'; });
  if (pw) {
    pdfviewer.formDesignerModule.updateFormField(pw, {
      tooltip: 'Enter password',
      fontFamily: 'Courier',
      fontSize: 10,
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white',
      alignment: 'Left',
      maxLength: 20,
      thickness: 1
    });
  }
});

document.getElementById('updateCheckBoxStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var cb = fields.find(function (f) { return f.name === 'Subscribe'; });
  if (cb) {
    pdfviewer.formDesignerModule.updateFormField(cb, {
      isChecked: true,
      backgroundColor: 'white',
      borderColor: 'black',
      thickness: 2,
      tooltip: 'Subscribe'
    });
  }
});

document.getElementById('updateRadioButtonStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var radios = fields.filter(function (f) { return f.name === 'Gender'; });
  if (radios.length > 1) {
    pdfviewer.formDesignerModule.updateFormField(radios[0], { isSelected: false });
    pdfviewer.formDesignerModule.updateFormField(radios[1], { isSelected: true, thickness: 2, borderColor: 'black' });
  }
});

document.getElementById('updateListBoxStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var lb = fields.find(function (f) { return f.name === 'States'; });
  if (lb) {
    pdfviewer.formDesignerModule.updateFormField(lb, {
      options: [
        { itemName: 'Item 1', itemValue: 'item1' },
        { itemName: 'Item 2', itemValue: 'item2' },
        { itemName: 'Item 3', itemValue: 'item3' }
      ],
      value: 'item2',
      fontFamily: 'Courier',
      fontSize: 10,
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white'
    });
  }
});

document.getElementById('updateDropDownStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var dd = fields.find(function (f) { return f.name === 'Country'; });
  if (dd) {
    pdfviewer.formDesignerModule.updateFormField(dd, {
      options: [
        { itemName: 'USA', itemValue: 'US' },
        { itemName: 'Canada', itemValue: 'CA' },
        { itemName: 'Mexico', itemValue: 'MX' }
      ],
      value: 'US',
      fontFamily: 'Courier',
      fontSize: 10,
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white'
    });
  }
});

document.getElementById('updateSignatureStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var sig = fields.find(function (f) { return f.name === 'Sign'; });
  if (sig) {
    pdfviewer.formDesignerModule.updateFormField(sig, {
      tooltip: 'Please sign here',
      thickness: 3,
      isRequired: true,
      isPrint: true,
      backgroundColor: 'white',
      borderColor: 'black'
    });
  }
});

document.getElementById('updateInitialStyle')?.addEventListener('click', function () {
  var fields = getFields();
  var init = fields.find(function (f) { return f.name === 'Initial'; });
  if (init) {
    pdfviewer.formDesignerModule.updateFormField(init, {
      tooltip: 'Add your initials',
      thickness: 2,
      isRequired: true,
      isPrint: true,
      backgroundColor: 'white',
      borderColor: 'black'
    });
  }
});