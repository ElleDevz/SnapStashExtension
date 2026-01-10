// ============================================================================
// SNAPSTASH CHROME EXTENSION - POPUP SCRIPT
// ============================================================================
// This script handles the main functionality of the SnapStash extension popup:
// - Displaying current tab URL and title preview
// - Saving items with category selection to persistent storage
// - Displaying saved shopping list items
// - Deleting individual items
// - Clearing all items
// - Undoing recent actions (add, delete, clear all)
// ============================================================================

// ============================================================================
// DOM ELEMENTS
// ============================================================================
// Get references to all UI elements that we'll interact with
const categorySelect = document.getElementById('category');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const shoppingList = document.getElementById('shoppingList');
const currentUrlDiv = document.getElementById('currentUrl');
const previewText = document.getElementById('previewText');
const previewSection = document.getElementById('previewSection');

// ============================================================================
// STORAGE KEYS
// ============================================================================
// Constants for accessing Chrome storage
const STORAGE_KEY = 'snapstashItems';        // Key for storing shopping list items
const HISTORY_KEY = 'snapstashHistory';      // Key for storing undo history
const MAX_PREVIEW_LENGTH = 50;               // Maximum characters for item name preview

// ============================================================================
// INITIALIZATION
// ============================================================================
// Set up the extension when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    // Display the URL and title of the current tab
    displayCurrentUrl();
    displayItemPreview();
    
    // Load all previously saved items from storage and display them
    loadAndDisplayItems();
    
    // Enable/disable undo button based on history state
    updateUndoButtonState();
    
    // Attach click handlers to buttons
    saveBtn.addEventListener('click', saveItem);
    clearBtn.addEventListener('click', clearAllItems);
    undoBtn.addEventListener('click', undoAction);
    
    // Update preview when category changes
    categorySelect.addEventListener('change', displayItemPreview);
});

// ============================================================================
// DISPLAY CURRENT TAB URL
// ============================================================================
// Gets the URL of the currently active tab and displays it to the user
// This lets the user know which page they're about to save from
function displayCurrentUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const url = tabs[0].url;
            currentUrlDiv.textContent = `Current URL: ${url}`;
        }
    });
}

// ============================================================================
// DISPLAY ITEM PREVIEW
// ============================================================================
// Shows a preview of the item name (page title) that will be saved
// Truncates the title to MAX_PREVIEW_LENGTH characters for readability
// This helps users confirm they're saving the correct item before selection
function displayItemPreview() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            let itemName = tabs[0].title || 'Untitled Page';
            
            // Truncate to 50 characters if needed
            if (itemName.length > MAX_PREVIEW_LENGTH) {
                itemName = itemName.substring(0, MAX_PREVIEW_LENGTH) + '...';
            }
            
            previewText.textContent = itemName;
        }
    });
}

// ============================================================================
// SAVE ITEM TO STORAGE
// ============================================================================
// Saves the current page URL with the selected category to persistent storage
// Creates a new item object with:
//   - Unique ID based on timestamp (ensures each item can be individually deleted)
//   - Category selected by user
//   - URL of the current tab (where the save was triggered from)
//   - Item name extracted from the page's title element
//   - Timestamp of when the item was saved
// 
// Also records this action in the history for the undo feature
function saveItem() {
    const category = categorySelect.value;
    
    // Validate that a category was selected
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    // Query the current active tab to get its URL and title
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const url = tabs[0].url;
            let itemName = tabs[0].title || 'Untitled Page';
            
            // Truncate item name to 50 characters for consistency with preview
            if (itemName.length > MAX_PREVIEW_LENGTH) {
                itemName = itemName.substring(0, MAX_PREVIEW_LENGTH);
            }
            
            // Retrieve existing items and history from storage
            chrome.storage.local.get([STORAGE_KEY, HISTORY_KEY], (result) => {
                let items = result[STORAGE_KEY] || [];
                let history = result[HISTORY_KEY] || [];
                
                // Create a new item object to save
                const newItem = {
                    id: Date.now(), // Unique ID based on current timestamp
                    category: category,
                    url: url,
                    title: itemName, // Page title (max 50 chars)
                    savedAt: new Date().toLocaleString()
                };
                
                // Record this action in history for undo functionality
                history.push({
                    action: 'add',
                    item: newItem,
                    previousState: JSON.parse(JSON.stringify(items)), // Deep copy of items before adding
                    timestamp: Date.now()
                });
                
                // Add the new item to the list
                items.push(newItem);
                
                // Save both items and history to Chrome storage (persists across browser restarts)
                chrome.storage.local.set({ 
                    [STORAGE_KEY]: items,
                    [HISTORY_KEY]: history
                }, () => {
                    console.log('Item saved:', newItem);
                    
                    // Reset the category dropdown
                    categorySelect.value = '';
                    
                    // Refresh the displayed items
                    loadAndDisplayItems();
                    displayItemPreview();
                    updateUndoButtonState();
                    
                    // Show success notification
                    showNotification('Item saved successfully!');
                });
            });
        }
    });
}

// ============================================================================
// LOAD AND DISPLAY ITEMS FROM STORAGE
// ============================================================================
// Retrieves all saved shopping items from Chrome's persistent storage
// This data persists even after closing or refreshing the browser
// Calls displayItems() to render them in the UI
function loadAndDisplayItems() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        const items = result[STORAGE_KEY] || [];
        displayItems(items);
    });
}

// ============================================================================
// DISPLAY ITEMS IN THE SHOPPING LIST
// ============================================================================
// Renders all items in the shopping list container
// Shows an empty state message if no items exist
// Each item is rendered using createItemElement()
function displayItems(items) {
    shoppingList.innerHTML = '';
    
    if (items.length === 0) {
        shoppingList.innerHTML = '<p class="empty-message">No items saved yet</p>';
        return;
    }
    
    items.forEach((item) => {
        const itemElement = createItemElement(item);
        shoppingList.appendChild(itemElement);
    });
}

// ============================================================================
// CREATE ITEM ELEMENT
// ============================================================================
// Builds the HTML structure for a single shopping list item
// Displays:
//   - Category (color-coded)
//   - Item name (page title, truncated to 50 chars, shown on hover)
//   - URL (clickable link to original page)
//   - Delete button to remove item
function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shopping-item';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'item-content';
    
    // Display the category tag
    const categorySpan = document.createElement('div');
    categorySpan.className = 'item-category';
    categorySpan.textContent = item.category;
    
    // Create a clickable link with the URL
    // The item title (page title) is shown on hover via the title attribute
    const urlLink = document.createElement('a');
    urlLink.className = 'item-url';
    urlLink.href = item.url;
    urlLink.target = '_blank';
    urlLink.textContent = item.url;
    urlLink.title = item.title; // Show full item name on hover
    
    contentDiv.appendChild(categorySpan);
    contentDiv.appendChild(urlLink);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteItem(item.id));
    
    itemDiv.appendChild(contentDiv);
    itemDiv.appendChild(deleteBtn);
    
    return itemDiv;
}

// ============================================================================
// DELETE ITEM
// ============================================================================
// Removes a specific item from the shopping list by its ID
// Records this action in history for undo functionality
// ID is based on the timestamp when the item was created (Date.now())
function deleteItem(itemId) {
    chrome.storage.local.get([STORAGE_KEY, HISTORY_KEY], (result) => {
        let items = result[STORAGE_KEY] || [];
        let history = result[HISTORY_KEY] || [];
        
        // Find the item being deleted (needed for undo feature)
        const deletedItem = items.find(item => item.id === itemId);
        
        // Filter out the item with matching ID
        items = items.filter(item => item.id !== itemId);
        
        // Record this action in history for undo
        history.push({
            action: 'delete',
            item: deletedItem,
            previousState: JSON.parse(JSON.stringify(result[STORAGE_KEY] || [])), // Deep copy before deletion
            timestamp: Date.now()
        });
        
        // Save updated items and history to persistent storage
        chrome.storage.local.set({ 
            [STORAGE_KEY]: items,
            [HISTORY_KEY]: history
        }, () => {
            console.log('Item deleted');
            loadAndDisplayItems();
            updateUndoButtonState();
            showNotification('Item deleted');
        });
    });
}

// ============================================================================
// CLEAR ALL ITEMS
// ============================================================================
// Deletes all items from the shopping list after user confirmation
// Records this action in history so users can undo if needed
// Shows a confirmation dialog to prevent accidental deletion
function clearAllItems() {
    if (confirm('Are you sure you want to delete all items?')) {
        chrome.storage.local.get([STORAGE_KEY, HISTORY_KEY], (result) => {
            let items = result[STORAGE_KEY] || [];
            let history = result[HISTORY_KEY] || [];
            
            // Record clear all action in history (stores previous items for undo)
            history.push({
                action: 'clearAll',
                item: null,
                previousState: JSON.parse(JSON.stringify(items)), // Deep copy of all items
                timestamp: Date.now()
            });
            
            // Clear items and save to storage
            chrome.storage.local.set({ 
                [STORAGE_KEY]: [],
                [HISTORY_KEY]: history
            }, () => {
                console.log('All items cleared');
                loadAndDisplayItems();
                updateUndoButtonState();
                showNotification('All items cleared');
            });
        });
    }
}

// ============================================================================
// UNDO ACTION
// ============================================================================
// Reverts the last action (add, delete, or clear all)
// Works by:
//   1. Getting the most recent action from history
//   2. Restoring the shopping list to its previous state
//   3. Removing the action from history
// This allows users to quickly fix accidental deletions or additions
function undoAction() {
    chrome.storage.local.get([HISTORY_KEY, STORAGE_KEY], (result) => {
        let history = result[HISTORY_KEY] || [];
        
        if (history.length === 0) {
            showNotification('Nothing to undo');
            return;
        }
        
        // Get and remove the most recent action from history
        const lastAction = history.pop();
        
        // Restore the shopping list to the state before the last action
        // Handle null/undefined previousState (fallback to empty array)
        const previousState = lastAction.previousState || [];
        
        // Save the restored state back to storage
        chrome.storage.local.set({ 
            [STORAGE_KEY]: previousState,
            [HISTORY_KEY]: history
        }, () => {
            console.log('Action undone:', lastAction.action);
            loadAndDisplayItems();
            updateUndoButtonState();
            
            // Show action-specific message to user
            const messages = {
                'add': 'Item addition undone',
                'delete': 'Item deletion undone',
                'clearAll': 'Clear all undone'
            };
            showNotification(messages[lastAction.action] || 'Action undone');
        });
    });
}

// ============================================================================
// UPDATE UNDO BUTTON STATE
// ============================================================================
// Enables or disables the undo button based on whether there's history
// Button is disabled (grayed out) when history is empty (nothing to undo)
// Button is enabled (green) when there are actions that can be undone
function updateUndoButtonState() {
    chrome.storage.local.get([HISTORY_KEY], (result) => {
        const history = result[HISTORY_KEY] || [];
        undoBtn.disabled = history.length === 0;
    });
}

// ============================================================================
// SHOW NOTIFICATION
// ============================================================================
// Displays a temporary notification message to the user
// Notifications slide in from the top-right corner and fade out after 2 seconds
// Used for feedback on user actions (saved, deleted, etc.)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4caf50;
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        font-size: 13px;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}