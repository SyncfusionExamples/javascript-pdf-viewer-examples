var pdfComparer = new ej.pdfviewer.PdfComparer({
    originalDocumentPath: 'https://cdn.syncfusion.com/content/pdf/original-document.pdf',
    modifiedDocumentPath: 'https://cdn.syncfusion.com/content/pdf/modified-document.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/34.2.2/dist/ej2-pdfviewer-lib'
});

// PDF Viewer control rendering starts
pdfComparer.appendTo('#PdfComparer');