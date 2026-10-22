var pdfviewer = new ej.pdfviewer.PdfViewer({
  documentPath: window.location.origin + '/blank.pdf',
  resourceUrl: "https://cdn.syncfusion.com/ej2/35.1.41/dist/ej2-pdfviewer-lib",
});
ej.pdfviewer.PdfViewer.Inject(ej.pdfviewer.Toolbar, ej.pdfviewer.Magnification, ej.pdfviewer.Navigation, ej.pdfviewer.Annotation,
  ej.pdfviewer.LinkAnnotation, ej.pdfviewer.BookmarkView, ej.pdfviewer.ThumbnailView, ej.pdfviewer.Print,
  ej.pdfviewer.TextSelection, ej.pdfviewer.TextSearch, ej.pdfviewer.FormFields, ej.pdfviewer.FormDesigner,
  ej.pdfviewer.PageOrganizer);

// Default border styles applied to the annotations created with the annotation modes.
pdfviewer.rectangleSettings = {
  strokeColor: '#d32f2f',
  fillColor: '#ffe0b2',
  borderStyle: 'Cloud',
  cloudIntensity: 2
};

pdfviewer.circleSettings = {
  strokeColor: '#1976d2',
  fillColor: '#bbdefb',
  borderStyle: 'Dashed',
  borderDashArray: [5, 5]
};

pdfviewer.freeTextSettings = {
  fillColor: 'red',
  borderColor: '#2e7d32',
  fontColor: '#1b5e20',
  opacity: 0.3,
  enableAutoFit: true,
  borderStyle: 'Cloud',
  cloudIntensity: 2
};

pdfviewer.cloudSettings = {
  opacity: 1,
  strokeColor: '#9c27b0',
  fillColor: '#f3e5f5',
  author: 'Cloud',
  borderStyle: 'Cloud',
  cloudIntensity: 2
};

pdfviewer.lineSettings = {
  strokeColor: '#f57c00',
  borderStyle: 'Dashed',
  borderDashArray: [4, 3]
};

pdfviewer.polygonSettings = {
  fillColor: '#ffa5d8',
  strokeColor: '#ff6a00',
  thickness: 2,
  opacity: 0.9,
  borderStyle: 'Cloud',
  cloudIntensity: 2
};

pdfviewer.areaSettings = {
  fillColor: 'yellow',
  strokeColor: 'orange',
  opacity: 0.6,
  borderStyle: 'Cloud',
  cloudIntensity: 2
};

pdfviewer.appendTo('#PdfViewer');

// Set the mode used for newly added annotations
document.getElementById("RectangleMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Rectangle');
});

document.getElementById("CircleMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Circle');
});

document.getElementById("PolygonMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Polygon');
});

document.getElementById("FreeTextMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('FreeText');
});

document.getElementById("AreaMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Area');
});

document.getElementById("LineMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('Line');
});

// Exit the annotation mode
document.getElementById("ExitAnnotationMode").addEventListener('click', function () {
  pdfviewer.annotation.setAnnotationMode('None');
});

// Add annotations programmatically with cloud/dashed borders
document.getElementById("AddCloudRectangle").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Rectangle', {
    offset: { x: 90, y: 120 },
    pageNumber: 0,
    width: 220,
    height: 110,
    borderStyle: 'Cloud',
    cloudIntensity: 2,
    strokeColor: '#d32f2f',
    fillColor: '#ffe0b2',
    opacity: 0.4,
    author: 'Guest'
  });
});

document.getElementById("AddDashedCircle").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Circle', {
    offset: { x: 360, y: 120 },
    pageNumber: 0,
    width: 140,
    height: 140,
    borderStyle: 'Dashed',
    borderDashArray: [5, 5],
    strokeColor: '#1976d2',
    fillColor: '#bbdefb',
    opacity: 0.4,
    author: 'Guest'
  });
});

document.getElementById("AddCloudFreeText").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('FreeText', {
    offset: { x: 90, y: 300 },
    pageNumber: 0,
    width: 220,
    height: 70,
    borderStyle: 'Cloud',
    cloudIntensity: 1,
    borderColor: '#2e7d32',
    fillColor: '#e8f5e9',
    fontColor: '#1b5e20',
    opacity: 0.3,
    author: 'Guest'
  });
});

document.getElementById("AddDashedLine").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Line', {
    offset: { x: 360, y: 330 },
    pageNumber: 0,
    points: [{ x: 360, y: 330 }, { x: 500, y: 400 }],
    borderStyle: 'Dashed',
    borderDashArray: [4, 3],
    strokeColor: '#f57c00',
    opacity: 1,
    author: 'Guest'
  });
});

document.getElementById("AddCloudArea").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Area', {
    offset: { x: 90, y: 430 },
    pageNumber: 0,
    vertexPoints: [
      { x: 90, y: 430 },
      { x: 300, y: 430 },
      { x: 300, y: 520 },
      { x: 90, y: 520 }
    ],
    borderStyle: 'Cloud',
    cloudIntensity: 2,
    strokeColor: '#c2185b',
    fillColor: '#fce4ec',
    opacity: 0.4,
    author: 'Guest'
  });
});

document.getElementById("AddDashedRadius").addEventListener('click', function () {
  pdfviewer.annotation.addAnnotation('Radius', {
    offset: { x: 380, y: 470 },
    pageNumber: 0,
    points: [{ x: 380, y: 470 }, { x: 470, y: 470 }],
    borderStyle: 'Dashed',
    borderDashArray: [6, 3],
    strokeColor: '#00838f',
    opacity: 1,
    author: 'Guest'
  });
});

// Modify the border style of the currently selected annotation
function updateSelectedBorder(borderStyle, extra) {
  var annotation = pdfviewer.annotationCollection[pdfviewer.annotationCollection.length - 1];

  if (!annotation) {
    return;
  }

  // Set border style
  annotation.borderStyle = borderStyle;

  // Apply additional properties dynamically
  Object.keys(extra).forEach(function (key) {
    annotation[key] = extra[key];
  });

  pdfviewer.annotation.editAnnotation(annotation);
}

document.getElementById("ApplyCloudBorder").addEventListener('click', function () {
  updateSelectedBorder('Cloud', {
    cloudIntensity: 2
  });
});

document.getElementById("ApplyDashedBorder").addEventListener('click', function () {
  updateSelectedBorder('Dashed', {
    borderDashArray: [5, 5]
  });
});

document.getElementById("ResetBorder").addEventListener('click', function () {
  updateSelectedBorder('Solid', {
    borderDashArray: null,
    cloudIntensity: 1
  });
});