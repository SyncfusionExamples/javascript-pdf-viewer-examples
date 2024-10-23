var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/27.1.48/dist/ej2-pdfviewer-lib'
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
pdfviewer.appendTo('#PdfViewer');
pdfviewer.annotationSelectorSettings = {
  selectionBorderColor: 'blue',
  resizerBorderColor: 'red',
  resizerFillColor: '#4070ff',
  resizerSize: 8,
  selectionBorderThickness: 1,
  resizerShape: 'Circle',
  selectorLineDashArray: [5, 6],
  resizerLocation: ej.pdfviewer.AnnotationResizerLocation.Corners | ej.pdfviewer.AnnotationResizerLocation.Edges,
  resizerCursorType: ej.pdfviewer.CursorType.grab
};