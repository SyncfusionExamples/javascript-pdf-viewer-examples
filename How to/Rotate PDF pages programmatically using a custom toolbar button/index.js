// Render the PDF viewer control
var toolItem1 = {
  prefixIcon: 'e-icons e-transform-left',
  id: 'rotateCounterclockwise',
  tooltipText: 'Custom toolbar item',
};
var toolItem2 = {
  prefixIcon: 'e-icons e-transform-right',
  id: 'rotateClockwise',
  tooltipText: 'Custom toolbar item',
};
var viewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-designer.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib',
  toolbarSettings: {
    toolbarItems: [
      toolItem1,
      toolItem2,
      'OpenOption',
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption',
      'UndoRedoTool',
      'AnnotationEditTool',
      'FormDesignerEditTool',
      'CommentTool',
      'SubmitForm',
    ],
  },
});
ej.pdfviewer.PdfViewer.Inject(
  ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification,
  ej.pdfviewer.BookmarkView,
  ej.pdfviewer.ThumbnailView,
  ej.pdfviewer.TextSelection,
  ej.pdfviewer.TextSearch,
  ej.pdfviewer.Print,
  ej.pdfviewer.Navigation,
  ej.pdfviewer.LinkAnnotation,
  ej.pdfviewer.Annotation,
  ej.pdfviewer.FormFields,
  ej.pdfviewer.FormDesigner,
  ej.pdfviewer.PageOrganizer
);

viewer.appendTo('#pdfViewer');
//Handle toolbar button click events
viewer.toolbarClick = function (args) {
  // Rotate Clockwise 
  if (args.item && args.item.id === 'rotateClockwise') {
    viewer.saveAsBlob().then(function (value) {
      var reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = () => {
        //convert blob to base64 and load into PdfDocument
        var base64 = reader.result.split('base64,')[1];
        let pdfDocument = new ej.pdf.PdfDocument(base64);
        //Get the first page and increment rotation
        let page = pdfDocument.getPage(0); // Provide the required page number index here
        var rotation = page.rotation + 1;
        if (rotation > 4) {
          rotation = 0;
        }
        page.rotation = rotation;
        // Save and reload the rotated PDF
        pdfDocument.saveAsBlob().then((value) => {
          var reader = new FileReader();
          reader.readAsDataURL(value.blobData);
          reader.onload = () => {
            var base64data = reader.result;
            console.log(base64data);
            viewer.load(base64data);
          };
        });
      };
    });
  }
  // Rotate Counterclockwise 
  else if (args.item && args.item.id === 'rotateCounterclockwise') {
    viewer.saveAsBlob().then(function (value) {
      var reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = () => {
        // Convert blob to base64 and load into PdfDocument
        var base64 = reader.result.split('base64,')[1];
        let pdfDocument = new ej.pdf.PdfDocument(base64);
        //Get the first page and decrement rotation
        let page = pdfDocument.getPage(0); // Provide the required page number index here
        var rotation = page.rotation - 1;
        if (rotation < 0) {
          rotation = 3;
        }
        page.rotation = rotation;
        // Save and reload the rotated PDF
        pdfDocument.saveAsBlob().then((value) => {
          var reader = new FileReader();
          reader.readAsDataURL(value.blobData);
          reader.onload = () => {
            var base64data = reader.result;
            console.log(base64data);
            viewer.load(base64data);
          };
        });
      };
    }); 
  }
};
