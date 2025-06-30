let exportObject = null;
let annotationsVisible = true; 

var pdfviewer = new ej.pdfviewer.PdfViewer({
  serviceUrl: 'https://localhost:44309/pdfviewer',
  documentPath: 'Annotations.pdf',
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  pdfviewer.appendTo('#PdfViewer');

// Toggle logic
document.getElementById('toggleBtn').addEventListener('click', () => {
  const button = document.getElementById('toggleBtn');

  if (annotationsVisible) {
    // Export and delete annotations
    pdfviewer.exportAnnotationsAsObject().then((value) => {
      exportObject = value;
      const count = pdfviewer.annotationCollection.length;
      for (let i = 0; i < count; i++) {
        pdfviewer.deleteAnnotations(pdfviewer.annotationCollection[0]);
      }
      button.innerText = 'Show Annotation';
      annotationsVisible = false;
    });
  } else {
    // Restore annotations
    if (exportObject) {
      pdfviewer.importAnnotation(JSON.parse(exportObject));
    }
    button.innerText = 'Hide Annotation';
    annotationsVisible = true;
  }
});