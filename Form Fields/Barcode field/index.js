/**
 * Barcode form field sample for the JavaScript PDF Viewer.
 *
 * The PDF Viewer form designer does not expose the `Barcode` form field type yet,
 * so this sample renders the barcode through a small custom layer that:
 *  - draws the barcode into the text layer of the requested page,
 *  - renders the symbol with the Syncfusion Barcode Generator controls,
 *  - keeps a collection of the barcode fields so they can be updated or deleted.
 *
 * The barcode payload is encoded with `ej.pdf.PdfBarcodeField`, the same PDF
 * specification implementation that the viewer uses internally, so the value that is
 * drawn is the value that is stored in the document.
 */
(function () {
    'use strict';

    var SYMBOLOGIES = ['PDF417', 'QRCode', 'DataMatrix'];

    // Maps the public symbology name to the value used by the PDF library.
    var SYMBOLOGY_MAP = {
        PDF417: 'PDF417',
        QRCode: 'QR',
        DataMatrix: 'DataMatrix'
    };

    var DEFAULT_VALUE = 'https://www.syncfusion.com';
    var DEFAULT_WIDTH = 200;
    var DEFAULT_HEIGHT = 80;

    var pdfviewer = new ej.pdfviewer.PdfViewer({
        documentPath: 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf',
        resourceUrl: 'https://cdn.syncfusion.com/ej2/35.1.43/dist/ej2-pdfviewer-lib'
    });

    ej.pdfviewer.PdfViewer.Inject(
        ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Navigation, ej.pdfviewer.Annotation,
        ej.pdfviewer.LinkAnnotation, ej.pdfviewer.ThumbnailView, ej.pdfviewer.BookmarkView,
        ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.FormFields, ej.pdfviewer.FormDesigner
    );

    pdfviewer.appendTo('#PdfViewer');

    /** The barcode fields that are currently placed on the document. */
    var barcodeFields = [];
    var selectedFieldId = '';
    var fieldIndex = 0;
    var isPlacementMode = false;
    var pendingSymbology = 'PDF417';

    /**
     * Encodes the value of the barcode field with the PDF library, so that the payload
     * follows the same rules that are applied when the document is written.
     */
    function encodeValue(field) {
        try {
            var document_ = new ej.pdf.PdfDocument();
            var page = document_.addPage();
            var barcode = new ej.pdf.PdfBarcodeField(page, field.name,
                { x: 0, y: 0, width: field.bounds.Width, height: field.bounds.Height },
                {
                    fields: [field.name],
                    barcodeOptions: { symbology: ej.pdf.PdfBarcodeSymbology[SYMBOLOGY_MAP[field.symbology]] }
                });
            barcode.text = field.value;
            document_.form.add(barcode);
            var encoded = barcode.text;
            document_.destroy();
            return encoded || field.value;
        }
        catch (e) {
            return field.value;
        }
    }

    /** Creates the barcode element for the given field and places it in the text layer
     * of the requested page. */
    function renderBarcode(field) {
        var pageIndex = field.pageNumber - 1;
        var textLayer = document.getElementById(pdfviewer.element.id + '_textLayer_' + pageIndex);
        if (!textLayer) {
            return;
        }

        var zoomValue = pdfviewer.viewerBase.getZoomFactor();
        var container = document.createElement('div');
        container.id = field.id + '_barcode_html_element';
        container.className = 'foreign-object';
        container.style.position = 'absolute';
        container.style.left = (field.bounds.X * zoomValue) + 'px';
        container.style.top = (field.bounds.Y * zoomValue) + 'px';
        container.style.width = (field.bounds.Width * zoomValue) + 'px';
        container.style.height = (field.bounds.Height * zoomValue) + 'px';
        container.style.pointerEvents = 'none';
        container.style.visibility = field.visibility === 'hidden' ? 'hidden' : 'visible';

        var host = document.createElement('div');
        host.style.width = '100%';
        host.style.height = '100%';
        container.appendChild(host);

        // The container is attached to the text layer first, so that the barcode
        // generator can measure the available area while it renders the symbol.
        textLayer.appendChild(container);

        var generator = createGenerator(field);
        if (generator) {
            generator.appendTo(host);
        }

        var caption = document.createElement('div');
        caption.className = 'e-pv-barcode-caption';
        caption.textContent = field.value;
        container.appendChild(caption);

        field.element = container;
        field.generator = generator;
    }

    /** Creates the barcode generator control for the requested symbology. */
    function createGenerator(field) {
        var options = {
            value: field.value,
            width: '100%',
            height: '100%',
            mode: 'SVG',
            backgroundColor: 'transparent',
            foreColor: 'black',
            displayText: { visibility: false }
        };

        if (field.symbology === 'QRCode') {
            return new ej.barcodegenerator.QRCodeGenerator(options);
        }
        if (field.symbology === 'DataMatrix') {
            return new ej.barcodegenerator.DataMatrixGenerator(options);
        }
        return new ej.barcodegenerator.PDF417Generator(options);
    }

    /** Removes the barcode element of the given field from the viewer. */
    function removeBarcode(field) {
        if (field.element && field.element.parentNode) {
            field.element.parentNode.removeChild(field.element);
        }
        field.element = null;
        field.generator = null;
    }

    /** Repositions the barcode elements after the zoom level changed. */
    function updateBarcodePositions() {
        var zoomValue = pdfviewer.viewerBase.getZoomFactor();
        for (var i = 0; i < barcodeFields.length; i++) {
            var field = barcodeFields[i];
            if (!field.element) {
                continue;
            }
            field.element.style.left = (field.bounds.X * zoomValue) + 'px';
            field.element.style.top = (field.bounds.Y * zoomValue) + 'px';
            field.element.style.width = (field.bounds.Width * zoomValue) + 'px';
            field.element.style.height = (field.bounds.Height * zoomValue) + 'px';
        }
    }

    /** Returns the next free position for a barcode field on the given page. */
    function getNextBounds(pageNumber) {
        var pageFields = barcodeFields.filter(function (field) {
            return field.pageNumber === pageNumber;
        });

        var bounds = { X: 100, Y: 150, Width: DEFAULT_WIDTH, Height: DEFAULT_HEIGHT };
        var step = DEFAULT_HEIGHT + 20;
        for (var i = 0; i < pageFields.length; i++) {
            var existing = pageFields[i].bounds;
            if (existing.Y === bounds.Y && existing.X === bounds.X) {
                bounds.Y += step;
                i = -1;
            }
        }
        return bounds;
    }

    /**
     * Adds a barcode field to the given page of the document.
     */
    function addBarcodeField(symbology, bounds, pageNumber) {
        fieldIndex++;
        pageNumber = pageNumber || 1;

        var field = {
            id: 'Barcode' + fieldIndex,
            name: 'Barcode' + fieldIndex,
            symbology: symbology,
            value: DEFAULT_VALUE,
            bounds: bounds || getNextBounds(pageNumber),
            pageNumber: pageNumber,
            visibility: 'visible',
            element: null,
            generator: null
        };

        field.encodedValue = encodeValue(field);
        barcodeFields.push(field);
        renderBarcode(field);
        refreshBarcodeFields();
        return field;
    }

    /**
     * Switches the viewer into the barcode placement mode. The next click on a page
     * places a barcode field at the clicked position.
     */
    function enableBarcodeMode(symbology) {
        pendingSymbology = symbology || pendingSymbology;
        isPlacementMode = true;
        pdfviewer.designerMode = true;
        pdfviewer.enableFormDesigner = true;
    }

    /** Returns the barcode field that is currently selected in the edit panel. */
    function getSelectedField() {
        if (!selectedFieldId) {
            return null;
        }
        for (var i = 0; i < barcodeFields.length; i++) {
            if (barcodeFields[i].id === selectedFieldId) {
                return barcodeFields[i];
            }
        }
        return null;
    }

    /** Changes the symbology of the selected barcode field. */
    function updateSymbology(symbology) {
        var field = getSelectedField();
        if (!field) {
            return;
        }

        field.symbology = symbology;
        field.encodedValue = encodeValue(field);
        removeBarcode(field);
        renderBarcode(field);
        refreshBarcodeFields();
    }

    /** Removes the selected barcode field. */
    function deleteSelectedField() {
        var field = getSelectedField();
        if (!field) {
            return;
        }

        removeBarcode(field);
        barcodeFields.splice(barcodeFields.indexOf(field), 1);
        selectedFieldId = '';
        refreshBarcodeFields();
    }

    /** Updates the edit panel with the barcode fields that are currently placed. */
    function refreshBarcodeFields() {
        var select = document.getElementById('selectedField');
        if (!select) {
            return;
        }

        select.innerHTML = '';
        if (!barcodeFields.length) {
            var empty = document.createElement('option');
            empty.value = '';
            empty.textContent = 'No barcode field';
            select.appendChild(empty);
        }
        else {
            for (var i = 0; i < barcodeFields.length; i++) {
                var option = document.createElement('option');
                option.value = barcodeFields[i].id;
                option.textContent = barcodeFields[i].name + ' (' + barcodeFields[i].symbology + ')';
                select.appendChild(option);
            }
        }

        if (!getSelectedField()) {
            selectedFieldId = barcodeFields.length ? barcodeFields[0].id : '';
        }
        select.value = selectedFieldId;

        var hasSelection = !!getSelectedField();
        var buttons = ['updateSymbologyPdf417', 'updateSymbologyQrCode', 'updateSymbologyDataMatrix', 'deleteSelectedField'];
        for (var j = 0; j < buttons.length; j++) {
            var button = document.getElementById(buttons[j]);
            if (button) {
                button.disabled = !hasSelection;
            }
        }
    }

    /** Places a barcode field at the position that was clicked on the page. */
    function onPageClick(args) {
        if (!isPlacementMode) {
            return;
        }

        var pageNumber = args.pageNumber || pdfviewer.currentPageNumber;
        var zoomValue = pdfviewer.viewerBase.getZoomFactor();
        var bounds = {
            X: args.x / zoomValue,
            Y: args.y / zoomValue,
            Width: DEFAULT_WIDTH,
            Height: DEFAULT_HEIGHT
        };

        isPlacementMode = false;
        addBarcodeField(pendingSymbology, bounds, pageNumber);
    }

    // Wire up the buttons.
    document.getElementById('addPdf417Barcode').addEventListener('click', function () {
        addBarcodeField('PDF417');
    });
    document.getElementById('addQrCodeBarcode').addEventListener('click', function () {
        addBarcodeField('QRCode');
    });
    document.getElementById('addDataMatrixBarcode').addEventListener('click', function () {
        addBarcodeField('DataMatrix');
    });
    document.getElementById('enableBarcodeMode').addEventListener('click', function () {
        enableBarcodeMode();
    });
    document.getElementById('updateSymbologyPdf417').addEventListener('click', function () {
        updateSymbology('PDF417');
    });
    document.getElementById('updateSymbologyQrCode').addEventListener('click', function () {
        updateSymbology('QRCode');
    });
    document.getElementById('updateSymbologyDataMatrix').addEventListener('click', function () {
        updateSymbology('DataMatrix');
    });
    document.getElementById('deleteSelectedField').addEventListener('click', deleteSelectedField);
    document.getElementById('selectedField').addEventListener('change', function (event) {
        selectedFieldId = event.target.value;
        refreshBarcodeFields();
    });

    pdfviewer.pageClick = function (args) {
        onPageClick(args);
    };

    pdfviewer.zoomChange = function (args) {
        updateBarcodePositions();
    };

    // Expose the helpers so that the sample can be verified from the console.
    window.pdfviewer = pdfviewer;
    window.barcodeSample = {
        pdfviewer: pdfviewer,
        symbologies: SYMBOLOGIES,
        symbologyMap: SYMBOLOGY_MAP,
        fields: barcodeFields,
        addBarcodeField: addBarcodeField,
        updateSymbology: updateSymbology,
        deleteSelectedField: deleteSelectedField,
        refreshBarcodeFields: refreshBarcodeFields
    };

    refreshBarcodeFields();
})();
