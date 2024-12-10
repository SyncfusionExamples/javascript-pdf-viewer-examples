var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/27.2.2/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
pdfviewer.appendTo('#PdfViewer');

document.getElementById('getPageInfo').addEventListener('click', function() {
  // Set the page index for which info is required
  let pageIndex=0;
  // To Retrieve and log the page information
  console.log(pdfviewer.getPageInfo(pageIndex));
  // To Log the specific page information details to the console
  const pageInfo = pdfviewer.getPageInfo(pageIndex);
  console.log(`Page Info for Page Index ${pageIndex}:`);
  console.log(`Height: ${pageInfo.height}`);
  console.log(`Width: ${pageInfo.width}`);
  console.log(`Rotation: ${pageInfo.rotation}`);
});

    