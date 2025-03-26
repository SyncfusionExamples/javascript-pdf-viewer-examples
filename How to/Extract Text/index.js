var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/29.1.33/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  pdfviewer.appendTo('#PdfViewer');

  // Event Listener for Extract Text from Single Page
document.getElementById('extractText').addEventListener('click', function () {
  pdfviewer.extractText(1, 'TextOnly').then((val) => {
      console.log('Extracted Text from Page 1:');
      console.log(val);  // Logs the extracted text from page 1
  });
});

// Event Listener for Extract Text from Multiple Pages
document.getElementById('extractTexts').addEventListener('click', function () {
  pdfviewer.extractText(0, 2, 'TextOnly').then((val) => {
      console.log('Extracted Text from Pages 0 to 2:');
      console.log(val);  // Logs the extracted text from pages 0 to 2
  });
});