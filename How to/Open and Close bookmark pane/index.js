var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
    resourceUrl:'https://cdn.syncfusion.com/ej2/24.2.3/dist/ej2-pdfviewer-lib'
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
                              ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
document.getElementById('closeBookmark').addEventListener('click', () => {
  // close Bookmark pane
  pdfviewer.bookmarkViewModule.closeBookmarkPane();
});  
document.getElementById('openBookmark').addEventListener('click', () => {
    // Open Bookmark pane
    pdfviewer.bookmarkViewModule.openBookmarkPane();
  });                            
pdfviewer.appendTo('#PdfViewer');
