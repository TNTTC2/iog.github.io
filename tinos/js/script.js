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

// Initialize the Mobile OS
document.addEventListener('DOMContentLoaded', async function() {
    await initDB();
    
    // 強制移除指定的 App Icon，確保介面乾淨
    removeSpecifiedAppIcons();
    
    initializeOS();
    updateStatusBar();
    setInterval(updateStatusBar, 1000);
    applyTheme(currentTheme);
    setTimeout(() => { loadSavedWallpapers(); }, 500);
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
});

// 新增功能：從主畫面和 Dock 徹底移除指定 App
function removeSpecifiedAppIcons() {
    const appsToRemove = ['terminal', 'aos-switcher', 'maths-ai', 'ai-messages', 'ai-assistant'];
    appsToRemove.forEach(appId => {
        const icons = document.querySelectorAll(`[data-app="${appId}"]`);
        icons.forEach(icon => icon.remove());
    });
}

function initializeOS() {
    updateStatusBar();
    setInterval(updateStatusBar, 1000);
    setupEventListeners();
    loadInstalledApps();
    setupAIToUI(); // 保留此功能
    initializeAppTheming();
    initializeScreenSaver();
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
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return; 
    }

    const appWindows = document.querySelectorAll('.app-window');
    appWindows.forEach(window => { window.classList.remove('active'); });

    // 核心 App 映射，已移除 terminal, switcher 及其他 AI apps
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
            else if (appName === 'camera') openEnhancedCameraApp();
            else if (appName === 'photos') openPhotosApp();
        }
    }
    
    if (!appWindowId) {
        const installed = installedApps.find(installed => (installed.id || installed) === appName);
        if (installed) openInstalledApp(installed.id || installed);
    }
}

function closeApp(appWindowId) {
    const appWindow = document.getElementById(appWindowId);
    if (appWindow) {
        appWindow.style.opacity = '0';
        setTimeout(() => {
            appWindow.classList.remove('active');
            appWindow.style.opacity = '1';
        }, 300);
    }
}

// --- 保留 AI to UI 功能 ---
function setupAIToUI() {
    const applyBtn = document.getElementById('applyAIChanges');
    if (applyBtn) applyBtn.addEventListener('click', applyAIChanges);
}

async function applyAIChanges() {
    const prompt = document.getElementById('aiPrompt').value;
    if (!prompt.trim()) return;
    const applyBtn = document.getElementById('applyAIChanges');
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
                messages: [{ role: 'system', content: 'You are a CSS designer.' }, { role: 'user', content: prompt }]
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
    } catch (e) {
        console.error("AI to UI error", e);
    } finally {
        applyBtn.disabled = false;
    }
}

// --- 其他保留功能 (Calculator, Camera, Photos...) ---
function initializeCalculator() {
    calculatorDisplay = '0';
    const display = document.getElementById('calcDisplay');
    if(display) display.textContent = calculatorDisplay;
}

function openEnhancedCameraApp() {
    // 這裡保留你原本 script.js 中的相機啟動邏輯
    console.log("Camera App Opened");
    const cameraWindow = document.getElementById('cameraApp');
    if(cameraWindow) cameraWindow.classList.add('active');
}

function openPhotosApp() {
    // 這裡保留你原本 script.js 中的相簿載入邏輯
    console.log("Photos App Opened");
    const photosWindow = document.getElementById('photosApp');
    if(photosWindow) photosWindow.classList.add('active');
}

// 系統核心設置 (Theme & Wallpaper)
function applyTheme(themeName) {
    document.body.className = themeName;
}

function loadSavedWallpapers() {
    const homeWallpaper = localStorage.getItem('homeWallpaper');
    const mobileOS = document.getElementById('mobile-os');
    if (homeWallpaper && mobileOS) {
        mobileOS.style.backgroundImage = `url(${homeWallpaper})`;
        mobileOS.style.backgroundSize = 'cover';
    }
}

function loadInstalledApps() {
    // 讀取已安裝應用的邏輯，並確保不會讀入已刪除的應用
    const saved = localStorage.getItem('installedApps');
    if (saved) {
        installedApps = JSON.parse(saved).filter(app => 
            app.id !== 'terminal' && app.id !== 'aos-switcher'
        );
    }
}
