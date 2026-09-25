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

//Add Redaction Annotation Programmatically
   document.getElementById('addAnnot').addEventListener('click', function(){
       pdfviewer.annotation.addAnnotation("Redaction", {
           bound: { x: 200, y: 480,width: 150, height: 75 },
           pageNumber: 1,
           markerOpacity: 0.5,
           markerFillColor: '#0000FF',
           markerBorderColor: 'white',
           fillColor: 'red',
           overlayText: 'text',
           fontColor: 'yellow',
           isRepeat: true,
           fontFamily: 'Times New Roman',
           fontSize: 8,
           textAlignment: 'Left',
           beforeRedactionsApplied: false
       });
   });

//Delete Redaction annotation by id
document.getElementById('deleteAnnotationbyId').addEventListener('click', () => {
    pdfviewer.annotationModule.deleteAnnotationById(
      pdfviewer.annotationCollection[0].annotationId
    );
  });

//Applying Default Redaction Settings 
pdfviewer.redactionSettings= {
        overlayText: 'Confidential',
        markerFillColor: '#FF0000',
        markerBorderColor: '#000000',
        isRepeat: false,
        fillColor: '#F8F8F8',
        fontColor: '#333333',
        fontSize: 14,
        fontFamily: 'Symbol',
        textAlignment: 'Right'
    };

//Event Listener to Edit Redaction Annotation
let editRedactAnnotation = document.getElementById('editRedactAnnotation');
if (editRedactAnnotation) {
 editRedactAnnotation.addEventListener('click', function () {
    if (pdfviewer) {
        for (let i = 0; i < pdfviewer.annotationCollection.length; i++) {
            if (pdfviewer.annotationCollection[i].subject === "Redaction") {
                pdfviewer.annotationCollection[i].overlayText= 'EditedAnnotation';
                pdfviewer.annotationCollection[i].markerFillColor= '#22FF00';
                pdfviewer.annotationCollection[i].markerBorderColor= '#000000';
                pdfviewer.annotationCollection[i].isRepeat= true;
                pdfviewer.annotationCollection[i].fillColor= '#F8F8F8';
                pdfviewer.annotationCollection[i].fontColor= '#333333';
                pdfviewer.annotationCollection[i].fontSize= 14;
                pdfviewer.annotationCollection[i].fontFamily= 'Symbol';
                pdfviewer.annotationCollection[i].textAlignment= 'Right';
                pdfviewer.annotationCollection[i].beforeRedactionsApplied= true;
                pdfviewer.annotation.editAnnotation(viewer.annotationCollection[i]);
            }
        }
    }
});
}

//Event Listener to Apply Page Redaction 
document.getElementById('addPageRedactions').addEventListener('click', () => {
    pdfviewer.annotation.addPageRedactions([1, 3, 5, 7]); // Redacts pages 1, 3, 5, and 7(Enter the pages to Redact)
});

//Event Listener to Apply Redaction
document.getElementById('redact').addEventListener('click', () => {
    pdfviewer.annotation.redact();
});


