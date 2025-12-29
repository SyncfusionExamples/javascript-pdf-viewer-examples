// Inject required modules
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

var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib'
});

// Optional server-backed
// pdfviewer.serviceUrl = 'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/';

pdfviewer.appendTo('#PdfViewer');

// Add form fields on document load
pdfviewer.documentLoad = function () {
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'First Name',
    bounds: { X: 146, Y: 229, Width: 150, Height: 24 }
  });

  pdfviewer.formDesignerModule.addFormField('Password', {
    name: 'Password',
    bounds: { X: 338, Y: 229, Width: 150, Height: 24 }
  });

  pdfviewer.formDesignerModule.addFormField('SignatureField', {
    name: 'Sign Here',
    bounds: { X: 146, Y: 280, Width: 200, Height: 43 }
  });
};

// Delete all added form fields on button click (passing field objects)
document.getElementById('deleteAllFields') && document.getElementById('deleteAllFields').addEventListener('click', function () {
  // Clone to avoid mutation while deleting
  var fields = pdfviewer.retrieveFormFields().slice();
  fields.forEach(function (field) {
    pdfviewer.formDesignerModule.deleteFormField(field);
  });
});

// Delete by ID on button click (example uses the first field's ID)
document.getElementById('deleteById') && document.getElementById('deleteById').addEventListener('click', function () {
  var list = pdfviewer.retrieveFormFields();
  if (list.length > 0 && list[0].id) {
    pdfviewer.formDesignerModule.deleteFormField(list[0].id);
  }
});