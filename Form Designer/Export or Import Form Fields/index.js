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
  ej.pdfviewer.FormFields,
  ej.pdfviewer.FormDesigner
);

// Initialize viewer
var viewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  // For server-backed viewer, set:
  // serviceUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
});
viewer.appendTo('#pdfViewer');

// Export to files
document.getElementById('exportFdf').addEventListener('click', function () {
  viewer.exportFormFields('FormData', ej.pdfviewer.FormFieldDataFormat.Fdf);
});
document.getElementById('exportXfdf').addEventListener('click', function () {
  viewer.exportFormFields('FormData', ej.pdfviewer.FormFieldDataFormat.Xfdf);
});
document.getElementById('exportJson').addEventListener('click', function () {
  viewer.exportFormFields('FormData', ej.pdfviewer.FormFieldDataFormat.Json);
});

// Export as object (for custom persistence)
var exportedData;
document.getElementById('exportObj').addEventListener('click', function () {
  viewer
    .exportFormFieldsAsObject(ej.pdfviewer.FormFieldDataFormat.Fdf)
    .then(function (value) {
      exportedData = value;
      console.log('Exported object:', exportedData);
    });
  // Alternatives:
  // viewer.exportFormFieldsAsObject(ej.pdfviewer.FormFieldDataFormat.Xfdf).then(...)
  // viewer.exportFormFieldsAsObject(ej.pdfviewer.FormFieldDataFormat.Json).then(...)
});

// Import from files (replace 'File' with your file path/stream integration)
document.getElementById('importFdf').addEventListener('click', function () {
  viewer.importFormFields('File', ej.pdfviewer.FormFieldDataFormat.Fdf);
});
document.getElementById('importXfdf').addEventListener('click', function () {
  viewer.importFormFields('File', ej.pdfviewer.FormFieldDataFormat.Xfdf);
});
document.getElementById('importJson').addEventListener('click', function () {
  viewer.importFormFields('form-designer.json', ej.pdfviewer.FormFieldDataFormat.Json);
});

// Import from previously exported object
document.getElementById('importObj').addEventListener('click', function () {
  viewer.importFormFields(exportedData, ej.pdfviewer.FormFieldDataFormat.Fdf);
});