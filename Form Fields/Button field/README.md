# Button Form Field in JavaScript PDF Viewer

This sample demonstrates the **button form field** in the Syncfusion JavaScript PDF Viewer. It shows how to add button fields programmatically, place button fields interactively using the form designer, update existing button fields, and remove button fields.

## What is covered

- **Add a button field programmatically** with `formDesignerModule.addFormField('ButtonField', { ... })`.
- **Place a button field interactively** by switching the designer into button field mode with `formDesignerModule.setFormFieldMode('ButtonField')`.
- **Update button field properties** such as text, tooltip, alignment, and button actions using `formDesignerModule.updateFormField(...)`.
- **Configure navigation actions** that move to a specific page and location when the button is clicked.
- **Delete a button field** with `formDesignerModule.deleteFormField(...)`.

The fields placed through the PDF Viewer UI are also listed in the edit panel, allowing them to be updated or deleted regardless of how they were created.

## Supported button actions

| Action | Description |
|----------|-------------|
| `GoTo` | Navigates to a specified page and location in the PDF document. |

## Add a button field programmatically

```javascript
pdfviewer.formDesignerModule.addFormField('ButtonField', {
    name: 'Submit1',
    pageNumber: 1,
    bounds: {
        X: 100,
        Y: 350,
        Width: 120,
        Height: 32
    },
    value: 'Submit',
    text: 'Submit',
    tooltip: 'Click to submit'
});
```

## Place a button field interactively

```Javascript
pdfviewer.formDesignerModule.setFormFieldMode('ButtonField');

```

After the mode is active, click on the page to place a button field.

## Update an existing button field

```Javascript
pdfviewer.formDesignerModule.updateFormField(field, {
    value: 'Submit Button',
    text: 'Submit Button',
    tooltip: 'Updated Submit Button'
});
```

## Configure a button action

```Javascript
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

```

When the button is clicked, the PDF Viewer navigates to the specified page and location in the document.

## Remove a button field

```Javascript
pdfviewer.formDesignerModule.deleteFormField(field);
```

## Run the sample

```Shell
npm install
npm start
```

Once the sample is running, use the **Add Button Field Programmatically** panel to create button fields, **Enable Button Designer Mode** to place button fields interactively, and the **Edit Button Field** panel to update or delete existing button fields.