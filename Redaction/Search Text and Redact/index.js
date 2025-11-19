var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib",
  toolbarSettings: {
    toolbarItems: [
      'OpenOption',
      'UndoRedoTool',
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'CommentTool',
      'SubmitForm',
      'AnnotationEditTool',
      'RedactionEditTool',   // Enables Redaction toolbar
      'FormDesignerEditTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption'
    ]
  }
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
pdfviewer.appendTo('#PdfViewer');

//EventListener to Search Text and Redact  
document.getElementById('searchTextRedact').addEventListener('click', () => {
        // Function to handle extractTextCompleted event
        pdfviewer.extractTextCompleted = args => {
            const searchText = "syncfusion"; //Provide text to be redacted

            // Perform text search
            const searchResults = pdfviewer.textSearchModule.findText(searchText, false);

            if (!searchResults || searchResults.length === 0) {
                console.warn("No matches found.");
                return;
            }

            // Loop through search results
            for (let i = 0; i < searchResults.length; i++) {
                const pageResult = searchResults[i];
                if (!pageResult || !pageResult.bounds || pageResult.bounds.length === 0) { continue; }

                // guard pageIndex (fixes TS18048)
                if (pageResult.pageIndex == null) { continue; }
                const pageNumber = pageResult.pageIndex + 1;

                // Loop through each bounding box of the found text
                for (let j = 0; j < pageResult.bounds.length; j++) {
                    const bound = pageResult.bounds[j];

                    // Add a redaction annotation at the found text location
                    pdfviewer.annotation.addAnnotation("Redaction", {
                        bound: {
                            x: (bound.x * 96) / 72,
                            y: (bound.y * 96) / 72,
                            width: (bound.width * 96) / 72,
                            height: (bound.height * 96) / 72
                        },
                        pageNumber: pageNumber,
                        overlayText: "Confidential",
                        fillColor: "#00FF40FF",
                        fontColor: "#333333",
                        fontSize: 12,
                        fontFamily: "Arial",
                        // removed textAlign property (fixes TS2353)
                        markerFillColor: "#FF0000",
                        markerBorderColor: "#000000"
                    });
                }
            }
        };
    });

//EventListener to Apply Redaction
document.getElementById("applyRedaction").addEventListener('click', ()=>{
    pdfviewer.annotation.redact();
});

