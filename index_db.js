// Полный класс для управления fileHandle
class FileHandleManager {
    constructor() {
        this.handle = null;
        this.dbName = 'FileHandleDB';
        this.dbVersion = 1;
        this.storeName = 'handles';
    }
    
    // Инициализация базы данных
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
    
    // Сохранить handle
    async save(handle) {
        this.handle = handle;
        const db = await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(handle, 'currentFile');
            
            request.onsuccess = () => {
                console.log('FileHandle сохранен');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    
    // Загрузить handle
    async load() {
        const db = await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get('currentFile');
            
            request.onsuccess = () => {
                this.handle = request.result;
                if (this.handle) {
                    console.log('FileHandle восстановлен');
                }
                resolve(this.handle);
            };
            request.onerror = () => reject(request.error);
        });
    }
    
    // Выбрать новый файл
    async selectNewFile() {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'HTML Files',
                    accept: { 'text/html': ['.html', '.htm'] }
                }]
            });
            
            await this.save(handle);
            return handle;
        } catch (err) {
            console.error('Выбор отменен:', err);
            return null;
        }
    }
    
    // Сохранить содержимое
    async saveContent(content) {
        if (!this.handle) {
            throw new Error('Нет выбранного файла');
        }
        
        const writable = await this.handle.createWritable();
        await writable.write(content);
        await writable.close();
        
        console.log('Содержимое сохранено');
    }
}
// Использование
const fileManager = new FileHandleManager();

// При загрузке страницы
async function init() {
    // Пытаемся восстановить handle
    let handle = await fileManager.load();
    
    if (!handle) {
        // Если нет, предлагаем выбрать файл
        handle = await fileManager.selectNewFile();
    }
    
    if (handle) {
        console.log('Готов к работе с файлом:', handle.name);
    }
}

// Функция сохранения
async function saveToFile() {
    const fullHTML = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    
    try {
        await fileManager.saveContent(fullHTML);
        //alert('Файл сохранен!');
		console.log('saved')
    } catch (err) {
        console.error('Ошибка:', err);
        // Если нет handle, предлагаем выбрать
        const handle = await fileManager.selectNewFile();
        if (handle) {
            await fileManager.saveContent(fullHTML);
            alert('Файл сохранен!');
        }
    }
}

// Запускаем
init();

