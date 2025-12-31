// Inject required modules using fully-qualified UMD globals
ej.pdfviewer.PdfViewer.Inject(
  ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification,
  ej.pdfviewer.Navigation,
  ej.pdfviewer.LinkAnnotation,
  ej.pdfviewer.ThumbnailView,
  ej.pdfviewer.BookmarkView,
  ej.pdfviewer.TextSelection,
  ej.pdfviewer.Annotation,
  ej.pdfviewer.FormDesigner,
  ej.pdfviewer.FormFields
);

// Initialize viewer
var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
});

pdfviewer.appendTo('#pdfViewer');

// Add grouped form fields on document load
pdfviewer.documentLoad = function () {
  // Textbox group: same name => mirrored value
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'EmployeeId',
    bounds: { X: 146, Y: 229, Width: 150, Height: 24 }
  });
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'EmployeeId',
    bounds: { X: 338, Y: 229, Width: 150, Height: 24 }
  });

  // Radio button group: same name => exclusive selection
  pdfviewer.formDesignerModule.addFormField('RadioButton', {
    name: 'Gender',
    bounds: { X: 148, Y: 289, Width: 18, Height: 18 },
    isSelected: false
  });
  pdfviewer.formDesignerModule.addFormField('RadioButton', {
    name: 'Gender',
    bounds: { X: 292, Y: 289, Width: 18, Height: 18 },
    isSelected: false
  });

  // CheckBox group: same name => mirrored checked state
  pdfviewer.formDesignerModule.addFormField('CheckBox', {
    name: 'Subscribe',
    bounds: { X: 56, Y: 664, Width: 20, Height: 20 },
    isChecked: false
  });
  pdfviewer.formDesignerModule.addFormField('CheckBox', {
    name: 'Subscribe',
    bounds: { X: 242, Y: 664, Width: 20, Height: 20 },
    isChecked: false
  });
};