// ============================================================
// Semantic Text Comparison Application
// ============================================================

const appState = {
    viewer1: null,
    viewer2: null,
    loadedCount: 0,
    viewersLoaded: false,
    synchronizationEnabled: true,
    highlightsEnabled: true,
    comparisonResult: null
};

// ============================================================
// UI Control Panel Creation
// ============================================================

function createControlPanel() {
    const panel = document.getElementById('controlPanel');

    panel.innerHTML = `
    <!-- Main Control Buttons -->
    <button class="btn-primary" onclick="handleCompare()">Compare Documents</button>
    <button class="btn-success" onclick="handleToggleHighlights()">
      <span id="highlightBtnText">Disable Highlights</span>
    </button>
    <button class="btn-warning" onclick="handleToggleSync()">
      <span id="syncBtnText">Disable Sync</span>
    </button>
    <button class="btn-danger" onclick="handleClearAnnotations()">Clear Annotations</button>

    <!-- Separator -->
    <div class="separator"></div>

    <!-- Test Buttons -->
    <button class="btn-info" onclick="getDifferencesByType('Added')">Test: Get Added</button>
    <button class="btn-info" onclick="getDifferencesByType('Deleted')">Test: Get Deleted</button>
    <button class="btn-info" onclick="getDifferencesByType('Modified')">Test: Get Modified</button>
    <button class="btn-secondary" onclick="groupDifferencesByPage()">Test: Group by Page</button>
    <button class="btn-secondary" onclick="generateReport()">Test: Generate Report</button>
  `;
}

// ============================================================
// Event Handlers
// ============================================================

function handleDocumentLoad() {
    appState.loadedCount++;
    console.log(`[App] Document loaded (${appState.loadedCount}/2)`);

    if (appState.loadedCount === 2 && appState.viewer1 && appState.viewer2) {
        appState.viewersLoaded = true;
        console.log('[App] Both viewers loaded - synchronization enabled');
        syncViewers(appState.viewer1, appState.viewer2, appState.synchronizationEnabled);
    }
}

function handleToggleSync() {
    const newSyncState = !appState.synchronizationEnabled;
    appState.synchronizationEnabled = newSyncState;

    const btnText = document.getElementById('syncBtnText');
    btnText.textContent = newSyncState ? 'Disable Sync' : 'Enable Sync';

    if (appState.viewer1 && appState.viewer2) {
        syncViewers(appState.viewer1, appState.viewer2, newSyncState);
        console.log(`[App] Synchronization ${newSyncState ? 'enabled' : 'disabled'}`);
    }
}

function handleToggleHighlights() {
    const newHighlightsState = !appState.highlightsEnabled;
    appState.highlightsEnabled = newHighlightsState;

    const btnText = document.getElementById('highlightBtnText');
    btnText.textContent = newHighlightsState ? 'Disable Highlights' : 'Enable Highlights';

    // Re-apply comparison with updated highlight state
    if (appState.viewersLoaded && appState.viewer1 && appState.viewer2) {
        handleCompare();
    }
}

function handleClearAnnotations() {
    try {
        if (appState.viewer1 && appState.viewer2) {
            console.log('[App] Clearing annotations');

            // Remove semantic text compare annotations
            if (typeof appState.viewer1.removeSemanticTextCompare === 'function') {
                appState.viewer1.removeSemanticTextCompare(appState.viewer2);
            }

            appState.comparisonResult = null;
            console.log('[App] Annotations cleared');
        }
    } catch (error) {
        console.error('[App] Error clearing annotations:', error);
    }
}

// ============================================================
// Synchronization
// ============================================================

function syncViewers(viewer1, viewer2, enabled) {
    try {
        if (enabled && typeof viewer1.syncViewers === 'function') {
            viewer1.syncViewers(viewer2, true);
            console.log('[App] Viewers synchronized');
        } else if (!enabled && typeof viewer1.syncViewers === 'function') {
            viewer1.syncViewers(viewer2, false);
            console.log('[App] Viewers desynchronized');
        }
    } catch (error) {
        console.error('[App] Error syncing viewers:', error);
    }
}

// ============================================================
// Semantic Text Comparison Methods
// ============================================================

/**
 * Performs semantic text comparison between two PDF documents
 */
async function handleCompare() {
    try {
        if (!appState.viewersLoaded || !appState.viewer1 || !appState.viewer2) {
            console.warn('[App] Viewers not ready for comparison');
            return;
        }

        console.log('[App] Starting semantic text comparison...');

        const options = {
            beforeColor: '#FF0000',      // Red for original
            afterColor: '#00FF00',       // Green for modified
            beforeColorOpacity: 0.4,
            afterColorOpacity: 0.4,
            enableHighlights: appState.highlightsEnabled
        };

        if (typeof appState.viewer1.semanticTextCompare !== 'function') {
            console.error('[App] semanticTextCompare method not available');
            return;
        }

        const result = await appState.viewer1.semanticTextCompare(appState.viewer2, options);
        appState.comparisonResult = result;

        console.log('[App] Full Comparison Result:', result);

        // Parse the result structure
        const originalAnnotations = result?.originalDocumentAnnotations || [];
        const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
        const totalTextDiffCount = result?.totalTextDiffCount || 0;

        console.log('[App] Total Text Differences:', totalTextDiffCount);
        console.log('[App] Original Document Pages:', originalAnnotations.length);
        console.log('[App] Modified Document Pages:', modifiedAnnotations.length);

        // Extract and categorize all differences
        let addedCount = 0;
        let deletedCount = 0;
        let modifiedCount = 0;

        // Process original document annotations (deletions and modifications)
        originalAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            console.log(`\n[Original] Page ${pageNum}:`);
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                const type = diff.textDiffType;
                const text = diff.textDiffData;
                if (type === 'deleted') deletedCount++;
                if (type === 'modified') modifiedCount++;
                if (type === 'added') addedCount++;
                console.log(`  - ${type.toUpperCase()}: "${text?.substring(0, 50)}..."`);
            });
        });

        // Process modified document annotations
        modifiedAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            console.log(`\n[Modified] Page ${pageNum}:`);
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                const type = diff.textDiffType;
                const text = diff.textDiffData;
                console.log(`  - ${type.toUpperCase()}: "${text?.substring(0, 50)}..."`);
            });
        });

        // Display summary
        console.log('\n=== COMPARISON SUMMARY ===');
        console.log(`Total Differences: ${totalTextDiffCount}`);
        console.log(`Deleted: ${deletedCount}`);
        console.log(`Added: ${addedCount}`);
        console.log(`Modified: ${modifiedCount}`);

    } catch (error) {
        console.error('[App] Error during comparison:', error);
    }
}

/**
 * Filters and retrieves differences by type (Added, Deleted, Modified)
 */
async function getDifferencesByType(type) {
    try {
        if (!appState.viewer1 || !appState.viewer2) {
            console.warn('[App] Viewers not ready');
            return [];
        }

        console.log(`[App] Getting ${type} differences...`);

        const options = {
            beforeColor: '#FF0000',
            afterColor: '#00FF00',
            beforeColorOpacity: 0.4,
            afterColorOpacity: 0.4,
            enableHighlights: true
        };

        if (typeof appState.viewer1.semanticTextCompare !== 'function') {
            console.error('[App] semanticTextCompare method not available');
            return [];
        }

        const result = await appState.viewer1.semanticTextCompare(appState.viewer2, options);
        appState.comparisonResult = result;

        const originalAnnotations = result?.originalDocumentAnnotations || [];
        const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
        const differences = [];

        // Extract differences by type from original annotations
        originalAnnotations.forEach((pageAnnotations) => {
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                if (diff.textDiffType === type.toLowerCase()) {
                    differences.push({
                        pageNumber: pageAnnotations.pageNumber,
                        type: diff.textDiffType,
                        text: diff.textDiffData,
                        bounds: diff.annotation?.bounds,
                        color: diff.annotation?.color
                    });
                }
            });
        });

        // Extract differences by type from modified annotations
        modifiedAnnotations.forEach((pageAnnotations) => {
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                if (diff.textDiffType === type.toLowerCase()) {
                    // Avoid duplicates
                    const exists = differences.find(d =>
                        d.pageNumber === pageAnnotations.pageNumber &&
                        d.text === diff.textDiffData
                    );
                    if (!exists) {
                        differences.push({
                            pageNumber: pageAnnotations.pageNumber,
                            type: diff.textDiffType,
                            text: diff.textDiffData,
                            bounds: diff.annotation?.bounds,
                            color: diff.annotation?.color
                        });
                    }
                }
            });
        });

        console.log(`[App] ${type} differences (${differences.length}):`, differences);
        return differences;

    } catch (error) {
        console.error('[App] Error filtering differences:', error);
        return [];
    }
}

/**
 * Groups all differences by page number
 */
async function groupDifferencesByPage() {
    try {
        if (!appState.viewer1 || !appState.viewer2) {
            console.warn('[App] Viewers not ready');
            return {};
        }

        console.log('[App] Grouping differences by page...');

        const options = {
            beforeColor: '#FF0000',
            afterColor: '#00FF00',
            beforeColorOpacity: 0.4,
            afterColorOpacity: 0.4,
            enableHighlights: true
        };

        if (typeof appState.viewer1.semanticTextCompare !== 'function') {
            console.error('[App] semanticTextCompare method not available');
            return {};
        }

        const result = await appState.viewer1.semanticTextCompare(appState.viewer2, options);
        appState.comparisonResult = result;

        const originalAnnotations = result?.originalDocumentAnnotations || [];
        const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
        const grouped = {};

        // Group original document differences by page
        originalAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            if (!grouped[pageNum]) {
                grouped[pageNum] = { original: [], modified: [] };
            }
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                grouped[pageNum].original.push({
                    type: diff.textDiffType,
                    text: diff.textDiffData,
                    bounds: diff.annotation?.bounds,
                    color: diff.annotation?.color
                });
            });
        });

        // Group modified document differences by page
        modifiedAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            if (!grouped[pageNum]) {
                grouped[pageNum] = { original: [], modified: [] };
            }
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                grouped[pageNum].modified.push({
                    type: diff.textDiffType,
                    text: diff.textDiffData,
                    bounds: diff.annotation?.bounds,
                    color: diff.annotation?.color
                });
            });
        });

        console.log('[App] Differences grouped by page:', grouped);
        return grouped;

    } catch (error) {
        console.error('[App] Error grouping differences:', error);
        return {};
    }
}

/**
 * Generates a detailed comparison report
 */
async function generateReport() {
    try {
        if (!appState.viewer1 || !appState.viewer2) {
            console.warn('[App] Viewers not ready');
            return;
        }

        console.log('[App] Generating detailed comparison report...');

        const options = {
            beforeColor: '#FF0000',
            afterColor: '#00FF00',
            beforeColorOpacity: 0.4,
            afterColorOpacity: 0.4,
            enableHighlights: true
        };

        if (typeof appState.viewer1.semanticTextCompare !== 'function') {
            console.error('[App] semanticTextCompare method not available');
            return;
        }

        const result = await appState.viewer1.semanticTextCompare(appState.viewer2, options);
        appState.comparisonResult = result;

        const originalAnnotations = result?.originalDocumentAnnotations || [];
        const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
        const totalTextDiffCount = result?.totalTextDiffCount || 0;

        let addedCount = 0;
        let deletedCount = 0;
        let modifiedCount = 0;
        const byPage = {};

        // Process original annotations
        originalAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            if (!byPage[pageNum]) {
                byPage[pageNum] = { deleted: 0, added: 0, modified: 0, details: [] };
            }
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                const type = diff.textDiffType;
                if (type === 'deleted') {
                    deletedCount++;
                    byPage[pageNum].deleted++;
                } else if (type === 'added') {
                    addedCount++;
                    byPage[pageNum].added++;
                } else if (type === 'modified') {
                    modifiedCount++;
                    byPage[pageNum].modified++;
                }
                byPage[pageNum].details.push({
                    type,
                    text: diff.textDiffData?.substring(0, 100),
                    color: diff.annotation?.color
                });
            });
        });

        // Process modified annotations
        modifiedAnnotations.forEach((pageAnnotations) => {
            const pageNum = pageAnnotations.pageNumber;
            if (!byPage[pageNum]) {
                byPage[pageNum] = { deleted: 0, added: 0, modified: 0, details: [] };
            }
            pageAnnotations.differenceAnnotations?.forEach((diff) => {
                const type = diff.textDiffType;
                if (type === 'deleted') {
                    deletedCount++;
                    byPage[pageNum].deleted++;
                } else if (type === 'added') {
                    addedCount++;
                    byPage[pageNum].added++;
                } else if (type === 'modified') {
                    modifiedCount++;
                    byPage[pageNum].modified++;
                }
                byPage[pageNum].details.push({
                    type,
                    text: diff.textDiffData?.substring(0, 100),
                    color: diff.annotation?.color
                });
            });
        });

        const report = {
            totalDifferences: totalTextDiffCount,
            summary: {
                added: addedCount,
                deleted: deletedCount,
                modified: modifiedCount
            },
            byPage: byPage,
            timestamp: new Date().toISOString()
        };

        console.log('=== DETAILED COMPARISON REPORT ===');
        console.log(`Total Text Differences: ${report.totalDifferences}`);
        console.log(`Added: ${report.summary.added}`);
        console.log(`Deleted: ${report.summary.deleted}`);
        console.log(`Modified: ${report.summary.modified}`);
        console.log('\nBreakdown by Page:');
        Object.entries(byPage).forEach(([pageNum, data]) => {
            console.log(`  Page ${pageNum}: +${data.added} -${data.deleted} ~${data.modified}`);
        });
        console.log('\nFull Report:', report);

        return report;

    } catch (error) {
        console.error('[App] Error generating report:', error);
    }
}

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('[App] Initializing Semantic Text Comparison...');

    // Create control panel
    createControlPanel();

    // Initialize PDF Viewer 1 (Original Document)
    appState.viewer1 = new ej.pdfviewer.PdfViewer({
        documentPath: 'https://cdn.syncfusion.com/content/pdf/original-document.pdf',
        resourceUrl: 'https://cdn.syncfusion.com/ej2/34.2.4/dist/ej2-pdfviewer-lib',
        documentLoad: handleDocumentLoad
    });

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

    appState.viewer1.appendTo('#pdfViewer1');
    console.log('[App] Viewer 1 initialized');

    // Initialize PDF Viewer 2 (Modified Document)
    appState.viewer2 = new ej.pdfviewer.PdfViewer({
        documentPath: 'https://cdn.syncfusion.com/content/pdf/modified-document.pdf',
        resourceUrl: 'https://cdn.syncfusion.com/ej2/34.2.4/dist/ej2-pdfviewer-lib',
        documentLoad: handleDocumentLoad
    });

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

    appState.viewer2.appendTo('#pdfViewer2');
    console.log('[App] Viewer 2 initialized');

    console.log('[App] Initialization complete - Waiting for both viewers to load...');
});