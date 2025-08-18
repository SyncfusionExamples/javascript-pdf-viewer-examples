var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/30.1.37 /dist/ej2-pdfviewer-lib",
  enableTextSelection : false,
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);

  // Explicitly set text selection to be disabled at initial loading.
  pdfviewer.enableTextSelection = false
  pdfviewer.appendTo('#PdfViewer');

    // Add click event listener for the enableTextSelection button
    document.getElementById('enableTextSelection').addEventListener('click', function () {
        pdfviewer.enableTextSelection = true;
    });
    // Add click event listener for the disableTextSelection button
    document.getElementById('disableTextSelection').addEventListener('click', function () {
        pdfviewer.enableTextSelection = false;
    });