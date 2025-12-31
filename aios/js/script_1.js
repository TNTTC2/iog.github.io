// DOM Elements
const splashScreen = document.getElementById('splashScreen');
const mainApp = document.getElementById('mainApp');
const loadingModal = document.getElementById('loadingModal');
const iframeModal = document.getElementById('iframeModal');
const guideModal = document.getElementById('guideModal');
const closeIframe = document.getElementById('closeIframe');
const closeGuide = document.getElementById('closeGuide');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const webIframe = document.getElementById('webIframe');
const iframeTitle = document.querySelector('.iframe-title');
const loadingProgress = document.getElementById('loadingProgress');
const loadingText = document.getElementById('loadingText');
const loadingStatus = document.getElementById('loadingStatus');

// App state
let currentWindow = 'splash';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Start splash screen timer
    setTimeout(() => {
        showMainApp();
    }, 5000);

    // Add event listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Main access buttons grid - shows loading modal
    const accessButtons = document.querySelectorAll('.main-access-btn');
    accessButtons.forEach(button => {
        button.addEventListener('click', () => {
            const appName = button.getAttribute('data-app');
            const buttonText = button.querySelector('span').textContent;
            showLoadingModal(buttonText, appName);
        });
    });

    // Close iframe button
    closeIframe.addEventListener('click', () => {
        closeIframeModal();
    });

    // Close guide button
    closeGuide.addEventListener('click', () => {
        closeGuideModal();
    });

    // Close settings button
    closeSettings.addEventListener('click', () => {
        closeSettingsModal();
    });

    // Bottom button (Guide)
    const guideBtn = document.querySelector('.guide-btn');
    guideBtn.addEventListener('click', () => {
        openGuideModal();
    });

    // Close iframe when clicking outside
    iframeModal.addEventListener('click', (e) => {
        if (e.target === iframeModal) {
            closeIframeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentWindow === 'iframe') {
                closeIframeModal();
            } else if (currentWindow === 'guide') {
                closeGuideModal();
            } else if (currentWindow === 'settings') {
                closeSettingsModal();
            } else if (currentWindow === 'loading') {
                closeLoadingModal();
            }
        }
    });

    // Settings options event listeners
    setupSettingsEventListeners();
}

// Show main app window
function showMainApp() {
    splashScreen.style.display = 'none';
    iframeModal.style.display = 'none';
    loadingModal.style.display = 'none';
    mainApp.style.display = 'block';
    currentWindow = 'main';
    
    // Add entrance animation
    mainApp.style.opacity = '0';
    mainApp.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        mainApp.style.transition = 'all 0.5s ease';
        mainApp.style.opacity = '1';
        mainApp.style.transform = 'scale(1)';
    }, 100);
}

// Show loading modal
function showLoadingModal(osName, appName) {
    loadingModal.style.display = 'flex';
    currentWindow = 'loading';
    
    // Reset loading state
    loadingText.textContent = 'Switching...';
    loadingStatus.textContent = 'Preparing your new operating system...';
    
    // Start loading animation with app name
    startLoadingAnimation(appName);
}

// Start loading animation
function startLoadingAnimation(appName) {
    let progress = 0;
    const duration = 5000; // 5 seconds total
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;
    
    const progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Show completion
            loadingText.textContent = 'Done';
            loadingStatus.textContent = 'Installation completed successfully!';
            
            // Download config file after a short delay
            setTimeout(() => {
                downloadConfigFile(appName);
                // Close modal after download
                setTimeout(() => {
                    closeLoadingModal();
                }, 1000);
            }, 500);
        }
        
        // Update progress circle
        updateProgressCircle(progress);
    }, interval);
}

// Update progress circle
function updateProgressCircle(progress) {
    const degrees = (progress / 100) * 360;
    loadingProgress.style.background = `conic-gradient(from 0deg, #00ff88 ${degrees}deg, transparent ${degrees}deg)`;
}

// App URLs mapping
const appUrls = {
    'blossm': 'https://app.nextaios.com/ai/config/aiosm.mobileconfig',
    'floramuse': 'https://app.nextaios.com/ai/config/aiosp.mobileconfig',
    'petalbloom': 'https://app.nextaios.com/ai/config/aiosn.mobileconfig',
    'bloomora': 'https://app.nextaios.com/ai/config/aiost.mobileconfig',
    'daisydash': 'https://app.nextaios.com/ai/config/aiosf.mobileconfig',
    'tuliptrail': 'https://app.nextaios.com/ai/config/aiossh.mobileconfig',
    'poppypulse': 'https://app.nextaios.com/ai/config/aioss.mobileconfig'
};

// Download configuration file
function downloadConfigFile(appName) {
    const url = appUrls[appName];
    if (!url) {
        console.error('No URL found for app:', appName);
        return;
    }
    
    // Create a temporary link element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName}.mobileconfig`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Close loading modal
function closeLoadingModal() {
    loadingModal.style.display = 'none';
    currentWindow = 'main';
}

// Open iframe with web content
function openIframe(url, appName) {
    console.log('Opening iframe with URL:', url, 'and app name:', appName);
    
    // Set the iframe source
    webIframe.src = url;
    console.log('Iframe src set to:', webIframe.src);
    
    // Update the title
    iframeTitle.textContent = appName;
    console.log('Iframe title set to:', appName);
    
    // Show the modal
    iframeModal.style.display = 'flex';
    console.log('Iframe modal display set to:', iframeModal.style.display);
    
    currentWindow = 'iframe';
    
    // Add loading animation
    const iframeContainer = document.querySelector('.iframe-container');
    if (iframeContainer) {
        iframeContainer.style.opacity = '0';
        iframeContainer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            iframeContainer.style.transition = 'all 0.3s ease';
            iframeContainer.style.opacity = '1';
            iframeContainer.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Initialize draggable close button
    setTimeout(() => {
        makeCloseButtonDraggable();
    }, 100);
    
    console.log('Iframe modal should now be visible');
}

// Close iframe modal
function closeIframeModal() {
    iframeModal.style.display = 'none';
    webIframe.src = '';
    currentWindow = 'main';
}

// Open guide modal
function openGuideModal() {
    guideModal.style.display = 'flex';
    currentWindow = 'guide';
    
    // Add entrance animation
    const guideContainer = document.querySelector('.guide-container');
    if (guideContainer) {
        guideContainer.style.opacity = '0';
        guideContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            guideContainer.style.transition = 'all 0.3s ease';
            guideContainer.style.opacity = '1';
            guideContainer.style.transform = 'scale(1)';
        }, 100);
    }
}

// Close guide modal
function closeGuideModal() {
    guideModal.style.display = 'none';
    currentWindow = 'main';
}

// Open settings modal
function openSettingsModal() {
    settingsModal.style.display = 'flex';
    currentWindow = 'settings';
    
    // Add entrance animation
    const settingsContainer = document.querySelector('.settings-container');
    if (settingsContainer) {
        settingsContainer.style.opacity = '0';
        settingsContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            settingsContainer.style.transition = 'all 0.3s ease';
            settingsContainer.style.opacity = '1';
            settingsContainer.style.transform = 'scale(1)';
        }, 100);
    }
}

// Close settings modal
function closeSettingsModal() {
    settingsModal.style.display = 'none';
    currentWindow = 'main';
}

// Make close button draggable
function makeCloseButtonDraggable() {
    const iframeHeader = document.querySelector('.iframe-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Remove existing event listeners to prevent duplicates
    iframeHeader.removeEventListener('mousedown', dragStart);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    iframeHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    // Add touch support for mobile devices
    iframeHeader.addEventListener('touchstart', touchStart);
    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchend', touchEnd);

    function dragStart(e) {
        // Allow dragging from anywhere on the header (including the button)
        if (e.target === iframeHeader || iframeHeader.contains(e.target)) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = false; // Start as false, will be set to true on movement
            iframeHeader.style.cursor = 'grabbing';
            iframeHeader.style.userSelect = 'none';
        }
    }

    function drag(e) {
        if (e.target === iframeHeader || iframeHeader.contains(e.target)) {
            const deltaX = Math.abs(e.clientX - initialX);
            const deltaY = Math.abs(e.clientY - initialY);
            
            // Only start dragging if moved more than 5 pixels (to distinguish from clicks)
            if (deltaX > 5 || deltaY > 5) {
                isDragging = true;
            }
            
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Keep the button within viewport bounds
                const headerRect = iframeHeader.getBoundingClientRect();
                const maxX = window.innerWidth - headerRect.width - 20;
                const maxY = window.innerHeight - headerRect.height - 20;

                currentX = Math.max(20, Math.min(currentX, maxX));
                currentY = Math.max(20, Math.min(currentY, maxY));

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, iframeHeader);
            }
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            iframeHeader.style.cursor = 'grab';
            iframeHeader.style.userSelect = 'auto';
        } else {
            // If not dragging, it was a click - close the iframe
            closeIframeModal();
        }
    }

    // Touch event handlers for mobile
    function touchStart(e) {
        const touch = e.touches[0];
        if (e.target === iframeHeader || iframeHeader.contains(e.target)) {
            initialX = touch.clientX - xOffset;
            initialY = touch.clientY - yOffset;
            isDragging = false; // Start as false, will be set to true on movement
            iframeHeader.style.userSelect = 'none';
        }
    }

    function touchMove(e) {
        if (e.target === iframeHeader || iframeHeader.contains(e.target)) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - initialX);
            const deltaY = Math.abs(touch.clientY - initialY);
            
            // Only start dragging if moved more than 10 pixels (to distinguish from taps)
            if (deltaX > 10 || deltaY > 10) {
                isDragging = true;
            }
            
            if (isDragging) {
                e.preventDefault();
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;

                // Keep the button within viewport bounds
                const headerRect = iframeHeader.getBoundingClientRect();
                const maxX = window.innerWidth - headerRect.width - 20;
                const maxY = window.innerHeight - headerRect.height - 20;

                currentX = Math.max(20, Math.min(currentX, maxX));
                currentY = Math.max(20, Math.min(currentY, maxY));

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, iframeHeader);
            }
        }
    }

    function touchEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            iframeHeader.style.userSelect = 'auto';
        } else {
            // If not dragging, it was a tap - close the iframe
            closeIframeModal();
        }
    }

    // Add visual feedback for draggable area
    iframeHeader.style.cursor = 'grab';
    iframeHeader.title = 'Drag to move button';
    
    // Add a subtle visual indicator that it's draggable
    iframeHeader.style.transition = 'box-shadow 0.3s ease';
    
    iframeHeader.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(102, 126, 234, 0.3)';
    });
    
    iframeHeader.addEventListener('mouseleave', function() {
        if (!isDragging) {
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        }
    });
}



// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(145deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add touch feedback for mobile
function addTouchFeedback() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize touch feedback
addTouchFeedback();

// Add loading state for iframe
webIframe.addEventListener('load', function() {
    // Remove loading indicator if needed
    console.log('Iframe loaded successfully');
});

webIframe.addEventListener('error', function() {
    showNotification('Failed to load content. Please try again.');
});

// Add haptic feedback for mobile (if supported)
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        });
    }
}

// Initialize haptic feedback
addHapticFeedback();

// Setup settings event listeners
function setupSettingsEventListeners() {
    // Theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            const theme = option.getAttribute('data-theme');
            applyTheme(theme);
        });
    });

    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            const color = option.getAttribute('data-color');
            applyColor(color);
        });
    });
}

// Apply theme
function applyTheme(theme) {
    // Store theme preference
    localStorage.setItem('aios-theme', theme);
    
    // Apply theme changes (you can customize this based on your needs)
    showNotification(`Theme changed to ${theme} mode!`);
}

// Apply color
function applyColor(color) {
    // Store color preference
    localStorage.setItem('aios-color', color);
    
    // Apply color changes (you can customize this based on your needs)
    showNotification(`Color palette changed to ${color}!`);
}

// Add main access buttons pulse effect
function addPulseEffect() {
    const accessButtons = document.querySelectorAll('.main-access-btn');
    accessButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1s infinite';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

// Initialize pulse effect
addPulseEffect();

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
