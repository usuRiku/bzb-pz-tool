/*
  Usage:
    # Default: update only docs missing/invalid mic arrays
    node scripts/update_live_mic_defaults.js

    # Force overwrite all Live documents' mic arrays
    node scripts/update_live_mic_defaults.js --force

  Provide a MongoDB URL via env var DB_URL, e.g. in PowerShell:
    $env:DB_URL = "mongodb://localhost:27017/yourdbname"; node scripts/update_live_mic_defaults.js
*/

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);
// デフォルトで全件上書きする（従来の「欠損のみ更新」は --preserve を指定）
const preserve = argv.includes('--preserve'); // 指定すると既存の正しい配列はスキップ
const force = argv.includes('--force') || !preserve;
const dryRun = argv.includes('--dry-run');
const backup = argv.includes('--backup');

const DEFAULT_MIC_NUMBERS = ['6','5','4','3','2','1'];
const DEFAULT_MIC_PARTS = ['サード','セカンド','トップ','リード','ベース','ボイパ'];

async function main() {
  const dbUrl = process.env.DB_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bzb-pz-tool';
  console.log('Connecting to', dbUrl);
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const Live = require(path.join(__dirname, '..', 'models', 'live'));

  try {
    const lives = await Live.find({});
    console.log(`Found ${lives.length} Live documents`);

    const toUpdate = [];
    for (const live of lives) {
      const hasMicNumbers = Array.isArray(live.micNumber) && live.micNumber.length === 6;
      const hasMicParts = Array.isArray(live.micPart) && live.micPart.length === 6;

      if (!force && hasMicNumbers && hasMicParts) {
        continue;
      }

      toUpdate.push({
        _id: live._id.toString(),
        name: live.name || '',
        currentMicNumber: live.micNumber,
        currentMicPart: live.micPart
      });
    }

    if (toUpdate.length === 0) {
      console.log('No documents need updating.');
      await mongoose.disconnect();
      return;
    }

    console.log(`Documents to ${force ? 'force-update' : 'update if missing/invalid'}: ${toUpdate.length}`);

    if (backup) {
      const backupPath = path.join(__dirname, `backup_live_mic_${Date.now()}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(toUpdate, null, 2), 'utf8');
      console.log('Backup written to', backupPath);
    }

    if (dryRun) {
      console.log('Dry-run: no changes applied. Examples of changes:');
      for (const item of toUpdate) {
        console.log(` - Live ${item._id} (${item.name}) -> micNumber: ${JSON.stringify(DEFAULT_MIC_NUMBERS)}, micPart: ${JSON.stringify(DEFAULT_MIC_PARTS)}`);
      }
      await mongoose.disconnect();
      return;
    }

    let updated = 0;
    for (const item of toUpdate) {
      const res = await Live.updateOne(
        { _id: item._id },
        { $set: { micNumber: DEFAULT_MIC_NUMBERS.slice(), micPart: DEFAULT_MIC_PARTS.slice() } }
      );
      if (res.nModified === 1 || res.modifiedCount === 1) {
        updated++;
        console.log(`Updated Live ${item._id} (${item.name})`);
      } else {
        // fallback to save() if updateOne didn't modify (edge cases)
        const doc = await Live.findById(item._id);
        if (doc) {
          doc.micNumber = DEFAULT_MIC_NUMBERS.slice();
          doc.micPart = DEFAULT_MIC_PARTS.slice();
          await doc.save();
          updated++;
          console.log(`Saved Live ${item._id} (${item.name}) via doc.save()`);
        }
      }
    }

    console.log(`Done. Updated: ${updated}, Skipped: ${lives.length - toUpdate.length}`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
