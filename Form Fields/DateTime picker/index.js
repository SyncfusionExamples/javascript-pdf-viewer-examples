var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/35.1.41/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Navigation, ej.pdfviewer.Annotation,
ej.pdfviewer.LinkAnnotation, ej.pdfviewer.BookmarkView, ej.pdfviewer.ThumbnailView, ej.pdfviewer.Print,
ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.FormFields, ej.pdfviewer.FormDesigner);

pdfviewer.appendTo('#PdfViewer');

// Add a Date field
document.getElementById("AddDatePicker").addEventListener('click', function () {
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'DateField1',
    bounds: { X: 146, Y: 200, Width: 200, Height: 24 },
    pageNumber: 1,
    isDateField: true,
    fontSize: 10,
    color: 'black',
    fontFamily: 'Helvetica',
    backgroundColor: '#daeaf7ff',
    borderColor: '#303030',
    alignment: 'Left',
    isReadOnly: false,
    visibility: 'visible',
    isRequired: false,
    isPrint: true,
    tooltip: '',
    thickness: 1,
    actions: {
      format: { script: 'AFDate_FormatEx("m/d/yy")' }
    }
  });
});

// Add a Time field
document.getElementById("AddTimePicker").addEventListener('click', function () {
  pdfviewer.formDesignerModule.addFormField('Textbox', {
    name: 'TimeField1',
    bounds: { X: 146, Y: 250, Width: 200, Height: 24 },
    pageNumber: 1,
    isDateField: true,
    fontSize: 10,
    color: 'black',
    fontFamily: 'Helvetica',
    backgroundColor: '#daeaf7ff',
    borderColor: '#303030',
    alignment: 'Left',
    isReadOnly: false,
    visibility: 'visible',
    isRequired: false,
    isPrint: true,
    tooltip: '',
    thickness: 1,
    actions: {
      format: { script: 'AFTime_FormatEx("HH:MM")' }
    }
  });
});