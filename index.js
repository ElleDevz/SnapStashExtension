const DEMO_STORAGE_KEY = 'snapstashDemoItems';
const DEMO_HISTORY_KEY = 'snapstashDemoHistory';

// DOM Elements
const categorySelect = document.getElementById('category');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const shoppingList = document.getElementById('shoppingList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayItems();
    updateUndoButtonState();
    setupEventListeners();
});

function setupEventListeners() {
    saveBtn.addEventListener('click', saveItem);
    clearBtn.addEventListener('click', clearAllItems);
    undoBtn.addEventListener('click', undoAction);
}

function saveItem() {
    const category = categorySelect.value;

    if (!category) {
        showNotification('Please select a category!');
        return;
    }

    const newItem = {
        id: Date.now(),
        category: category,
        url: 'example.com/product-' + Math.floor(Math.random() * 1000),
        title: `${category} Item - ${new Date().toLocaleTimeString()}`,
        savedAt: new Date().toLocaleString()
    };

    // Get existing items and history
    let items = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
    let history = JSON.parse(localStorage.getItem(DEMO_HISTORY_KEY)) || [];
    
    // Record action in history
    history.push({
        action: 'add',
        item: newItem,
        previousState: JSON.parse(JSON.stringify(items)),
        timestamp: Date.now()
    });
    
    items.push(newItem);
    
    // Save to localStorage
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(DEMO_HISTORY_KEY, JSON.stringify(history));

    // Reset form
    categorySelect.value = '';
    
    // Reload display
    loadAndDisplayItems();
    updateUndoButtonState();
    showNotification('Item saved successfully!');
}

function loadAndDisplayItems() {
    const items = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
    displayItems(items);
}

function displayItems(items) {
    shoppingList.innerHTML = '';

    if (items.length === 0) {
        shoppingList.innerHTML = '<p class="empty-message-demo">No items saved yet</p>';
        return;
    }

    items.forEach(item => {
        const itemElement = createItemElement(item);
        shoppingList.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'shopping-item-demo';

    div.innerHTML = `
        <div class="item-content-demo">
            <div class="item-category-demo">${item.category}</div>
            <div class="item-url-demo">${item.url}</div>
            <div style="font-size: 10px; color: #999; margin-top: 4px;">${item.savedAt}</div>
        </div>
        <button class="delete-btn-demo">Delete</button>
    `;

    const deleteBtn = div.querySelector('.delete-btn-demo');
    deleteBtn.addEventListener('click', () => deleteItem(item.id));

    return div;
}

function deleteItem(itemId) {
    let items = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
    let history = JSON.parse(localStorage.getItem(DEMO_HISTORY_KEY)) || [];
    
    // Find the item being deleted
    const deletedItem = items.find(item => item.id === itemId);
    
    // Record action in history
    history.push({
        action: 'delete',
        item: deletedItem,
        previousState: JSON.parse(JSON.stringify(items)),
        timestamp: Date.now()
    });
    
    items = items.filter(item => item.id !== itemId);
    
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(DEMO_HISTORY_KEY, JSON.stringify(history));
    loadAndDisplayItems();
    updateUndoButtonState();
    showNotification('Item deleted!');
}

function clearAllItems() {
    if (confirm('Are you sure you want to clear all items?')) {
        let items = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)) || [];
        let history = JSON.parse(localStorage.getItem(DEMO_HISTORY_KEY)) || [];
        
        // Record action in history
        history.push({
            action: 'clearAll',
            item: null,
            previousState: JSON.parse(JSON.stringify(items)),
            timestamp: Date.now()
        });
        
        localStorage.removeItem(DEMO_STORAGE_KEY);
        localStorage.setItem(DEMO_HISTORY_KEY, JSON.stringify(history));
        loadAndDisplayItems();
        updateUndoButtonState();
        showNotification('All items cleared!');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff7f7f 0%, #ff6b6b 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Undo the last action
function undoAction() {
    let history = JSON.parse(localStorage.getItem(DEMO_HISTORY_KEY)) || [];
    
    if (history.length === 0) {
        showNotification('Nothing to undo');
        return;
    }
    
    // Get the last action
    const lastAction = history.pop();
    
    // Restore the previous state
    if (lastAction.previousState.length === 0) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
    } else {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(lastAction.previousState));
    }
    
    localStorage.setItem(DEMO_HISTORY_KEY, JSON.stringify(history));
    
    loadAndDisplayItems();
    updateUndoButtonState();
    
    const messages = {
        'add': 'Item addition undone',
        'delete': 'Item deletion undone',
        'clearAll': 'Clear all undone'
    };
    showNotification(messages[lastAction.action] || 'Action undone');
}

// Update undo button state based on history
function updateUndoButtonState() {
    const history = JSON.parse(localStorage.getItem(DEMO_HISTORY_KEY)) || [];
    undoBtn.disabled = history.length === 0;
}

// Add animation styles
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

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
