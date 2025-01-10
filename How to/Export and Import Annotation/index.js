var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
    resourceUrl:'https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib'
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
                              ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
pdfviewer.appendTo('#PdfViewer');                              

document.getElementById('ExportXfdf').addEventListener('click', function () {
// export the annotation in XFDF format.
pdfviewer.exportAnnotation('Xfdf');
});

document.getElementById('ExportJSON').addEventListener('click', function () {
// export the annotation in JSON format.
pdfviewer.exportAnnotation('Json');
});

//Export annotation as object.
document.getElementById('export').addEventListener('click', () => {
  pdfviewer.exportAnnotationsAsObject().then(function(value) {
    exportObject = value;
  });
});

//Import annotation that are exported as object.
document.getElementById('import').addEventListener('click', () => {
  pdfviewer.importAnnotation(JSON.parse(exportObject));
});
