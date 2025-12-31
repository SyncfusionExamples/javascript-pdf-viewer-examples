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
  ej.pdfviewer.FormDesigner,
  ej.pdfviewer.FormFields,
  ej.pdfviewer.Print
);

window.addEventListener('DOMContentLoaded', function () {
  var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
    // If your setup requires a backend service, uncomment and set the service URL:
    // serviceUrl: 'https://services.syncfusion.com/js/production/api/pdfviewer'
  });

  // Enable built-in validation BEFORE user actions
  pdfviewer.enableFormFieldsValidation = true;

  // Mount viewer
  pdfviewer.appendTo('#pdfViewer');

  // Add a required textbox so validation has something to catch
  pdfviewer.documentLoad = function () {
    try {
      pdfviewer.formDesignerModule.addFormField('Textbox', {
        name: 'Email',
        bounds: { X: 146, Y: 260, Width: 220, Height: 24 },
        isRequired: true,
        tooltip: 'Email is required'
      });
    } catch (e) {
      // Ignore if designer not available
    }
  };

  // Fires on Print/Download; alert if required fields are empty
  pdfviewer.validateFormFields = function (args) {
    // args.formField contains the collection of improperly filled fields
    if (args && args.formField && args.formField.length) {
      alert('Please fill all required fields. Missing: ' + args.formField[0].name);
    }
  };
});