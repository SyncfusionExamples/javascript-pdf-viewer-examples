var viewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  viewer.appendTo('#PdfViewer');

  //Use this code snippet to Disable the Extract Pages Tool
  viewer.pageOrganizerSettings = { canExtractPages: true };

  //Use this code snippet to Hide Extract Pages Tool
  //viewer.pageOrganizerSettings = { showExtractPagesOption: false }

  //Extract Page programmatically
  document.getElementById('extractPage').addEventListener('click', function () {
  // Extract pages 1 and 2
  var array = viewer.extractPages("1,2");

  // Load the extracted pages back into the viewer
  viewer.load(array,'');

  // Inspect the result if needed
  console.log(array);
});