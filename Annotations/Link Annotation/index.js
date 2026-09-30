var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/35.1.37/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);

  pdfviewer.appendTo('#PdfViewer');
  document.getElementById("AddInternalLink").addEventListener('click', function(){
  pdfviewer.annotation.addAnnotation('Link', {
    offset: { x: 200, y: 480 },
    pageNumber: 1,
    width: 150,
    height: 75,
    destinationPageIndex: 4,
    destinationLocation: { x: 100, y: 200 },
    zoomValue: 4,
    strokeColor: '#1433e3'
});
});

document.getElementById("AddExternalLink").addEventListener('click', function(){
pdfviewer.annotation.addAnnotation('Link', {
    offset: { x: 450, y: 480 },
    pageNumber: 1,
    width: 150,
    height: 75,
    url: 'https://www.syncfusion.com',
    strokeColor: '#FF0000'
});
});

document.getElementById("EditLink").addEventListener('click', function(){
for (var i = 0; i < pdfviewer.annotationCollection.length; i++) {
    if (pdfviewer.annotationCollection[i].subject === 'Link') {
        pdfviewer.annotationCollection[i].strokeColor = '#1fcbd4';
        pdfviewer.annotationCollection[i].thickness = 2;
        pdfviewer.annotationCollection[i].bounds = { left: 100, top: 100, width: 100, height: 100 };
        pdfviewer.annotationCollection[i].url = 'https://www.google.com';
        pdfviewer.annotationCollection[i].destinationPageIndex = 3;
        pdfviewer.annotationCollection[i].destinationLocation = { x: 300, y: 300 };
        pdfviewer.annotationCollection[i].zoomValue = 1;
        pdfviewer.annotation.editAnnotation(pdfviewer.annotationCollection[i]);
        break;
    }
}
});

document.getElementById("DeleteLink").addEventListener('click', function(){
var linkAnnotation = pdfviewer.annotationCollection.find(function (item) { return item.subject === 'Link'; });

if (linkAnnotation) {
    pdfviewer.annotation.deleteAnnotationById(linkAnnotation.annotationId);
}
});