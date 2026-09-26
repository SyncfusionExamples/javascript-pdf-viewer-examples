// ============================================================
// Collaboration Configuration
// ============================================================

const userList = ['RIO', 'JOHN', 'MAXY', 'SHAI', 'SRI'];
const currentUserName = userList[Math.floor(Math.random() * userList.length)];
const SERVICE_URL = 'http://localhost:8081/';

// ============================================================
// State Management
// ============================================================

let appState = {
    isDocumentLoaded: false,
    collaborationStatus: 'initializing', // initializing | loading | connected | error
    currentUser: currentUserName,
    connectedUsers: [currentUserName],
    roomName: '',
    pdfViewer: null,
    adapter: null,
    client: null,
    roomNameRef: ''
};

// ============================================================
// Helper Functions - PDF Fetch and Load
// ============================================================

/**
 * Loads a PDF blob into the viewer
 */
async function loadPDFBlobIntoViewer(pdfBlob) {
    try {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const arrayBuffer = reader.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Load using viewer.load() with Uint8Array
                    if (appState.pdfViewer && typeof appState.pdfViewer.load === 'function') {
                        appState.pdfViewer.load(uint8Array, '');
                        console.log('[App] Loaded PDF using viewer.load(Uint8Array)');
                        resolve();
                        return;
                    }

                    // Fallback: Try loading via data URL
                    const dataReader = new FileReader();
                    dataReader.onload = () => {
                        try {
                            const dataUrl = dataReader.result;

                            if (appState.pdfViewer && typeof appState.pdfViewer.load === 'function') {
                                appState.pdfViewer.load(dataUrl, '');
                                console.log('[App] Loaded PDF using viewer.load(dataUrl)');
                                resolve();
                            } else {
                                console.error('[App] Viewer does not support load method');
                                reject(new Error('Viewer load method not available'));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    };

                    dataReader.onerror = () => {
                        reject(new Error('Failed to read blob as data URL'));
                    };

                    dataReader.readAsDataURL(pdfBlob);

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read blob as array buffer'));
            };

            reader.readAsArrayBuffer(pdfBlob);
        });

    } catch (error) {
        console.error('[App] Error loading PDF blob:', error);
        throw error;
    }
}

/**
 * Fetches the current collaborative document from the server and loads it into the viewer
 */
async function fetchAndLoadPDFDocument() {
    try {
        console.log(`[App] Fetching PDF from room: ${appState.roomNameRef}`);

        const queryParams = new URLSearchParams({
            roomName: appState.roomNameRef || 'default'
        });

        const response = await fetch(
            `${SERVICE_URL}api/CollaborativeEditing/GetPDFDocument?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(`Server error: ${result.error}`);
        }

        console.log(`[App] PDF retrieved successfully - Size: ${result.contentLength} bytes`);

        // Decode Base64 content to binary string
        const binaryString = atob(result.content);

        // Convert binary string to Uint8Array
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Create Blob from Uint8Array
        const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
        console.log(`[App] Converted to Blob - Size: ${pdfBlob.size} bytes`);

        // Load the PDF into the viewer
        await loadPDFBlobIntoViewer(pdfBlob);
        console.log('[App] PDF loaded into viewer');

    } catch (error) {
        console.error('[App] Error fetching PDF document:', error);
        throw error;
    }
}

// ============================================================
// UI Update Functions
// ============================================================

/**
 * Updates the status bar with current collaboration status
 */
function updateStatusBar() {
    const statusBar = document.getElementById('collaborationStatusBar');
    if (statusBar) {
        const statusColor =
            appState.collaborationStatus === 'connected' ? '#28a745' :
                appState.collaborationStatus === 'error' ? '#dc3545' : '#ffc107';

        statusBar.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div>
          <strong>User:</strong> ${appState.currentUser} |
          <strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${appState.collaborationStatus}</span> |
          <strong>Room:</strong> ${appState.roomName || 'N/A'}
        </div>
        <div>
          <strong>Connected Users:</strong> ${appState.connectedUsers.join(', ') || 'None'}
        </div>
      </div>
    `;
    }
}

// ============================================================
// Event Handlers - Collaboration Lifecycle
// ============================================================

/**
 * Handler for viewer.resourcesLoaded event
 * 
 * This event fires when the PdfViewer has initialized all resources.
 * We use it to:
 * 1. Initialize the collaboration adapter and client
 * 2. Load the document from the collaboration service
 * 3. Join the collaboration room
 * 4. Fetch and load the current PDF state
 */
async function handleResourcesLoaded() {
    console.log('[App] Viewer resourcesLoaded event triggered');

    if (!appState.isDocumentLoaded) {
        try {
            console.log(`[App] Initializing collaboration - User: ${appState.currentUser}, Service: ${SERVICE_URL}`);

            appState.collaborationStatus = 'loading';
            updateStatusBar();
            appState.isDocumentLoaded = true;

            // Initialize collaboration asynchronously
            (async () => {
                try {
                    // Step 1: Initialize PdfViewerAdapter
                    const adapter = new PdfViewerAdapter(appState.pdfViewer, SERVICE_URL, appState.currentUser);
                    appState.adapter = adapter;
                    console.log('[App] PdfViewerAdapter initialized');

                    // Step 2: Create and configure CollaborationClient
                    const client = new ej.collaborator.CollaborationClient(adapter, {
                        serviceUrl: SERVICE_URL,
                        connectionType: 'websocket',
                        currentUser: appState.currentUser,
                        onRemoteAction: (action, data) => {
                            console.log('[App] Applying remote action:', action);
                            if (adapter && typeof adapter.applyRemoteAction === 'function') {
                                adapter.applyRemoteAction(action, data);
                            }
                        },
                        onUserJoined: (user) => {
                            console.log('[App] User joined collaboration:', user);
                            const userName = user.userName || user.currentUser;
                            if (!appState.connectedUsers.includes(userName)) {
                                appState.connectedUsers.push(userName);
                                updateStatusBar();
                            }
                        },
                        onUserLeft: (user) => {
                            console.log('[App] User left collaboration:', user);
                            const userName = user.userName || user.currentUser;
                            appState.connectedUsers = appState.connectedUsers.filter(u => u !== userName);
                            updateStatusBar();
                        }
                    });
                    appState.client = client;

                    console.log('[App] CollaborationClient initialized');

                    // Step 3: Load from server (gets room name and pending operations)
                    const roomName = await adapter.loadFromServer();
                    appState.roomNameRef = roomName;
                    appState.roomName = roomName;
                    updateStatusBar();
                    console.log(`[App] Loaded from server - Room: ${roomName}`);

                    // Step 4: Join the collaboration room with the client
                    await client.joinRoomAsync(roomName);
                    console.log(`[App] Joined collaboration room: ${roomName}`);

                    // Step 5: Fetch and load the current PDF document state
                    await fetchAndLoadPDFDocument();
                    console.log('[App] PDF document loaded successfully');

                    appState.collaborationStatus = 'connected';
                    updateStatusBar();

                } catch (error) {
                    console.error('[App] Error during collaboration initialization:', error);
                    appState.collaborationStatus = 'error';
                    updateStatusBar();
                    // Fallback: Load default document
                    console.log('[App] Falling back to default document');
                }
            })();

        } catch (error) {
            console.error('[App] Error initializing collaboration:', error);
            appState.collaborationStatus = 'error';
            updateStatusBar();
        }
    }
}

/**
 * Handler for viewer.documentChanged event
 * 
 * This event fires when the user makes changes to:
 * - Annotations (add, modify, delete)
 * - Form fields (add, modify, delete)
 * - Page organizer (reorder, insert, delete pages)
 * 
 * We package these changes as operations and send them to the server
 * for broadcast to other collaborators.
 */
function handleDocumentChanged(args) {
    try {
        // Handle AnnotationChangedEventArgs
        if (args && 'annotationId' in args) {
            console.log('[App] Annotation changed:', args.annotationId);

            let operations = [];
            if (args.action) {
                operations = [{
                    action: args.action,
                    annotation: args.annotationId,
                    type: 'annotation',
                    isRedacted: args.isRedacted
                }];
            } else {
                operations = [{
                    type: 'removeUser',
                    currentUser: appState.currentUser
                }];
            }

            console.log('[App] Annotation operation:', operations);
            if (appState.adapter && appState.adapter.sendActionToServer) {
                appState.adapter.sendActionToServer(operations).catch(err =>
                    console.error('[App] Error sending annotation operation:', err)
                );
            }
        }
        // Handle FormFieldChangedEventArgs
        else if (args && 'formField' in args && !('fieldName' in args)) {
            console.log('[App] Form field changed:', args.formField);

            const operations = [{
                action: args.action,
                formField: args.formField,
                type: 'formField'
            }];

            console.log('[App] Form field operation:', operations);
            if (appState.adapter && appState.adapter.sendActionToServer) {
                appState.adapter.sendActionToServer(operations).catch(err =>
                    console.error('[App] Error sending form field operation:', err)
                );
            }
        }
        // Handle FormFieldFocusOutEventArgs (form field value updates)
        else if (args && 'fieldName' in args) {
            console.log('[App] Form field updated:', args.fieldName);

            const operations = [{
                action: 'formFieldUpdate',
                data: args,
                type: 'formField'
            }];

            console.log('[App] Form field update operation:', operations);
            if (appState.adapter && appState.adapter.sendActionToServer) {
                appState.adapter.sendActionToServer(operations).catch(err =>
                    console.error('[App] Error sending form field update:', err)
                );
            }
        }
        // Handle PageOrganizerSavedEventArgs
        else if (args && 'organizePageActions' in args) {
            console.log('[App] Page organizer changed');

            const eventData = args;
            const actionDetails = args.organizePageActions && typeof args.organizePageActions === 'string'
                ? JSON.parse(args.organizePageActions)
                : "";

            let operations = [];

            if (eventData && eventData.savedDocument === null && actionDetails.action && actionDetails.action === 'applyCancelled') {
                // User cancelled the page organizer operation
                operations = [{
                    type: 'removeUser',
                    currentUser: appState.currentUser
                }];
                console.log('[App] Page organizer operation cancelled');
            }
            else if (eventData && eventData.savedDocument !== null && actionDetails.length > 0 && actionDetails[0].action !== 'applyCancelled') {
                // Page organizer operation applied successfully
                operations = [{
                    action: 'pageOrganizerUpdate',
                    data: args.organizePageActions,
                    type: 'pageOrganizer'
                }];
                console.log('[App] Page organizer operation:', operations);
            } else {
                console.log('[App] No valid page organizer operation to send');
                return;
            }

            if (appState.adapter && appState.adapter.sendActionToServer) {
                appState.adapter.sendActionToServer(operations).catch(err =>
                    console.error('[App] Error sending page organizer operation:', err)
                );
            }
        }

    } catch (error) {
        console.error('[App] Error processing document change:', error);
    }
}

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // Create collaboration status bar
    const containerDiv = document.getElementById('container');
    if (containerDiv) {
        // Create status bar
        const statusBar = document.createElement('div');
        statusBar.id = 'collaborationStatusBar';
        statusBar.style.cssText = `
      padding: 10px 15px;
      background-color: #f0f0f0;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
    `;
        containerDiv.insertBefore(statusBar, containerDiv.firstChild);

        // Create PDF Viewer container
        const pdfViewerDiv = document.createElement('div');
        pdfViewerDiv.id = 'PdfViewer';
        pdfViewerDiv.style.cssText = 'height: calc(100% - 51px); width: 100%;';
        containerDiv.appendChild(pdfViewerDiv);
    }

    // Initialize PDF Viewer
    appState.pdfViewer = new ej.pdfviewer.PdfViewer({
        enableCollaborativeEditing: true,
        resourceUrl: 'https://cdn.syncfusion.com/ej2/34.1.29/dist/ej2-pdfviewer-lib',
        resourcesLoaded: handleResourcesLoaded,
        documentChanged: handleDocumentChanged
    });

    // Inject required services
    ej.pdfviewer.PdfViewer.Inject(
        ej.pdfviewer.TextSelection,
        ej.pdfviewer.TextSearch,
        ej.pdfviewer.Print,
        ej.pdfviewer.Navigation,
        ej.pdfviewer.Toolbar,
        ej.pdfviewer.Magnification,
        ej.pdfviewer.Annotation,
        ej.pdfviewer.FormDesigner,
        ej.pdfviewer.FormFields,
        ej.pdfviewer.LinkAnnotation,
        ej.pdfviewer.BookmarkView,
        ej.pdfviewer.ThumbnailView,
        ej.pdfviewer.PageOrganizer
    );

    // Append to DOM
    appState.pdfViewer.appendTo('#PdfViewer');

    // Update status bar
    updateStatusBar();

    // Cleanup on page unload
    window.addEventListener('beforeunload', function () {
        console.log('[App] Cleaning up collaboration resources');
        if (appState.client) {
            // Disconnect gracefully if needed
        }
    });
});