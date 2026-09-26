/**
 * PdfViewerAdapter - Implements ICollaborationProvider for Syncfusion PDF Viewer
 * 
 * This adapter acts as a bridge between the PDF Viewer and the CollaborationClient.
 * It manages:
 * - Document loading and state initialization
 * - Collaborative editing operations
 * - Server communication for real-time synchronization
 */

class PdfViewerAdapter {
    /**
     * Constructor
     * @param {Object} viewer - The PdfViewer instance
     * @param {string} serviceUrl - The base URL for collaboration service
     * @param {string} currentUser - The current user name
     */
    constructor(viewer, serviceUrl, currentUser) {
        this.viewer = viewer;
        this.serviceUrl = serviceUrl;
        this.currentUser = currentUser;
        this.fileName = '';
        this.currentRoomName = '';
        this.isDocumentLoaded = false;
        this.pendingOperations = [];

        // Initialize the collaborative editing handler
        this.collaborativeEditingHandler = new ej.pdfviewer.CollaborativeEditingHandler(
            viewer,
            currentUser
        );

        console.log('[PdfViewerAdapter] Initialized for user:', currentUser);
    }

    /**
     * Extracts or generates room ID from URL query parameters.
     * Ensures a unique room ID is set for the collaboration session.
     * Updates the browser URL history with the generated room ID.
     * 
     * @returns {string} Room identifier
     */
    getRoomName() {
        // Check for browser environment
        if (typeof window !== 'undefined') {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let roomId = urlParams.get('id');

            if (!roomId) {
                roomId = Math.random().toString(32).slice(2);
                window.history.replaceState({}, '', `?id=${roomId}`);
            }

            return roomId;
        }

        // Server-side environment or fallback
        return Math.random().toString(32).slice(2);
    }

    /**
     * Fetches the document from the product's REST API and joins a collaboration room.
     * Returns the room name to be used by collaboration client.
     * 
     * Flow:
     * 1. Generate or extract room name from URL
     * 2. POST to ImportFile endpoint with roomName
     * 3. Server returns all pending operations for state reconstruction
     * 4. Initialize collaboration context with room info and version
     * 5. Apply initial state snapshots (annotations, form fields, etc.)
     * 
     * @param {string} fileName - Optional file name to load
     * @returns {Promise<string>} The room name
     */
    async loadFromServer(fileName) {
        this.isDocumentLoaded = false;
        this.fileName = fileName || 'document.pdf';

        const roomName = this.getRoomName();
        this.currentRoomName = roomName;

        try {
            console.log('[PdfViewerAdapter] Loading from server - Room:', roomName);

            const response = await fetch(
                `${this.serviceUrl}api/CollaborativeEditing/ImportFile`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        roomName: roomName,
                        fileName: this.fileName,
                        currentUser: this.currentUser
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to join collaboration room: ${response.statusText}`
                );
            }

            const responseText = await response.text();
            await this.open(responseText, roomName);

            return roomName;
        } catch (error) {
            console.error('[PdfViewerAdapter] Error loading from server:', error);
            throw error;
        }
    }

    /**
     * Initializes collaboration context and applies initial document state.
     * 
     * Process:
     * 1. Parse server response containing version and pending operations
     * 2. Update handler with room info and version tracking
     * 3. Apply initial state snapshots (annotations, form fields, page organizer)
     * 4. Mark document as loaded for subsequent operations
     * 
     * @param {string} responseText - JSON response text from ImportFile endpoint
     * @param {string} roomName - Current collaboration room name
     */
    async open(responseText, roomName) {
        try {
            const data = JSON.parse(responseText);

            // Extract version for document state
            const version = data.version || data.currentVersion || 0;

            console.log('[PdfViewerAdapter] Opening document - Version:', version, '- Operations count:', data.operations ? data.operations.length : 0);

            // Update collaboration handler with room info and version tracking
            this.collaborativeEditingHandler.updateRoomInfo(
                roomName,
                version,
                `${this.serviceUrl}api/CollaborativeEditing/`
            );

            // Apply initial state: annotations, form fields, page organizer snapshots
            // These are stored as snapshots, not incremental operations
            this.pendingOperations = data.operations || [];
            if (data.operations && data.operations.length > 0) {
                console.log('[PdfViewerAdapter] Applying', data.operations.length, 'pending operations');
                for (const op of data.operations) {
                    try {
                        this.collaborativeEditingHandler.applyRemoteAction(op.type, op);
                    } catch (opError) {
                        console.warn('[PdfViewerAdapter] Error applying operation:', op, opError);
                    }
                }
            }

            this.isDocumentLoaded = true;
            console.log('[PdfViewerAdapter] Document initialization complete');
        } catch (error) {
            console.error('[PdfViewerAdapter] Error initializing document:', error);
            throw error;
        }
    }

    /**
     * Sends local changes to the collaboration service via UpdateAction endpoint.
     * 
     * Flow:
     * 1. Validate operations array
     * 2. Delegate to handler for routing by operation type
     * 3. Handler increments version and sends to UpdateAction endpoint
     * 4. Server broadcasts operation to other clients (except sender)
     * 
     * @param {Array} operations - Array of operations/changes from the local user
     */
    async sendActionToServer(operations) {
        try {
            if (!operations || operations.length === 0) {
                console.warn('[PdfViewerAdapter] No operations to send');
                return;
            }

            console.log('[PdfViewerAdapter] Sending', operations.length, 'operations to server');

            // Delegate to handler which manages routing and UpdateAction API calls
            await this.collaborativeEditingHandler.sendActionToServer(operations);
        } catch (error) {
            console.error('[PdfViewerAdapter] Error sending operations:', error);
            throw error;
        }
    }

    /**
     * Applies remote changes received from other collaborators.
     * Handles user profile images and delegates logic to the collaborative editing handler.
     * 
     * @param {string} action - Type of action being applied (e.g., 'annotationUpdate', 'formFieldUpdate', 'addUser', 'removeUser')
     * @param {Object} data - Object containing action data with ICollaborationActionData interface
     */
    applyRemoteAction(action, data) {
        try {
            if (action === 'addUser') {
                // Handle multiple users
                if (data && data.payload && Array.isArray(data.payload) && data.payload.length > 0) {
                    data.payload.forEach((user) => {
                        this._assignUserImage(user);
                    });
                }
                // Handle single user
                else if (data && data.payload) {
                    this._assignUserImage(data.payload);
                }
            }
            else if (action === 'connectionId') {
                // Handle connection ID - assign image to current user
                const image = this._getUserImage(this.currentUser);
                if (data && typeof data.payload !== 'undefined') {
                    data.payload = { payload: data.payload, image: image };
                }
            }

            // Delegate to handler for actual action application
            if (this.collaborativeEditingHandler && this.collaborativeEditingHandler.applyRemoteAction) {
                const payloadToApply = (data && data.payload) ? data.payload : data;
                this.collaborativeEditingHandler.applyRemoteAction(action, payloadToApply);
            }
        } catch (error) {
            console.error('[PdfViewerAdapter] Error applying remote action:', error);
        }
    }

    /**
     * Helper: Assign user image based on username
     * @private
     * @param {Object} user - User object to assign image to
     */
    _assignUserImage(user) {
        if (user && user.currentUser) {
            user.image = this._getUserImage(user.currentUser);
        }
    }

    /**
     * Helper: Get avatar image URL for a user
     * @private
     * @param {string} userName - The username
     * @returns {string} Avatar image URL
     */
    _getUserImage(userName) {
        const avatarMap = {
            'RIO': 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
            'JOHN': 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png',
            'MAXY': 'https://ej2.syncfusion.com/demos/src/avatar/images/pic02.png',
            'SHAI': 'https://ej2.syncfusion.com/demos/src/avatar/images/pic04.png',
            'SRI': 'https://ej2.syncfusion.com/demos/src/avatar/images/pic05.png'
        };
        return avatarMap[userName] || 'https://ej2.syncfusion.com/demos/src/avatar/images/default.png';
    }

    /**
     * Updates pending operations by applying them to the document.
     * This is used to sync initial state from server.
     */
    updatePendingOperations() {
        try {
            // Apply initial state: annotations, form fields, page organizer snapshots
            // These are stored as snapshots, not incremental operations
            if (this.pendingOperations && this.pendingOperations.length > 0) {
                console.log('[PdfViewerAdapter] Updating', this.pendingOperations.length, 'pending operations');
                for (const op of this.pendingOperations) {
                    try {
                        this.collaborativeEditingHandler.applyRemoteAction(op.type, op);
                    } catch (opError) {
                        console.warn('[PdfViewerAdapter] Error applying pending operation:', op, opError);
                    }
                }
            }
        } catch (error) {
            console.error('[PdfViewerAdapter] Error updating pending operations:', error);
        }
    }

    /**
     * Gets the current document state
     * Used for snapshots and sync operations
     * 
     * @returns {Object} Current document state
     */
    getDocumentState() {
        try {
            return {
                currentUser: this.currentUser,
                roomName: this.currentRoomName,
                isDocumentLoaded: this.isDocumentLoaded,
                fileName: this.fileName
            };
        } catch (error) {
            console.error('[PdfViewerAdapter] Error getting document state:', error);
            return null;
        }
    }

    /**
     * Cleans up resources
     */
    dispose() {
        try {
            console.log('[PdfViewerAdapter] Disposing resources');
            if (this.collaborativeEditingHandler) {
                this.collaborativeEditingHandler = null;
            }
            this.viewer = null;
            this.pendingOperations = [];
        } catch (error) {
            console.error('[PdfViewerAdapter] Error disposing:', error);
        }
    }
}
