(function () {
  // Initialize the PDF Viewer
  var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib'
  });

  ej.pdfviewer.PdfViewer.Inject(
    ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Navigation, ej.pdfviewer.Annotation,
    ej.pdfviewer.LinkAnnotation, ej.pdfviewer.ThumbnailView, ej.pdfviewer.BookmarkView,
    ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.FormFields, ej.pdfviewer.FormDesigner
  );

  pdfviewer.appendTo('#PdfViewer');

  // Optional: add an initial example after document load (can be removed)
  pdfviewer.documentLoad = function () {
    // Example: place a default textbox when loaded
    try {
      pdfviewer.formDesignerModule.addFormField('Textbox', {
        name: 'First Name',
        bounds: { X: 146, Y: 229, Width: 150, Height: 24 }
      });
    } catch (e) { console.warn(e); }
  };

  // Button handlers
  function addTextbox() {
    pdfviewer.formDesignerModule.addFormField('Textbox', {
      name: 'First Name',
      bounds: { X: 146, Y: 229, Width: 150, Height: 24 }
    });
  }

  function addPassword() {
    pdfviewer.formDesignerModule.addFormField('Password', {
      name: 'Account Password',
      bounds: { X: 148, Y: 270, Width: 180, Height: 24 }
    });
  }

  function addCheckbox() {
    pdfviewer.formDesignerModule.addFormField('CheckBox', {
      name: 'Subscribe',
      isChecked: false,
      bounds: { X: 56, Y: 664, Width: 20, Height: 20 }
    });
  }

  function addRadioGroup() {
    // Group by same name: 'Gender'
    pdfviewer.formDesignerModule.addFormField('RadioButton', {
      name: 'Gender',
      isSelected: false,
      bounds: { X: 148, Y: 289, Width: 18, Height: 18 }
    });
    pdfviewer.formDesignerModule.addFormField('RadioButton', {
      name: 'Gender',
      isSelected: false,
      bounds: { X: 292, Y: 289, Width: 18, Height: 18 }
    });
  }

  function addListBox() {
    var options = [
      { itemName: 'Item 1', itemValue: 'item1' },
      { itemName: 'Item 2', itemValue: 'item2' },
      { itemName: 'Item 3', itemValue: 'item3' }
    ];
    pdfviewer.formDesignerModule.addFormField('ListBox', {
      name: 'States',
      options: options,
      bounds: { X: 380, Y: 320, Width: 150, Height: 60 }
    });
  }

  function addDropDown() {
    var options = [
      { itemName: 'Item 1', itemValue: 'item1' },
      { itemName: 'Item 2', itemValue: 'item2' },
      { itemName: 'Item 3', itemValue: 'item3' }
    ];
    pdfviewer.formDesignerModule.addFormField('DropDown', {
      name: 'Country',
      options: options,
      bounds: { X: 560, Y: 320, Width: 150, Height: 24 }
    });
  }

  function addSignature() {
    pdfviewer.formDesignerModule.addFormField('SignatureField', {
      name: 'Sign',
      bounds: { X: 57, Y: 923, Width: 200, Height: 43 }
    });
  }

  function addInitial() {
    pdfviewer.formDesignerModule.addFormField('InitialField', {
      name: 'Initial',
      bounds: { X: 148, Y: 466, Width: 200, Height: 43 }
    });
  }

  function drawNextAsPassword() {
    // Switch to interactive draw mode; click on the PDF to place the field
    pdfviewer.formDesignerModule.setFormFieldMode('Password');
  }

  // Wire up buttons
  document.getElementById('btnAddTextbox').addEventListener('click', addTextbox);
  document.getElementById('btnAddPassword').addEventListener('click', addPassword);
  document.getElementById('btnAddCheckbox').addEventListener('click', addCheckbox);
  document.getElementById('btnAddRadioGroup').addEventListener('click', addRadioGroup);
  document.getElementById('btnAddListBox').addEventListener('click', addListBox);
  document.getElementById('btnAddDropDown').addEventListener('click', addDropDown);
  document.getElementById('btnAddSignature').addEventListener('click', addSignature);
  document.getElementById('btnAddInitial').addEventListener('click', addInitial);
  document.getElementById('btnDrawPassword').addEventListener('click', drawNextAsPassword);
})();