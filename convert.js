const fs = require('fs');
const path = require('path');

// Alamat folder data karakter kamu
const baseDir = './wuwa/data/characters'; 
const outputFile = 'database_gacha.json';

// Kamus terjemahan otomatis
const translate = {
    "Aero": "Angin",
    "Glacio": "Es",
    "Electro": "Listrik",
    "Fusion": "Api",
    "Spectro": "Cahaya",
    "Havoc": "Havoc",
    "Pistols": "Pistol",
    "Sword": "Pedang",
    "Broadblade": "Pedang Besar",
    "Rectifier": "Rectifier",
    "Gauntlets": "Sarung Tinju"
};

const finalData = [];

// Baca semua folder di dalam data/characters
const folders = fs.readdirSync(baseDir);

folders.forEach(folderName => {
    const jsonPath = path.join(baseDir, folderName, 'en.json');

    if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);

        // AMBIL DESKRIPSI PANJANG DARI BASIC ATTACK
        let fullDesc = "Karakter Wuthering Waves.";
        if (data.skills && data.skills.length > 0) {
            const basicSkill = data.skills.find(s => s.type === "Basic Attack");
            if (basicSkill && basicSkill.descriptionMd) {
                // Bersihkan tanda bintang (**)
                fullDesc = basicSkill.descriptionMd.replace(/\*\*/g, '');
            }
        }

        const character = {
            id: data.id || folderName,
            name: data.name,
            rarity: data.rarity || 5,
            element: translate[data.element] || data.element,
            weapon: translate[data.weaponType] || data.weaponType,
            description: fullDesc,
            skills: data.skills ? data.skills.filter(s => s.category === "Active").map(s => s.name) : [],
            // Path gambar relatif untuk repo
            image: `wuwa/images/characters/${folderName}/card.webp`
        };

        finalData.push(character);
        console.log(`✅ Berhasil memproses: ${data.name}`);
    }
});

// Simpan hasil ke file JSON
fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
console.log(`\n🎉 SELESAI! Total ${finalData.length} karakter. Jangan lupa COMMIT & PUSH ke GitHub!`);