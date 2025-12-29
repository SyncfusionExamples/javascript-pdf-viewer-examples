// Inject required modules once
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

// Create and mount viewer
var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
});
pdfviewer.appendTo('#PdfViewer');

// Utility helpers (safe for ES5 environments)
function getFields() {
  try { return pdfviewer.retrieveFormFields() || []; } catch (e) { return []; }
}
function first(arr, predicate) {
  for (var i = 0; i < arr.length; i++) { if (predicate(arr[i])) return arr[i]; }
  return null;
}
function all(arr, predicate) {
  var out = [];
  for (var i = 0; i < arr.length; i++) { if (predicate(arr[i])) out.push(arr[i]); }
  return out;
}

// Edit Textbox
document.getElementById('editTextbox') && document.getElementById('editTextbox').addEventListener('click', function () {
  var fields = getFields();
  var field = first(fields, function (f) { return f.name === 'First Name'; }) || fields[0];
  if (field) {
    pdfviewer.formDesignerModule.updateFormField(field, {
      value: 'John',
      fontFamily: 'Courier',
      fontSize: 12,
      fontStyle: ej.pdfviewer.FontStyle.None,
      color: 'black',
      backgroundColor: 'white',
      borderColor: 'black',
      thickness: 2,
      alignment: 'Left',
      maxLength: 50
    });
  }
});

// Edit Password
document.getElementById('editPasswordBox') && document.getElementById('editPasswordBox').addEventListener('click', function () {
  var fields = getFields();
  var field = first(fields, function (f) { return f.name === 'Password'; });
  if (field) {
    pdfviewer.formDesignerModule.updateFormField(field, {
      tooltip: 'Enter your password',
      isReadOnly: false,
      isRequired: true,
      isPrint: true,
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

// Edit CheckBox
document.getElementById('editCheckbox') && document.getElementById('editCheckbox').addEventListener('click', function () {
  var fields = getFields();
  var cb = first(fields, function (f) { return f.name === 'Subscribe'; });
  if (cb) {
    pdfviewer.formDesignerModule.updateFormField(cb, {
      isChecked: true,
      backgroundColor: 'white',
      borderColor: 'black',
      thickness: 2,
      tooltip: 'Subscribe to newsletter'
    });
  }
});

// Edit RadioButton group (example: "Gender")
document.getElementById('editRadio') && document.getElementById('editRadio').addEventListener('click', function () {
  var fields = getFields();
  var group = all(fields, function (f) { return f.name === 'Gender'; });
  if (group.length > 1) {
    // Deselect first, select second
    pdfviewer.formDesignerModule.updateFormField(group[0], { isSelected: false });
    pdfviewer.formDesignerModule.updateFormField(group[1], { isSelected: true, thickness: 2, borderColor: 'black' });
  }
});

// Edit ListBox
document.getElementById('editListBox') && document.getElementById('editListBox').addEventListener('click', function () {
  var fields = getFields();
  var lb = first(fields, function (f) { return f.name === 'States'; });
  if (lb) {
    pdfviewer.formDesignerModule.updateFormField(lb, {
      options: [
        { itemName: 'Alabama', itemValue: 'AL' },
        { itemName: 'Alaska', itemValue: 'AK' },
        { itemName: 'Arizona', itemValue: 'AZ' }
      ],
      value: 'AZ',
      fontFamily: 'Courier',
      fontSize: 10,
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white'
    });
  }
});

// Edit DropDown
document.getElementById('editDropDown') && document.getElementById('editDropDown').addEventListener('click', function () {
  var fields = getFields();
  var dd = first(fields, function (f) { return f.name === 'Country'; });
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

// Edit Signature field
document.getElementById('editSignature') && document.getElementById('editSignature').addEventListener('click', function () {
  var fields = getFields();
  var sig = first(fields, function (f) { return f.name === 'Sign'; });
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

// Edit Initial field
document.getElementById('editInitial') && document.getElementById('editInitial').addEventListener('click', function () {
  var fields = getFields();
  var init = first(fields, function (f) { return f.name === 'Initial'; });
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