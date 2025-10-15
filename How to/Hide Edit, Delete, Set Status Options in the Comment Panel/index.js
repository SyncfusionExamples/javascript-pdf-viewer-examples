var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.17/dist/ej2-pdfviewer-lib',
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields);
pdfviewer.appendTo('#PdfViewer');
      // Open Comment Panel
   document.getElementById('openCommentPanel').addEventListener('click', ()=> {
        pdfviewer.annotation.showCommentsPanel();
    });
    // Close Comment Panel
    document.getElementById('closeCommentPanel').addEventListener('click', ()=> {
        pdfviewer.viewerBase.navigationPane.closeCommentPanelContainer();
    });
     // Automatically open Comment Panel on document load
    pdfviewer.documentLoad = function (args) {
        pdfviewer.annotation.showCommentsPanel();
    }
