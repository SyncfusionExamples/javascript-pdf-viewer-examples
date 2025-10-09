var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.1.17/dist/ej2-pdfviewer-lib',
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields);
pdfviewer.appendTo('#PdfViewer');

   document.getElementById('openCommentPanel').addEventListener('click', ()=> {
        pdfviewer.annotation.showCommentsPanel();
    });

    document.getElementById('closeCommentPanel').addEventListener('click', ()=> {
        pdfviewer.viewerBase.navigationPane.closeCommentPanelContainer();
    });

    pdfviewer.documentLoad = function (args) {
        pdfviewer.annotation.showCommentsPanel();
    }