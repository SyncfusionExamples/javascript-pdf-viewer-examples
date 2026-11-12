# Barcode Form Field in JavaScript PDF Viewer

This sample demonstrates the **barcode form field** in the Syncfusion JavaScript PDF Viewer. It shows how to add barcode fields programmatically, how to place a barcode field interactively, how to change the barcode type (symbology) of an existing field, and how to remove a barcode field.

## What is covered

- **Add a barcode field programmatically** with `barcodeSample.addBarcodeField('QRCode', ...)`.
- **Place a barcode field interactively** by switching the viewer into the barcode placement mode and clicking on the page.
- **Change the barcode type** of an existing field — PDF417, QR Code and Data Matrix are supported.
- **Delete a barcode field** with `barcodeSample.deleteSelectedField()`.

## Supported barcode types

| Symbology | Description |
|---|---|
| `PDF417` | The default symbology of a new barcode field. |
| `QRCode` | Recommended for links and short payloads. |
| `DataMatrix` | A dense symbology for short alphanumeric payloads. |

## Add a barcode field programmatically

```javascript
barcodeSample.addBarcodeField('QRCode', {
    X: 100, Y: 150, Width: 200, Height: 80
}, 1);
```

## Place a barcode field interactively

```javascript
// Switches the viewer into the barcode placement mode.
// The next click on a page places the barcode field at the clicked position.
barcodeSample.pdfviewer.designerMode = true;
```

## Change the barcode type of an existing field

```javascript
barcodeSample.updateSymbology('DataMatrix');
```

## Remove a barcode field

```javascript
barcodeSample.deleteSelectedField();
```

## Sample structure

The barcode field type is not exposed by the PDF Viewer form designer yet, so the sample adds a small custom layer on top of the viewer:

- the barcode is rendered into the text layer of the page with the Syncfusion Barcode Generator controls,
- the payload is encoded with `ej.pdf.PdfBarcodeField`, the same PDF specification implementation that the viewer uses internally,
- the placed fields are tracked in a collection so that they can be updated or deleted.

The sample requires EJ2 `35.1.43` or later, which is the first release that exposes the barcode form field support in the underlying PDF library.

## Learn more

- [Create Form Fields in JavaScript PDF Viewer UG](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/javascript-es5/forms/overview/)
- [Form Designer overview](https://ej2.syncfusion.com/javascript/documentation/api/pdfviewer/formdesigner)
