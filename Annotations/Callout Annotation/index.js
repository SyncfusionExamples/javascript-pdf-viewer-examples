var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/35.1.41/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Navigation, ej.pdfviewer.Annotation,
ej.pdfviewer.LinkAnnotation, ej.pdfviewer.BookmarkView, ej.pdfviewer.ThumbnailView, ej.pdfviewer.Print,
ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.FormFields, ej.pdfviewer.FormDesigner,
ej.pdfviewer.PageOrganizer);

pdfviewer.appendTo('#PdfViewer');

// Enable Callout Annotation mode
document.getElementById("EnableCalloutMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Callout');
});

// Exit Callout Annotation mode
document.getElementById("ExitCalloutMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('None');
});

// Add Callout Annotation programmatically
document.getElementById("AddCalloutProgrammatically").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Callout', {
    offset: { x: 200, y: 200 },
    pageNumber: 1,
    opacity: 1,
    borderColor: '#000000',
    borderWidth: 1,
    borderStyle: 'Solid',
    author: 'Guest',
    calloutLines: [
      { x: 50, y: 50 },
      { x: 100, y: 100 },
      { x: 200, y: 250 }
    ],
    lineEndingStyle: 'Open'
  });
});

// Edit Callout Annotation programmatically
document.getElementById("EditCalloutProgrammatically").addEventListener('click', function () {
  if (pdfviewer.annotationCollection) {
    for (var i = 0; i < pdfviewer.annotationCollection.length; i++) {
      var annotation = pdfviewer.annotationCollection[i];
      if (annotation.subject === 'Callout') {
        annotation.bounds = { x: 300, y: 300, width: 200, height: 40, top: 300, left: 300 };
        annotation.dynamicText = 'Callout edited';
        annotation.author = 'Syncfusion';
        annotation.strokeColor = 'red';
        annotation.fillColor = 'yellow';
        annotation.textAlign = 'Center';
        pdfviewer.annotation.editAnnotation(annotation);
        break;
      }
    }
  }
});