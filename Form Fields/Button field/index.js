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

var pdfviewer = new ej.pdfviewer.PdfViewer({
    documentPath: window.location.origin + '/form_document.pdf',
    resourceUrl: 'https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib',

    documentLoad: function () {
        refreshButtonFields();
    },

    formFieldAdd: function () {
        refreshButtonFields();
    },

    formFieldRemove: function () {
        refreshButtonFields();
    }
});

pdfviewer.appendTo('#PdfViewer');

function refreshButtonFields() {

    var dropdown = document.getElementById('buttonFields');

    dropdown.innerHTML = '';

    var fields = Array.isArray(pdfviewer.formFieldCollections)
        ? pdfviewer.formFieldCollections
        : [];

    var buttonFields = [];

    for (var i = 0; i < fields.length; i++) {

        if (fields[i].type === 'ButtonField') {
            buttonFields.push(fields[i]);
        }
    }

    if (buttonFields.length === 0) {

        var emptyOption = document.createElement('option');

        emptyOption.text = 'No Button Field';
        emptyOption.value = '';

        dropdown.appendChild(emptyOption);
        return;
    }

    for (var j = 0; j < buttonFields.length; j++) {

        var option = document.createElement('option');

        option.value = buttonFields[j].id;
        option.text =
            buttonFields[j].name ||
            buttonFields[j].value ||
            buttonFields[j].id;

        dropdown.appendChild(option);
    }
}

function addButtonField() {

    var fields = Array.isArray(pdfviewer.formFieldCollections)
        ? pdfviewer.formFieldCollections
        : [];

    var count = 0;

    for (var i = 0; i < fields.length; i++) {

        if (fields[i].type === 'ButtonField') {
            count++;
        }
    }

    pdfviewer.formDesignerModule.addFormField('ButtonField', {
        name: 'Submit' + (count + 1),
        pageNumber: 1,
        bounds: {
            X: 100,
            Y: 350,
            Width: 120,
            Height: 32
        },
        value: 'Submit',
        text: 'Submit',
        tooltip: 'Click to submit',
        actions: {
            mouseUp: {
                action: ej.pdfviewer.ActionType.GoTo,
                destinationPageNumber: 5,
                destinationLocation: {
                    x: 100,
                    y: 100
                },
                zoomValue: 2
            }
        }
    });

    refreshButtonFields();
}

function enableButtonMode() {

    pdfviewer.formDesignerModule.setFormFieldMode('ButtonField');
}

function getSelectedField() {

    var selectedId =
        document.getElementById('buttonFields').value;

    if (!selectedId) {
        return null;
    }

    var fields = Array.isArray(pdfviewer.formFieldCollections)
        ? pdfviewer.formFieldCollections
        : [];

    for (var i = 0; i < fields.length; i++) {

        if (fields[i].id === selectedId) {
            return fields[i];
        }
    }

    return selectedId;
}

function editButtonField() {

    var field = getSelectedField();

    if (!field) {
        alert('Select a button field');
        return;
    }

    pdfviewer.formDesignerModule.updateFormField(field, {
        value: 'Submit Button',
        text: 'Submit Button',
        alignment: 'Left',
        tooltip: 'Updated Submit Button',
        actions: {
            mouseUp: {
                action: ej.pdfviewer.ActionType.GoTo,
                destinationPageNumber: 7,
                destinationLocation: {
                    x: 100,
                    y: 100
                },
                zoomValue: 1
            }
        }
    });

    refreshButtonFields();
}

function deleteSelectedField() {

    var field = getSelectedField();

    if (!field) {
        alert('Select a button field');
        return;
    }

    pdfviewer.formDesignerModule.deleteFormField(field);

    refreshButtonFields();
}