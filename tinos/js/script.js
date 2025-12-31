// OpenRouter API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Global Variables
let currentCalculation = '';
let calculatorDisplay = '';
let installedApps = [];
let phoneNumber = '';
let userPasscode = localStorage.getItem('userPasscode') || '';
let currentPasscodeEntry = '';
let currentTheme = localStorage.getItem('currentTheme') || 'theme-light';
let userPhotos = JSON.parse(localStorage.getItem('userPhotos')) || [];
let currentHomeWallpaper = localStorage.getItem('homeWallpaper') || '';
let currentLockWallpaper = localStorage.getItem('lockWallpaper') || '';
let cameraStream = null;
let currentCameraFacingMode = 'user';

// --- IndexedDB Helper ---
const DB_NAME = 'userPhotosDB';
const STORE_NAME = 'photos';
let db;

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = event => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = event => {
            console.error('IndexedDB error:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

async function savePhotoToDB(photo) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(photo);
        request.onsuccess = () => resolve();
        request.onerror = event => {
            console.error('Error saving photo to DB:', event.target.error);
            reject(event.target.error);
        };
    });
}

async function loadPhotosFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) { resolve([]); return; }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = event => { resolve(event.target.result || []); };
        request.onerror = event => {
            console.error('Error loading photos from DB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Initialize the Mobile OS
document.addEventListener('DOMContentLoaded', async function() {
    await initDB();
    initializeOS();
    updateStatusBar();
    setInterval(updateStatusBar, 1000);
    applyTheme(currentTheme);
    setTimeout(() => { loadSavedWallpapers(); }, 500);
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
});

function initializeOS() {
    updateStatusBar();
    setInterval(updateStatusBar, 1000);
    setupEventListeners();
    loadInstalledApps();
    setupAIToUI();
    initializeAppTheming();
    initializeScreenSaver();
    loadScreenSaverSettings();
    
    const refreshBtn = document.getElementById('refreshStore');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAppStore);
    }
}

function setupEventListeners() {
    const appIcons = document.querySelectorAll('.app-icon, .dock-app');
    appIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            openApp(appName);
        });
    });

    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const appWindow = this.closest('.app-window');
            closeApp(appWindow.id);
        });
    });

    const lockButton = document.querySelector('[data-app="lock"]');
    if (lockButton) {
        lockButton.addEventListener('click', function() {
            activateLockScreen();
        });
    }
}

function updateStatusBar() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    if(timeElement) timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dateElement) dateElement.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// App Management Functions  
function openApp(appName) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
        return; 
    }

    const appWindows = document.querySelectorAll('.app-window');
    appWindows.forEach(window => { window.classList.remove('active'); });

    if (appName === 'lock') {
        showLockScreen();
        return;
    }

    // 更新後的 App 映射：移除了 Terminal, Aios switcher 及非 ai-to-ui 的 AI apps
    const appMap = {
        'camera': 'cameraApp',
        'calculator': 'calculatorApp',
        'ai-to-ui': 'aiToUiApp', // 唯一保留的 AI App
        'app-store': 'appStoreApp',
        'settings': 'settingsApp',
        'phone': 'phoneApp',
        'photos': 'photosApp',
        'cydia2': 'cydia2App'
    };

    const appWindowId = appMap[appName];
    if (appWindowId) {
        const appWindow = document.getElementById(appWindowId);
        if (appWindow) {
            appWindow.classList.add('active');
            if (appName === 'calculator') initializeCalculator();
            else if (appName === 'app-store') refreshAppStore();
            else if (appName === 'camera') { openEnhancedCameraApp(); return; }
            else if (appName === 'photos') { openPhotosApp(); return; }
        }
    }
    
    if (!appWindowId) {
        const installed = installedApps.find(installed => (installed.id || installed) === appName);
        if (installed) openInstalledApp(installed.id || installed);
    }
}

function closeApp(appWindowId) {
    const appWindow = document.getElementById(appWindowId);
    const homeScreen = document.getElementById('homeScreen');
    if (appWindow) {
        appWindow.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
        appWindow.style.opacity = '0';
        setTimeout(() => {
            appWindow.classList.remove('active');
            appWindow.style.opacity = '1';
        }, 300);
        if (homeScreen) {
            homeScreen.style.display = 'block';
            setTimeout(() => { homeScreen.style.opacity = '1'; }, 100);
        }
    }
}

// Calculator Functions
function initializeCalculator() {
    calculatorDisplay = '0';
    const display = document.getElementById('calcDisplay');
    if(display) display.textContent = calculatorDisplay;
}

function appendToCalculator(value) {
    if (calculatorDisplay === '0' && !isNaN(value)) calculatorDisplay = value;
    else calculatorDisplay += value;
    document.getElementById('calcDisplay').textContent = calculatorDisplay;
}

function clearCalculator() {
    calculatorDisplay = '0';
    document.getElementById('calcDisplay').textContent = calculatorDisplay;
}

function calculateResult() {
    try {
        const calculation = calculatorDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        calculatorDisplay = eval(calculation).toString();
        document.getElementById('calcDisplay').textContent = calculatorDisplay;
    } catch (e) {
        calculatorDisplay = 'Error';
        document.getElementById('calcDisplay').textContent = calculatorDisplay;
        setTimeout(clearCalculator, 2000);
    }
}

// Phone Functions
function dialNumber(number) {
    currentPhoneNumber += number;
    const display = document.getElementById('phoneDisplay');
    if (display) display.textContent = currentPhoneNumber;
    updateCallButton();
}

function clearPhoneNumber() {
    currentPhoneNumber = '';
    const display = document.getElementById('phoneDisplay');
    if (display) display.textContent = '';
    updateCallButton();
}

function updateCallButton() {
    const callBtn = document.querySelector('.call-btn');
    if (callBtn) {
        if (currentPhoneNumber.length >= 3) {
            callBtn.textContent = '📞 Call ' + currentPhoneNumber;
            callBtn.style.backgroundColor = '#22c55e';
        } else {
            callBtn.textContent = '📞 Enter Number';
            callBtn.style.backgroundColor = '#6b7280';
        }
    }
}

// AI to UI Functions (保留此功能)
function setupAIToUI() {
    const applyBtn = document.getElementById('applyAIChanges');
    const resetBtn = document.getElementById('resetUI');
    if (applyBtn) applyBtn.addEventListener('click', applyAIChanges);
    if (resetBtn) resetBtn.addEventListener('click', resetUI);
}

async function applyAIChanges() {
    const prompt = document.getElementById('aiPrompt').value;
    const statusDiv = document.getElementById('aiStatus');
    if (!prompt.trim()) return;
    
    const applyBtn = document.getElementById('applyAIChanges');
    applyBtn.textContent = '⏳ Applying...';
    applyBtn.disabled = true;
    
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: 'You generate CSS for mobile UI.' }, { role: 'user', content: prompt }]
            })
        });
        const data = await response.json();
        const generatedCSS = data.choices[0].message.content.replace(/```css|```/g, '');
        
        let styleTag = document.getElementById('dynamic-ai-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-ai-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = generatedCSS;
        statusDiv.textContent = '✅ UI Updated!';
    } catch (e) {
        statusDiv.textContent = '❌ Error updating UI.';
    } finally {
        applyBtn.textContent = 'Apply UI Changes';
        applyBtn.disabled = false;
    }
}

function resetUI() {
    const styleTag = document.getElementById('dynamic-ai-style');
    if (styleTag) styleTag.remove();
    const promptField = document.getElementById('aiPrompt');
    if (promptField) promptField.value = '';
}

// App Store Functions
async function refreshAppStore() {
    const appsList = document.getElementById('appsList');
    if (!appsList) return;
    appsList.innerHTML = '<div>Loading apps...</div>';
    try {
        const response = await fetch('apps/app-store.json');
        const data = await response.json();
        // 過濾掉已移除的 Apps 種類
        const filteredApps = data.apps.filter(app => app.id !== 'terminal' && app.id !== 'aos-switcher' && app.category !== 'AI Assistant');
        updateAppStoreDisplay(filteredApps);
    } catch (e) {
        appsList.innerHTML = '<div>Failed to load.</div>';
    }
}

function updateAppStoreDisplay(apps) {
    const appsList = document.getElementById('appsList');
    appsList.innerHTML = '';
    apps.forEach(app => {
        const div = document.createElement('div');
        div.className = 'store-app';
        div.innerHTML = `
            <div class="store-app-info">
                <h4>${app.name}</h4>
                <p>${app.description}</p>
                <button class="install-btn" onclick="installApp('${app.id}', '${app.type}', '${app.url}')">Get</button>
            </div>
        `;
        appsList.appendChild(div);
    });
}

// 系統核心設置
function applyTheme(themeName) {
    const themes = {
        light: { '--bg-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '--text-primary': '#333333' },
        dark: { '--bg-primary': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', '--text-primary': '#ffffff' }
    };
    const theme = themes[themeName] || themes.light;
    for (const [prop, val] of Object.entries(theme)) {
        document.documentElement.style.setProperty(prop, val);
    }
}

function loadSavedWallpapers() {
    const homeWallpaper = localStorage.getItem('homeWallpaper');
    if (homeWallpaper) {
        const mobileOS = document.getElementById('mobile-os');
        if (mobileOS) mobileOS.style.backgroundImage = `url(${homeWallpaper})`;
    }
}

// 此處省略了一些不影響功能的 UI 渲染輔助函數...
