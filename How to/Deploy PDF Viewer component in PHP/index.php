<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Essential Studio for JavaScript : Detail Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

 
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-base/styles/material.css" rel="stylesheet">    
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-pdfviewer/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-buttons/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-popups/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-navigations/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-dropdowns/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-lists/styles/material.css" rel="stylesheet">
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-inputs/styles/material.css" rel="stylesheet">    
    <link href="https://cdn.syncfusion.com/ej2/28.1.33/ej2-splitbuttons/styles/material.css" rel="stylesheet">
    <script src="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2.min.js" type="text/javascript"></script>    
    <script src="https://cdn.syncfusion.com/ej2/syncfusion-helper.js" type ="text/javascript"></script>
</head>
<body>    
    <div id="container">
        <div id="PdfViewer" style="height:580px;width:100%;"></div>
    </div>            
    <script type="text/javascript">
        var pdfviewer = new ej.pdfviewer.PdfViewer({
            documentPath:'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf',
            resourceUrl:'https://cdn.syncfusion.com/ej2/27.2.2/dist/ej2-pdfviewer-lib'
        });
        ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.Print, ej.pdfviewer.Navigation, ej.pdfviewer.Toolbar,ej.pdfviewer.Magnification, ej.pdfviewer.Annotation, ej.pdfviewer.FormDesigner, ej.pdfviewer.FormFields, ej.pdfviewer.PageOrganizer);
        
        //PDF Viewer control rendering starts
        pdfviewer.appendTo('#PdfViewer');
    </script>
</body>
</html>