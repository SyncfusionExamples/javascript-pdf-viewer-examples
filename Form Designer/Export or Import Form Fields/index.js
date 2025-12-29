// app.js
(function () {
  // Inject required PDF Viewer modules
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

  // Create and render the PDF Viewer
  var viewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
    // Optional: server-backed API
    // serviceUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
  });
  viewer.appendTo('#pdfViewer');

  // Expose for debugging if needed
  window.pdfViewer = viewer;

  // Wire up export buttons
  document.getElementById('exportFdf').addEventListener('click', function () {
    viewer.exportFormFields('ExportedData', ej.pdfviewer.FormFieldDataFormat.Fdf);
  });

  document.getElementById('exportXfdf').addEventListener('click', function () {
    viewer.exportFormFields('FormData', ej.pdfviewer.FormFieldDataFormat.Xfdf);
  });

  document.getElementById('exportJson').addEventListener('click', function () {
    viewer.exportFormFields('FormData', ej.pdfviewer.FormFieldDataFormat.Json);
  });

  document.getElementById('exportObj').addEventListener('click', function () {
    // Change the format here if you want FDF or XFDF instead of JSON
    viewer.exportFormFieldsAsObject(ej.pdfviewer.FormFieldDataFormat.Json).then(function (data) {
      console.log('Exported object:', data);
      // You can POST this object to your backend here
    }).catch(function (err) {
      console.error('Export object failed:', err);
    });
  });
})();