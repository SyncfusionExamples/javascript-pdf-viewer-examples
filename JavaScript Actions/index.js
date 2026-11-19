ej.pdfviewer.PdfViewer.Inject(
  ej.pdfviewer.Toolbar,
  ej.pdfviewer.Magnification,
  ej.pdfviewer.Navigation,
  ej.pdfviewer.Annotation,
  ej.pdfviewer.LinkAnnotation,
  ej.pdfviewer.BookmarkView,
  ej.pdfviewer.ThumbnailView,
  ej.pdfviewer.Print,
  ej.pdfviewer.TextSelection,
  ej.pdfviewer.TextSearch,
  ej.pdfviewer.FormFields,
  ej.pdfviewer.FormDesigner,
  ej.pdfviewer.PageOrganizer
);

var viewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
  resourceUrl: 'https://cdn.syncfusion.com/ej2/35.1.41/dist/ej2-pdfviewer-lib'
});

viewer.appendTo('#PdfViewer');


document.getElementById('addFormatFields').addEventListener('click', function () {

  var numberField = {
    name: "NumberField",
    bounds: { X: 146, Y: 200, Width: 200, Height: 24 },
    pageNumber: 1,
    fontSize: 10,
    color: "black",
    fontFamily: "Helvetica",
    backgroundColor: "#daeaf7ff",
    borderColor: "#303030",
    alignment: "Left",
    isReadOnly: false,
    visibility: "visible",
    isRequired: false,
    isPrint: true,
    tooltip: "",
    thickness: 1,
    actions: {
      format: {
        script: 'AFNumber_Format(2, 0, 0, 0, "$", true)'
      }
    }
  };
  viewer.formDesignerModule.addFormField("Textbox", numberField);

  var percentField = {
    name: "PercentField",
    bounds: { X: 146, Y: 300, Width: 200, Height: 24 },
    pageNumber: 1,
    fontSize: 10,
    color: "black",
    fontFamily: "Helvetica",
    backgroundColor: "#daeaf7ff",
    borderColor: "#303030",
    alignment: "Left",
    isReadOnly: false,
    visibility: "visible",
    isRequired: false,
    isPrint: true,
    tooltip: "",
    thickness: 1,
    actions: {
      format: {
        script: 'AFPercent_Format(2, 0)'
      }
    }
  };
  viewer.formDesignerModule.addFormField("Textbox", percentField);

  var specialField = {
    name: "SpecialField",
    bounds: { X: 146, Y: 400, Width: 200, Height: 24 },
    pageNumber: 1,
    fontSize: 10,
    color: "black",
    fontFamily: "Helvetica",
    backgroundColor: "#daeaf7ff",
    borderColor: "#303030",
    alignment: "Left",
    isReadOnly: false,
    visibility: "visible",
    isRequired: false,
    isPrint: true,
    tooltip: "",
    thickness: 1,
    actions: {
      format: {
        script: 'AFSpecial_Format(0)'
      }
    }
  };
  viewer.formDesignerModule.addFormField("Textbox", specialField);

  var maskField = {
    name: "MaskField",
    bounds: { X: 146, Y: 500, Width: 200, Height: 24 },
    pageNumber: 1,
    fontSize: 10,
    color: "black",
    fontFamily: "Helvetica",
    backgroundColor: "#daeaf7ff",
    borderColor: "#303030",
    alignment: "Left",
    isReadOnly: false,
    visibility: "visible",
    isRequired: false,
    isPrint: true,
    tooltip: "",
    thickness: 1,
    actions: {
      keyPressed: {
        script: 'AFSpecial_KeystrokeEx("AAA-9999")'
      }
    }
  };
  viewer.formDesignerModule.addFormField("Textbox", maskField);
});