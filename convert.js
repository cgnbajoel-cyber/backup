const fs = require('fs');
const path = require('path');

// 1. Konfigurasi
const baseDir = './data/characters'; 
const outputFile = 'database_gacha_genshin.json';

// 2. Kamus Terjemahan
const translate = {
    "GEO": "Tanah (Geo)", "HYDRO": "Air (Hydro)", "PYRO": "Api (Pyro)",
    "CRYO": "Es (Cryo)", "ANEMO": "Angin (Anemo)", "ELECTRO": "Listrik (Electro)",
    "DENDRO": "Tumbuhan (Dendro)", "SWORD": "Pedang", "CLAYMORE": "Pedang Besar",
    "POLEARM": "Tombak", "BOW": "Panah", "CATALYST": "Buku (Catalyst)"
};

const finalData = [];
const files = fs.readdirSync(baseDir);

files.forEach(fileName => {
    if (path.extname(fileName) === '.json') {
        try {
            const jsonPath = path.join(baseDir, fileName);
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            const character = {
                id: data.name.toLowerCase().replace(/\s+/g, '-'),
                name: data.name,
                title: data.title || "",
                rarity: data.rarity || 5,
                element: translate[data.vision_key] || data.vision,
                weapon: translate[data.weapon_type] || data.weapon,
                nation: data.nation || "Teyvat",
                birthday: data.birthday ? data.birthday.replace('0000-', '') : "Unknown",
                description: data.description || "",
                
                // Ambil Nama-namanya saja agar JSON ringan
                skills: data.skillTalents ? data.skillTalents.map(s => s.name) : [],
                passives: data.passiveTalents ? data.passiveTalents.map(p => p.name) : [],
                constellations: data.constellations ? data.constellations.map(c => c.name) : [],
                
                // 3. AMBIL LINK ASLI DARI JSON ASALNYA
                // Menggunakan property img.card dan img.banner sesuai struktur yang kamu kasih
                image: data.img && data.img.card ? data.img.card : "",
                banner: data.img && data.img.banner ? data.img.banner : ""
            };

            finalData.push(character);
            console.log(`✅ Berhasil Meringkas: ${character.name}`);
        } catch (err) {
            console.log(`⚠️ Gagal di file ${fileName}: ${err.message}`);
        }
    }
});

fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));

console.log(`\n🎉 SELESAI!`);
console.log(`📂 Database baru pakai link R2: ${outputFile}`);