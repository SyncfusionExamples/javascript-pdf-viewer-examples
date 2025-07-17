let exportObject = null;
let annotationsVisible = true; 

var pdfviewer = new ej.pdfviewer.PdfViewer({
   resourceUrl: 'https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib',
   documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  pdfviewer.appendTo('#PdfViewer');

// Function to hide annotations
function HideAnnotations() {
  var proxy = this;
  pdfviewer.exportAnnotationsAsObject().then(function(value) {
    exportObject = value;
    pdfviewer.deleteAnnotations();
  });
}

// Function to unhide annotations
function UnHideAnnotations() {
  pdfviewer.importAnnotation(JSON.parse(exportObject));
}

// Add event listeners to buttons
document.getElementById('hideBtn').addEventListener('click', HideAnnotations);
document.getElementById('unhideBtn').addEventListener('click', UnHideAnnotations);