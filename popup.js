// Get DOM elements
const categorySelect = document.getElementById('category');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const shoppingList = document.getElementById('shoppingList');
const currentUrlDiv = document.getElementById('currentUrl');

// Storage key
const STORAGE_KEY = 'snapstashItems';

// Initialize the extension when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    // Display current tab URL
    displayCurrentUrl();
    
    // Load and display saved items
    loadAndDisplayItems();
    
    // Add event listeners
    saveBtn.addEventListener('click', saveItem);
    clearBtn.addEventListener('click', clearAllItems);
});

// Get the current tab's URL
function displayCurrentUrl() {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const url = tabs[0].url;
            currentUrlDiv.textContent = `Current URL: ${url}`;
        }
    });
}

// Save item to storage
function saveItem() {
    const category = categorySelect.value;
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const url = tabs[0].url;
            
            // Get existing items from storage
            chrome.storage.local.get([STORAGE_KEY], (result) => {
                let items = result[STORAGE_KEY] || [];
                
                // Add new item
                const newItem = {
                    id: Date.now(), // Simple unique ID
                    category: category,
                    url: url,
                    title: tabs[0].title,
                    savedAt: new Date().toLocaleString()
                };
                
                items.push(newItem);
                
                // Save to storage
                chrome.storage.local.set({ [STORAGE_KEY]: items }, () => {
                    console.log('Item saved:', newItem);
                    
                    // Reset form and reload display
                    categorySelect.value = '';
                    loadAndDisplayItems();
                    
                    // Show success message
                    showNotification('Item saved successfully!');
                });
            });
        }
    });
}

// Load and display items from storage
function loadAndDisplayItems() {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        const items = result[STORAGE_KEY] || [];
        displayItems(items);
    });
}

// Display items in the shopping list
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

// Create an item element
function createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shopping-item';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'item-content';
    
    const categorySpan = document.createElement('div');
    categorySpan.className = 'item-category';
    categorySpan.textContent = item.category;
    
    const urlLink = document.createElement('a');
    urlLink.className = 'item-url';
    urlLink.href = item.url;
    urlLink.target = '_blank';
    urlLink.textContent = item.url;
    urlLink.title = item.title;
    
    contentDiv.appendChild(categorySpan);
    contentDiv.appendChild(urlLink);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteItem(item.id));
    
    itemDiv.appendChild(contentDiv);
    itemDiv.appendChild(deleteBtn);
    
    return itemDiv;
}

// Delete a specific item
function deleteItem(itemId) {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        let items = result[STORAGE_KEY] || [];
        
        // Filter out the deleted item
        items = items.filter(item => item.id !== itemId);
        
        // Save updated list
        chrome.storage.local.set({ [STORAGE_KEY]: items }, () => {
            console.log('Item deleted');
            loadAndDisplayItems();
            showNotification('Item deleted');
        });
    });
}

// Clear all items
function clearAllItems() {
    if (confirm('Are you sure you want to delete all items?')) {
        chrome.storage.local.set({ [STORAGE_KEY]: [] }, () => {
            console.log('All items cleared');
            loadAndDisplayItems();
            showNotification('All items cleared');
        });
    }
}

// Show a temporary notification
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
    
    // Add animation
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