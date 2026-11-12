# Barcode Form Field in JavaScript PDF Viewer

This sample demonstrates the **Barcode Form Field** support in the Syncfusion JavaScript PDF Viewer. It shows how to add barcode fields programmatically, place barcode fields interactively using Form Designer mode, modify the barcode symbology of existing fields, and remove barcode fields from the document.

## What is covered

- **Add barcode fields programmatically** using the `addFormField` API.
- **Place barcode fields interactively** using the Form Designer barcode mode.
- **Retrieve and manage barcode fields** through the `formFieldCollections` property.
- **Change the barcode symbology** of an existing barcode field.
- **Delete barcode fields** using the `deleteFormField` API.
- **Automatically refresh the barcode field collection** when fields are added or removed.

## Supported barcode types

| Symbology | Description |
| --- | --- |
| PDF417 | A stacked linear barcode suitable for storing large amounts of data. |
| QRCode | A two\-dimensional barcode commonly used for URLs and compact data storage. |
| DataMatrix | A high\-density two\-dimensional barcode optimized for compact data encoding. |

## Add a barcode field programmatically

Use the Form Designer's `addFormField` API to create a barcode field.

```Javascript
pdfviewer.formDesignerModule.addFormField('Barcode', {
    name: 'Barcode1',
    bounds: {
        X: 100,
        Y: 150,
        Width: 200,
        Height: 80
    },
    pageNumber: 1,
    symbology: 'QRCode'
});
```

## Place a barcode field interactively

Switch the PDF Viewer to Barcode Form Designer mode and click on a page to place the barcode field.

```Javascript
pdfviewer.formDesignerModule.setFormFieldMode('Barcode');
```

## Retrieve barcode fields

Barcode fields can be accessed through the `formFieldCollections` property.

```Javascript
var fields = pdfviewer.formFieldCollections;

for (var i = 0; i < fields.length; i++) {
    if (fields[i].type === 'Barcode') {
        console.log(fields[i]);
    }
}
```

## Change the barcode symbology

Update the symbology of an existing barcode field using the `updateFormField` API.

```Javascript
pdfviewer.formDesignerModule.updateFormField(field, {
    symbology: 'DataMatrix'
});
```

Supported symbology values:

- `PDF417`
- `QRCode`
- `DataMatrix`

## Remove a barcode field

Delete an existing barcode field using the `deleteFormField` API.

```Javascript
pdfviewer.formDesignerModule.deleteFormField(field);
```

## Refresh the barcode field list

The sample keeps the barcode field dropdown synchronized with the document by refreshing it during document load and whenever a form field is added or removed.

```Javascript
var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentLoad: function () {
        refreshBarcodeFields();
    },

    formFieldAdd: function () {
        refreshBarcodeFields();
    },

    formFieldRemove: function () {
        refreshBarcodeFields();
    }
});
```

## Sample structure

The sample uses the built\-in Barcode Form Field support provided by the PDF Viewer Form Designer APIs:

- Barcode fields are created using the `addFormField('Barcode', ...)` API.
- Interactive placement is enabled through `setFormFieldMode('Barcode')`.
- Existing barcode fields are retrieved from `formFieldCollections`.
- Barcode properties are modified using `updateFormField`.
- Barcode fields are removed using `deleteFormField`.
- A custom dropdown UI is used to select and manage barcode fields within the document.

## Learn more

- [https://help.syncfusion.com/document\-processing/pdf/pdf\-viewer/javascript\-es5/forms/overview/](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/javascript-es5/forms/overview/)
- [https://ej2.syncfusion.com/javascript/documentation/api/pdfviewer/](https://ej2.syncfusion.com/javascript/documentation/api/pdfviewer/)
- [https://ej2.syncfusion.com/javascript/documentation/pdfviewer/form\-designer/](https://ej2.syncfusion.com/javascript/documentation/pdfviewer/form-designer/)

