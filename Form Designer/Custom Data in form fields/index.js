// Inject required modules (ES5)
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

var viewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib'
  // For server-backed:
  // serviceUrl: 'https://document.syncfusion.com/web-services/pdf-viewer/api/pdfviewer/'
});
viewer.appendTo('#pdfViewer');

// Default customData for fields added via Form Designer toolbar
viewer.textFieldSettings = {
  name: 'Textbox',
  customData: { group: 'contact', createdBy: 'designer', requiredRole: 'user' }
};

// Add a field programmatically with customData after document loads
viewer.documentLoad = function () {
  var meta = { businessId: 'C-1024', tags: ['profile', 'kiosk'], requiredRole: 'admin' };
  viewer.formDesignerModule.addFormField('Textbox', {
    name: 'Email',
    bounds: { X: 146, Y: 229, Width: 200, Height: 24 },
    customData: meta
  });
};

// Helper to get first field
function getFirstField() {
  var fields = (viewer.retrieveFormFields && viewer.retrieveFormFields()) || viewer.formFieldCollections || [];
  return fields && fields.length ? fields[0] : null;
}

// Update/replace customData on an existing field
var btnUpdate = document.getElementById('updateCustomData');
if (btnUpdate) {
  btnUpdate.addEventListener('click', function () {
    var target = getFirstField();
    if (!target) { alert('No form fields found'); return; }
    viewer.formDesignerModule.updateFormField(target, {
      customData: { group: 'profile', flags: ['pii', 'masked'], updatedAt: Date.now() }
    });
    alert('customData updated on first field');
  });
}

// Read customData from all fields
var btnLog = document.getElementById('logCustomData');
if (btnLog) {
  btnLog.addEventListener('click', function () {
    var fields = (viewer.retrieveFormFields && viewer.retrieveFormFields()) || viewer.formFieldCollections || [];
    if (!fields.length) { console.log('No fields'); return; }
    fields.forEach(function (f, i) {
      console.log('#' + i + ' ' + f.name, f.customData);
    });
    alert('Check console for customData logs');
  });
}