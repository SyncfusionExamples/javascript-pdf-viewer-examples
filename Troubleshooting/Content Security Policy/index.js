// Initialize PDF Viewer component
var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: "https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf",
    resourceUrl: "https://cdn.syncfusion.com/ej2/29.1.37/dist/ej2-pdfviewer-lib"
});
// To utilize the server-backed PDF Viewer, need to specify the service URL.
// This can be done by including the serviceUrl: 'https://services.syncfusion.com/js/production/api/pdfviewer'

ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
                              ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields);

// PDF Viewer control rendering starts
pdfviewer.appendTo('#PdfViewer');
