var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib",
  enableFormDesigner: true, //Set 'false' to disable form designer
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
  pdfviewer.appendTo('#PdfViewer');

  //Click event to get formfields collection
document.getElementById('formFieldCollection').addEventListener('click', function() {
    var fields = pdfviewer.formFieldCollection; // Gets all form fields
    console.log(fields); // Log the formField Collection
});