class CacheManager {
    constructor() {
      this.cache = new Map();
    }
  
    // Veriyi önbelleğe ekleme
    set(key, value) {
      this.cache.set(key, value);
    }
  
    // Anahtara göre veriyi önbellekten alma
    get(key) {
      return this.cache.get(key);
    }
    
    has(key){
        return this.cache.has(key)
    }

    // Veriyi önbellekten silme
    delete(key) {
      this.cache.delete(key);
    }
  
    // Tüm önbelleği temizleme
    clear() {
      this.cache.clear();
    }
  
    // Önbellekteki veri sayısını alma
    size() {
      return this.cache.size;
    }
  
    // Önbellekteki tüm anahtarları alma
    keys() {
      return this.cache.keys();
    }
  
    // Önbellekteki tüm verileri dizi olarak alma
    values() {
      return Array.from(this.cache.values());
    }
  
    // Önbellekteki tüm anahtar ve veri çiftlerini dizi olarak alma
    entries() {
      return Array.from(this.cache.entries());
    }
  }