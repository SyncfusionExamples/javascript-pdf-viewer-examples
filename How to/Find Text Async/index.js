var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/29.1.33/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  pdfviewer.appendTo('#PdfViewer');

document.getElementById('findText').addEventListener('click', function () {
  pdfviewer.textSearchModule.findTextAsync('pdf', false).then(res => {
      console.log(res);  // Logs the search result for the term 'pdf'
  });
});
document.getElementById('findTexts').addEventListener('click', function () {
  pdfviewer.textSearchModule.findTextAsync(['pdf', 'the'], false).then(res => {
      console.log(res);  // Logs the search result for the terms 'pdf' and 'the'
  });
});