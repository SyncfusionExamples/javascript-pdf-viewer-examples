
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
  ej.pdfviewer.FormDesigner,
  ej.pdfviewer.FormFields
);

// Initialize the viewer
var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
  // For server-backed:
  // serviceUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/'
});
pdfviewer.appendTo('#pdfViewer');

// Default constraints for newly added fields (from toolbar)
pdfviewer.textFieldSettings = {
  isReadOnly: false,
  isRequired: true, // New textboxes will be required by default
  isPrint: true,
  tooltip: 'Required field'
};
pdfviewer.signatureFieldSettings = {
  isReadOnly: false,
  isRequired: false,
  isPrint: false,   // New signatures won’t appear in print by default
  tooltip: 'Sign if applicable'
};

// Create fields with constraints on document load
pdfviewer.documentLoad = function () {
  // isReadOnly example (printed, not required)
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'EmployeeId',
    bounds: { X: 146, Y: 229, Width: 150, Height: 24 },
    isReadOnly: true,
    isRequired: false,
    isPrint: true,
    value: 'EMP-0001'
  });

  // isRequired example (required email)
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'Email',
    bounds: { X: 146, Y: 260, Width: 220, Height: 24 },
    isReadOnly: false,
    isRequired: true,
    isPrint: true,
    tooltip: 'Email is required'
  });

  // isPrint example (do not print signature)
  pdfviewer.formDesignerModule.addFormField('SignatureField', {
    name: 'ApplicantSign',
    bounds: { X: 57, Y: 923, Width: 200, Height: 43 },
    isReadOnly: false,
    isRequired: true,
    isPrint: false,
    tooltip: 'Sign to accept the terms'
  });
};

// Validation wiring (show message if required fields are empty)
pdfviewer.enableFormFieldsValidation = true;
pdfviewer.validateFormFields = function (args) {
  // If needed, you can inspect args to control behavior.
  alert('Please fill all required fields');
};

// Update constraints programmatically (button)
document.getElementById('updateConstraints') && document.getElementById('updateConstraints').addEventListener('click', function () {
  // Toggle EmployeeId to editable
  var emp = (pdfviewer.formFieldCollections || []).find(function (f) { return f.name === 'EmployeeId'; });
  if (emp) {
    pdfviewer.formDesignerModule.updateFormField(emp, { isReadOnly: false });
  }

  // Ensure Email stays required and printable
  var email = (pdfviewer.formFieldCollections || []).find(function (f) { return f.name === 'Email'; });
  if (email) {
    pdfviewer.formDesignerModule.updateFormField(email, {
      isRequired: true,
      isPrint: true,
      tooltip: 'Enter a valid email'
    });
  }

  // Make signature printable (flip from default isPrint: false)
  var sign = (pdfviewer.formFieldCollections || []).find(function (f) { return f.name === 'ApplicantSign'; });
  if (sign) {
    pdfviewer.formDesignerModule.updateFormField(sign, { isPrint: true });
  }

  alert('Constraints updated.');
});