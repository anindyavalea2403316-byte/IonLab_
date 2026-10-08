'use strict';
/* ION LAB — script.js
   Login hanya identifikasi lokal siswa (localStorage), BUKAN sistem keamanan akun.
   EDIT: DEV, SUBS (materi), DIAG/FORM/FIN (soal+kunci), SUB (data zat), GDOCS. */
const KEY='ionlab_v1', GDOCS='https://docs.google.com/document/d/1pB82JyLAww_f9LeNOymXQpop_r-AtPZ-cLdzNn5LxsA/edit?usp=sharing'; // EDIT: tautan Google Docs tambahan
const DEV=['Adesta Sukma Prisilia Putri (240331604471)','Andiana Bunga Dwimutiara (240331601915)','Anindya Valea Putri (240331603756)','Gadis Alma Apriliani (240331607045)','Novanda Dwija Firdania (240331603352)'];
const STEPS=['Awal','Diagnostik','Materi','Apersepsi','Prediksi','Virtual Lab','Analisis','Penguatan','Evaluasi'];
const REQ=['Klik "Mulai Belajar".','Selesaikan 5 soal diagnostik.','Selesaikan keenam cek cepat materi.','Pilih satu skenario dan jawab pertanyaan lanjutannya.','Tempatkan semua 11 zat ke dalam kelompok.','Uji minimal 4 zat berbeda di Virtual Lab.','Isi dan periksa kriteria elektrolit buatanmu.','Selesaikan 5 persamaan, perhitungan ion, dan larutan misterius.','Selesaikan evaluasi formatif dan evaluasi akhir.'];
const TOP={dhl:'Daya hantar listrik',ion:'Pergerakan ion',dis:'Disosiasi, hidrasi, dan ionisasi',kuat:'Elektrolit kuat dan lemah',kons:'Konsentrasi dan perhitungan ion',mis:'Miskonsepsi umum'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const blank=()=>({name:'',kelas:'',stage:0,started:false,diag:[],qc:{},sub:0,aper:{},pred:{},tests:[],crit:'',critOk:false,eq:{},calc:{},myst:{},form:[],fin:[],refl:'',date:''});
let S=(()=>{try{return Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)))}catch(e){return blank()}})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- LOGO & KARAKTER ---------- */
const LOGO=`<svg class="logo" viewBox="0 0 64 40" role="img" aria-label="Logo ION LAB"><line x1="20" y1="20" x2="44" y2="20" stroke="#b5654a" stroke-width="3"/><circle cx="18" cy="20" r="14" fill="#f2b8a0" stroke="#b5654a" stroke-width="2"/><circle cx="46" cy="20" r="14" fill="#bfe3d0" stroke="#5f8a6e" stroke-width="2"/><path d="M12 20h12M18 14v12" stroke="#7a3b26" stroke-width="3" stroke-linecap="round"/><path d="M40 20h12" stroke="#2f5a43" stroke-width="3" stroke-linecap="round"/></svg>`;
function researcher(ok){
 const face=ok?'<path d="M50 62q10 9 20 0" stroke="#7a3b26" stroke-width="2.5" fill="none"/>':'<path d="M52 66h16" stroke="#7a3b26" stroke-width="2.5"/><path d="M44 40l12 3M76 40l-12 3" stroke="#6b4a3a" stroke-width="2"/>';
 const arms=ok?'<path d="M88 100q18-6 14-26" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="96" y="56" width="9" height="22" rx="4" fill="#f6d5bd"/><circle cx="101" cy="78" r="8" fill="#f6d5bd"/>'
 :'<path d="M30 100l60 14M90 100l-60 14" stroke="#9bb5a4" stroke-width="14" stroke-linecap="round"/><path d="M30 100l60 14M90 100l-60 14" stroke="#fff" stroke-width="10" stroke-linecap="round"/>';
 return `<svg class="res" viewBox="0 0 120 130" aria-hidden="true">${ok?'<g class="stars" fill="#e6a65c"><path d="M14 20l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"/><path d="M104 12l2 5 5 1-4 4 1 5-4-3-4 3 1-5-4-4 5-1z"/></g>':''}<path d="M25 130v-38q0-14 20-18h30q20 4 20 18v38z" fill="#fff" stroke="#9bb5a4" stroke-width="2"/>${arms}<circle cx="60" cy="48" r="24" fill="#f6d5bd"/><path d="M36 46q0-26 24-26t24 26q-8-12-24-12t-24 12z" fill="#6b4a3a"/><g fill="none" stroke="#4a5d52" stroke-width="2"><circle cx="50" cy="50" r="7"/><circle cx="70" cy="50" r="7"/><path d="M57 50h6"/></g>${face}</svg>`;
}
const fbHtml=(ok,e)=>`<div class="fbk ${ok?'good':'try'}">${researcher(ok)}<div><b>${ok?'Benar! Kamu sudah memahami konsepnya.':'Belum tepat. Yuk, perhatikan kembali petunjuknya.'}</b><p>${e}</p></div></div>`;

/* ---------- BANK SOAL (kunci a = indeks 0–3 → A–D, sengaja bervariasi) ---------- */
const DIAG=[
{q:'Lampu pada alat uji tidak menyala saat elektroda dicelupkan ke suatu larutan. Kesimpulan paling tepat adalah ...',o:['Larutan pasti nonelektrolit karena tidak ada zat terlarut.','Alat uji pasti rusak sehingga hasil tidak berlaku.','Ion bebas tidak cukup untuk menyalakan lampu; zat bisa nonelektrolit atau elektrolit sangat encer/lemah.','Larutan mengandung elektron bebas yang tidak mengalir.'],a:2,t:'dhl',m:'Lampu padam tidak selalu berarti nonelektrolit.',e:'Lampu padam hanya berarti ion bebas terlalu sedikit untuk menutup rangkaian. Elektrolit sangat encer atau sangat lemah dapat menghasilkan lampu padam.'},
{q:'Larutan P menyalakan lampu lebih terang daripada larutan Q. Pernyataan yang paling tepat adalah ...',o:['P memiliki ion total per volume lebih banyak, tetapi belum tentu konsentrasinya lebih tinggi.','Konsentrasi P pasti lebih tinggi daripada Q.','P pasti elektrolit kuat dan Q pasti nonelektrolit.','Terang lampu tidak berkaitan dengan jumlah ion.'],a:0,t:'kons',m:'Lampu lebih terang tidak otomatis berarti konsentrasi lebih tinggi.',e:'Terang lampu bergantung pada jumlah ion total, yang dipengaruhi jenis zat (kekuatan elektrolit) dan konsentrasi.'},
{q:'Pembawa muatan yang bergerak di dalam larutan elektrolit adalah ...',o:['Elektron bebas yang berpindah dari satu elektroda ke elektroda lain melalui larutan.','Molekul air yang bermuatan.','Atom netral dari zat terlarut.','Ion positif dan ion negatif yang bergerak ke elektroda berlawanan muatan.'],a:3,t:'ion',m:'Pembawa muatan dalam larutan adalah ion, bukan elektron bebas.',e:'Di kawat logam muatan dibawa elektron; di dalam larutan muatan dibawa ion. Kation menuju elektroda negatif, anion menuju elektroda positif.'},
{q:'NaCl padat tidak menghantarkan listrik karena ...',o:['NaCl padat tidak mengandung ion.','ion-ion terikat kuat pada kisi kristal sehingga tidak bebas bergerak.','NaCl padat tergolong nonelektrolit.','NaCl padat tidak mengandung elektron.'],a:1,t:'ion',m:'NaCl padat mengandung ion, tetapi ion tidak bebas bergerak.',e:'Ion Na⁺ dan Cl⁻ ada dalam kristal, tetapi tidak bebas. Setelah dilarutkan atau dilelehkan, ion bebas bergerak.'},
{q:'Gula dilarutkan dalam air. Pernyataan yang tepat adalah ...',o:['Semua zat yang larut dalam air membentuk ion.','Gula terurai menjadi atom C, H, dan O.','Gula tetap sebagai molekul netral terlarut sehingga tidak ada ion pembawa muatan.','Gula membentuk ion dan menghantarkan listrik dengan lemah.'],a:2,t:'dis',m:'Tidak semua zat yang larut dalam air membentuk ion.',e:'Gula (sukrosa) larut sebagai molekul utuh yang dikelilingi molekul air; tidak terbentuk ion.'}];
const FORM=[
{q:'Pada alat uji elektrolit, lampu menyala jika ...',o:['rangkaian tertutup karena larutan mengandung ion bebas yang membawa muatan.','larutan mengandung molekul netral dalam jumlah banyak.','elektroda terbuat dari logam apa pun walau tanpa larutan.','larutan berwarna pekat.'],a:0,t:'dhl',e:'Lampu menyala saat larutan mampu membawa muatan melalui ion bebas sehingga rangkaian tertutup.'},
{q:'Saat larutan NaCl diuji, ion Cl⁻ bergerak menuju ...',o:['elektroda negatif.','tempat semula (tidak bergerak).','elektroda positif.','kedua elektroda bergantian tanpa arah.'],a:2,t:'ion',e:'Anion tertarik ke elektroda positif; kation ke elektroda negatif.'},
{q:'Urutan peristiwa ketika kristal NaCl larut dalam air adalah ...',o:['ionisasi lalu kristalisasi.','hidrasi lalu disosiasi.','elektrolisis lalu hidrasi.','disosiasi (pemisahan ion) lalu hidrasi (ion dikelilingi molekul air).'],a:3,t:'dis',e:'Air menguraikan kisi menjadi ion (disosiasi), lalu tiap ion dikelilingi molekul air (hidrasi) sehingga stabil.'},
{q:'Pernyataan yang benar tentang HCl dan NH₃ dalam air adalah ...',o:['keduanya nonelektrolit.','keduanya molekuler; HCl elektrolit kuat, NH₃ elektrolit lemah.','HCl elektrolit lemah, NH₃ elektrolit kuat.','keduanya elektrolit kuat.'],a:1,t:'kuat',e:'Jenis ikatan tidak menentukan kekuatan elektrolit; yang menentukan adalah seberapa banyak zat terionisasi.'},
{q:'Dengan disosiasi sempurna, [NO₃⁻] dalam Al(NO₃)₃ 0,20 M adalah ...',o:['0,20 M','0,40 M','0,60 M','0,80 M'],a:2,t:'kons',e:'Al(NO₃)₃ → Al³⁺ + 3NO₃⁻, sehingga [NO₃⁻] = 3 × 0,20 = 0,60 M.'}];
const FIN=[
{q:'Larutan X pada 0,1 M menyalakan lampu terang dengan banyak gelembung. Tafsiran makroskopis yang tepat adalah ...',o:['X nonelektrolit.','X mengandung banyak ion bebas pembawa muatan.','X didominasi molekul netral.','Elektron mengalir melalui larutan X.'],a:1,t:'dhl',e:'Lampu terang dan gelembung banyak menunjukkan banyak ion bebas.'},
{q:'Gambar partikel menunjukkan sebagian besar molekul CH₃COOH utuh dengan sedikit H⁺ dan CH₃COO⁻. Larutan tersebut ...',o:['elektrolit kuat.','nonelektrolit.','elektrolit kuat yang pekat.','elektrolit lemah.'],a:3,t:'kuat',e:'Hanya sebagian kecil molekul terionisasi: ciri elektrolit lemah.'},
{q:'Persamaan yang benar untuk ionisasi amonia dalam air adalah ...',o:['NH₃ + H₂O ⇌ NH₄⁺ + OH⁻','NH₃ → NH₄⁺ + OH⁻','NH₃ → N³⁻ + 3H⁺','NH₃ + H₂O → NH₄⁺ + OH⁻'],a:0,t:'dis',e:'NH₃ elektrolit lemah sehingga memakai panah kesetimbangan; atom dan muatan setara.'},
{q:'Pada 0,1 M: P menyala terang, Q redup, R padam. Simpulan yang paling tepat adalah ...',o:['P nonelektrolit dan R elektrolit kuat.','Q nonelektrolit.','P elektrolit kuat, Q elektrolit lemah, R nonelektrolit.','Ketiganya elektrolit kuat.'],a:2,t:'dhl',e:'Pada konsentrasi sama, jumlah ion berurutan P > Q > R.'},
{q:'Fungsi hidrasi ion adalah ...',o:['membentuk elektron bebas.','membuat ion kembali menyatu menjadi kristal.','mengubah molekul menjadi atom.','molekul air mengelilingi dan menstabilkan ion sehingga tidak bergabung kembali.'],a:3,t:'dis',e:'Kutub negatif air menghadap kation dan kutub positif menghadap anion.'},
{q:'Pasangan yang keduanya elektrolit kuat adalah ...',o:['CH₃COOH dan NH₃','HCl dan NaOH','glukosa dan urea','HF dan HCN'],a:1,t:'kuat',e:'HCl asam kuat dan NaOH basa kuat; lainnya elektrolit lemah atau nonelektrolit.'},
{q:'Konsentrasi ion total dalam Al₂(SO₄)₃ 0,2 M adalah ...',o:['1,0 M','0,6 M','0,4 M','2,0 M'],a:0,t:'kons',e:'Al₂(SO₄)₃ → 2Al³⁺ + 3SO₄²⁻: 5 ion × 0,2 = 1,0 M.'},
{q:'Elektrolit lemah 1 M dibandingkan elektrolit kuat 0,001 M. Pernyataan yang tepat adalah ...',o:['Elektrolit lemah pasti lebih redup.','Elektrolit kuat pasti lebih terang.','Elektrolit lemah dapat lebih terang jika ion totalnya lebih banyak.','Keduanya selalu sama terang.'],a:2,t:'kons',e:'Terang lampu mengikuti jumlah ion total, bukan hanya kekuatan elektrolit.'},
{q:'Koreksi untuk anggapan "lampu redup berarti nonelektrolit" adalah ...',o:['Anggapan itu benar.','Lampu redup menandakan ada ion bebas tetapi sedikit.','Lampu redup berarti tidak ada ion.','Lampu redup berarti elektron lemah.'],a:1,t:'mis',e:'Nonelektrolit tidak menghasilkan ion sehingga lampu padam; redup berarti ada ion dalam jumlah kecil.'},
{q:'Mengapa kekuatan elektrolit tidak boleh disimpulkan hanya dari terang lampu?',o:['Lampu selalu rusak.','Kekuatan tidak berkaitan dengan ion.','Terang ditentukan warna larutan.','Terang bergantung pada jumlah ion total yang dipengaruhi jenis zat, konsentrasi, dan kondisi uji.'],a:3,t:'mis',e:'Intensitas lampu adalah hasil gabungan beberapa faktor, bukan ukuran tunggal.'}];

/* ---------- MATERI (dari bahan ajar) ---------- */
const svgw=(b)=>`<svg class="ill" viewBox="0 0 320 110" aria-hidden="true">${b}</svg>`;
const ion=(x,y,p)=>`<circle cx="${x}" cy="${y}" r="9" fill="${p?'#f2b8a0':'#bfe3d0'}" stroke="${p?'#b5654a':'#5f8a6e'}" stroke-width="2"/><text x="${x}" y="${y+4}" font-size="12" text-anchor="middle">${p?'+':'−'}</text>`;
const mol=(x,y)=>`<circle cx="${x}" cy="${y}" r="8" fill="#ebdfc9" stroke="#a89675" stroke-width="2"/>`;
const bar=(y,w,c,l)=>`<rect x="110" y="${y}" width="${w}" height="16" rx="6" fill="${c}"/><text x="4" y="${y+13}" font-size="12">${l}</text>`;
const ILL=[
 svgw(mol(40,40)+mol(80,70)+mol(60,90)+mol(110,35)+'<text x="150" y="45" font-size="13">Gula: molekul netral</text><text x="150" y="68" font-size="13">→ lampu padam</text>'),
 svgw('<circle cx="60" cy="45" r="24" fill="#f6d9a0" stroke="#a89675"/><circle cx="160" cy="45" r="24" fill="#f6d9a0" opacity=".4" stroke="#a89675"/><circle cx="260" cy="45" r="24" fill="#eee" stroke="#a89675"/><text x="30" y="95" font-size="12">terang</text><text x="138" y="95" font-size="12">redup</text><text x="240" y="95" font-size="12">padam</text>'),
 svgw(ion(30,30,1)+ion(52,30,0)+ion(30,52,0)+ion(52,52,1)+'<text x="14" y="90" font-size="11">padat: terikat</text><path d="M95 45h40" stroke="#b5654a" stroke-width="3"/>'+[[200,30,1],[250,50,0],[210,75,0],[280,28,1]].map(a=>`<circle cx="${a[0]}" cy="${a[1]}" r="16" fill="none" stroke="#7aa5b8" stroke-dasharray="3 3"/>`+ion(...a)).join('')+'<text x="190" y="104" font-size="11">larutan: terhidrasi</text>'),
 svgw(bar(8,170,'#b5654a','Kuat')+bar(40,24,'#8fae9c','Lemah')+bar(72,3,'#a89675','Non')+'<text x="110" y="104" font-size="11">jumlah ion (ilustratif)</text>'),
 svgw(bar(20,60,'#b5654a','Ca²⁺ 0,10 M')+bar(55,120,'#8fae9c','Cl⁻ 0,20 M')+'<text x="4" y="104" font-size="11">CaCl₂ → Ca²⁺ + 2Cl⁻</text>'),
 svgw(bar(15,170,'#b5654a','HCl (kuat)')+bar(50,14,'#8fae9c','NH₃ (lemah)')+'<text x="4" y="100" font-size="11">keduanya molekuler</text>')];
const SUBS=[
{t:'Konsep Dasar',h:`<p>Larutan adalah campuran homogen: zat terlarut jumlahnya sedikit dan pelarut (air) banyak, ditulis <b>(aq)</b>. <b>Elektrolit</b> adalah zat yang larutannya menghantarkan listrik (NaCl, HCl). <b>Nonelektrolit</b> adalah zat yang larutannya tidak menghantarkan listrik (gula, etanol, glukosa, urea).</p><p>Penyebabnya adalah ion: elektrolit menghasilkan ion bebas pembawa muatan, sedangkan pada nonelektrolit zat terlarut tetap berupa molekul netral. Peristiwa dapat dilihat dari tiga sisi: <b>makroskopis</b> (lampu, gelembung), <b>submikroskopis</b> (ion atau molekul), dan <b>simbolik</b> (rumus dan persamaan).</p><p class="ex">Sehari-hari: air garam menyalakan lampu, air gula tidak.</p>`,
 more:`<p>Sebagian besar elektrolit adalah senyawa ion, tetapi ada senyawa molekuler yang juga elektrolit, misalnya HCl. Di kawat logam listrik dibawa elektron; di dalam larutan listrik dibawa <b>ion</b>: kation (Na⁺) menuju elektroda negatif, anion (Cl⁻) menuju elektroda positif. Pada nonelektrolit tidak ada muatan yang dapat bergerak.</p>`,
 q:{q:'Mengapa larutan gula tidak menyalakan lampu pada alat uji elektrolit?',o:['Gula tidak larut dalam air.','Gula tetap berupa molekul netral sehingga tidak ada ion pembawa muatan.','Gula kekurangan elektron.','Gula membentuk ion yang terlalu besar.'],a:1,t:'dhl',e:'Molekul gula tidak terionisasi, jadi tidak ada ion yang membawa muatan.',h:['Apa yang membawa muatan di dalam larutan?','Apakah gula membentuk ion dalam air?','Zat terlarut yang netral tidak membawa muatan.']}},
{t:'Uji Daya Hantar Listrik',h:`<p>Alat uji terdiri dari sumber listrik, lampu, dan dua elektroda inert. Lampu menyala jika rangkaian tertutup, yaitu bila larutan membawa muatan.</p><table><tr><th>Lampu</th><th>Gelembung</th><th>Tafsiran (konsentrasi sama)</th></tr><tr><td>Terang</td><td>Banyak</td><td>Banyak ion: elektrolit kuat</td></tr><tr><td>Redup</td><td>Sedikit</td><td>Sedikit ion: elektrolit lemah</td></tr><tr><td>Padam</td><td>Tidak ada</td><td>Tanpa ion: nonelektrolit</td></tr></table><p class="ex">Terang lampu hanya adil dibandingkan pada konsentrasi dan volume yang sama. Air keran menghantarkan karena mengandung ion terlarut.</p>`,
 more:`<p>Lampu bukan satu-satunya indikator: terang lampu dipengaruhi jenis zat, konsentrasi, dan kondisi pengujian. Air murni praktis tidak menghantarkan karena hampir tanpa ion; begitu sedikit NaCl dilarutkan, lampu menyala.</p>`,
 q:{q:'Lampu redup dan gelembung sedikit pada konsentrasi sama menunjukkan ...',o:['nonelektrolit.','elektrolit kuat pekat.','larutan tanpa zat terlarut.','ion bebas sedikit, ciri elektrolit lemah.'],a:3,t:'dhl',e:'Redup dan gelembung sedikit berarti ada ion tetapi jumlahnya kecil.',h:['Bandingkan dengan lampu padam.','Redup berarti ada muatan yang bergerak.','Ion ada, tetapi jumlahnya sedikit.']}},
{t:'Disosiasi, Hidrasi, Ionisasi',h:`<p>Molekul air polar: H sedikit positif, O sedikit negatif. Saat NaCl larut, air menguraikan kisi kristal: <b>disosiasi</b>. Setiap ion lalu dikelilingi molekul air: <b>hidrasi</b>, yang menstabilkan ion.</p><p><code>NaCl(s) → Na⁺(aq) + Cl⁻(aq)</code></p><p><b>Ionisasi</b> adalah pembentukan ion dari zat molekuler yang bereaksi dengan air, misalnya <code>HCl(aq) → H⁺(aq) + Cl⁻(aq)</code>. Gula, etanol, dan urea larut tanpa membentuk ion.</p><p class="ex">NaCl padat tidak menghantarkan listrik karena ion terikat pada kisi; lelehan dan larutannya menghantarkan karena ion bebas bergerak.</p>`,
 more:`<table><tr><th>Jenis zat</th><th>Perilaku dalam air</th><th>Contoh</th></tr><tr><td>Senyawa ion</td><td>Terdisosiasi</td><td>NaCl, KI, Ca(NO₃)₂, NaOH</td></tr><tr><td>Kovalen polar bereaksi dengan air</td><td>Terionisasi</td><td>HCl, HNO₃, CH₃COOH, NH₃</td></tr><tr><td>Kovalen tanpa ion</td><td>Tetap molekul</td><td>Glukosa, sukrosa, etanol, urea</td></tr></table>`,
 q:{q:'Mengapa NaCl padat tidak menghantarkan listrik?',o:['Ion dalam kisi terikat dan tidak bebas bergerak.','NaCl padat tidak mengandung ion.','NaCl padat nonelektrolit.','Elektron dalam NaCl padat terikat.'],a:0,t:'ion',e:'Ion ada, tetapi tidak bebas; setelah dilarutkan atau dilelehkan ion bebas bergerak.',h:['Apakah ion ada dalam kristal?','Perhatikan: bebas atau tidak bebas?','Ion terkunci pada posisinya di kisi.']}},
{t:'Elektrolit Kuat, Lemah, Nonelektrolit',h:`<p><b>Elektrolit kuat</b>: terdisosiasi/terionisasi hampir sempurna, panah tunggal (→): senyawa ion larut, HCl, HNO₃, NaOH. <b>Elektrolit lemah</b>: hanya sebagian kecil terionisasi, panah kesetimbangan (⇌): CH₃COOH, NH₃, HF. <b>Nonelektrolit</b>: tetap molekul: glukosa, etanol, urea.</p><p><code>CH₃COOH(aq) ⇌ CH₃COO⁻(aq) + H⁺(aq)</code></p><p>Pada CH₃COOH 0,10 M hanya sekitar 1,3% molekul menjadi ion, sehingga lampu redup. Panah bolak-balik menunjukkan reaksi dua arah hingga tercapai kesetimbangan.</p>`,
 more:`<p><code>NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)</code>. H₂SO₄ tergolong kuat karena ionisasi tahap pertamanya sempurna. Senyawa ion sukar larut menghasilkan sedikit ion bukan karena disosiasinya tidak sempurna, tetapi karena hanya sedikit zat yang larut.</p>`,
 q:{q:'Mengapa CH₃COOH ditulis dengan panah bolak-balik?',o:['Seluruh molekul berubah menjadi ion.','CH₃COOH tidak bereaksi dengan air.','Hanya sebagian terionisasi dan reaksi berlangsung dua arah hingga setimbang.','CH₃COOH mengandung dua jenis ion.'],a:2,t:'kuat',e:'Elektrolit lemah terionisasi sebagian dan mencapai kesetimbangan antara molekul dan ion.',h:['Berapa persen yang menjadi ion?','Sebagian ion bergabung kembali.','Dua arah → kesetimbangan.']}},
{t:'Konsentrasi dan Perhitungan Ion',h:`<p><b>Konsentrasi (molaritas)</b> = mol zat terlarut per liter larutan. <b>Kekuatan elektrolit</b> = persentase zat yang terdisosiasi/terionisasi. Keduanya berbeda.</p><p>Untuk elektrolit kuat (disosiasi sempurna dianggap), konsentrasi ion = molaritas × koefisien ion pada persamaan disosiasi.</p><p class="ex">CaCl₂ 0,10 M: CaCl₂ → Ca²⁺ + 2Cl⁻, sehingga [Ca²⁺] = 0,10 M dan [Cl⁻] = 2 × 0,10 = 0,20 M.</p>`,
 more:`<p>Na₂SO₄ 0,350 M → 2Na⁺ + SO₄²⁻: [Na⁺] = 0,700 M, [SO₄²⁻] = 0,350 M, ion total = 1,05 M. Elektrolit kuat yang sangat encer dapat lebih redup daripada elektrolit lemah yang pekat.</p>`,
 q:{q:'[Cl⁻] dalam CaCl₂ 0,10 M adalah ...',o:['0,10 M','0,20 M','0,30 M','0,050 M'],a:1,t:'kons',e:'Koefisien Cl⁻ adalah 2: 2 × 0,10 = 0,20 M.',h:['Tulis persamaan disosiasinya.','Lihat koefisien Cl⁻.','Kalikan 0,10 M dengan koefisien Cl⁻.']}},
{t:'Miskonsepsi dan Pengayaan',h:`<p><b>HCl vs NH₃</b>: keduanya zat molekuler, tetapi HCl elektrolit kuat (terionisasi hampir sempurna) dan NH₃ elektrolit lemah (sebagian kecil). Jenis ikatan atau wujud awal tidak menentukan kekuatan elektrolit; yang menentukan adalah seberapa banyak zat terionisasi dalam air.</p><table><tr><th>Anggapan keliru</th><th>Konsep benar</th></tr><tr><td>Yang mengalir dalam larutan adalah elektron</td><td>Pembawa muatan adalah ion</td></tr><tr><td>Elektrolit kuat berarti pekat</td><td>Kekuatan ≠ konsentrasi</td></tr><tr><td>Air suling menghantarkan karena H⁺ dan OH⁻</td><td>Ion sangat sedikit, praktis tidak menghantarkan</td></tr></table>`,
 more:`<p>Pengayaan: sifat koligatif bergantung pada jumlah partikel. Nonelektrolit (sukrosa) i = 1; NaCl 0,05 m terukur i ≈ 1,9 bukan 2,0 karena pasangan ion. Dibahas lagi di Kelas XII.</p>`,
 q:{q:'Mengapa HCl dan NH₃ menunjukkan daya hantar listrik berbeda?',o:['HCl ionik dan NH₃ molekuler.','NH₃ tidak larut dalam air.','Keduanya elektrolit kuat.','Keduanya molekuler, tetapi HCl terionisasi hampir sempurna dan NH₃ hanya sebagian kecil.'],a:3,t:'mis',e:'Perbedaan terletak pada derajat ionisasi dalam air, bukan jenis ikatan.',h:['Apakah keduanya molekuler?','Bandingkan banyaknya ion yang terbentuk.','Yang berbeda adalah derajat ionisasi.']}}];

/* ---------- DATA ZAT VIRTUAL LAB (EDIT di sini) ---------- */
// c: kuat|lemah|non|tap ; n: jumlah ion per satuan rumus ; sub: indeks subtopik penjelasan
const SUB=[
{id:'NaCl',nm:'NaCl',c:'kuat',n:2,melt:true,sub:2,eq:'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',pn:1,nn:1,P:'Na⁺',N:'Cl⁻'},
{id:'HCl',nm:'HCl',c:'kuat',n:2,sub:3,eq:'HCl(aq) → H⁺(aq) + Cl⁻(aq)',pn:1,nn:1,P:'H⁺',N:'Cl⁻'},
{id:'NaOH',nm:'NaOH',c:'kuat',n:2,melt:true,sub:3,eq:'NaOH(s) → Na⁺(aq) + OH⁻(aq)',pn:1,nn:1,P:'Na⁺',N:'OH⁻'},
{id:'CaCl2',nm:'CaCl₂',c:'kuat',n:3,melt:true,sub:4,eq:'CaCl₂(s) → Ca²⁺(aq) + 2Cl⁻(aq)',pn:1,nn:2,P:'Ca²⁺',N:'Cl⁻'},
{id:'CH3COOH',nm:'CH₃COOH',c:'lemah',n:2,sub:3,eq:'CH₃COOH(aq) ⇌ H⁺(aq) + CH₃COO⁻(aq)',pn:1,nn:1,P:'H⁺',N:'CH₃COO⁻'},
{id:'NH3',nm:'NH₃',c:'lemah',n:2,sub:5,eq:'NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)',pn:1,nn:1,P:'NH₄⁺',N:'OH⁻'},
{id:'Glu',nm:'Glukosa',c:'non',n:0,sub:0,eq:'C₆H₁₂O₆(aq): tetap sebagai molekul (tanpa ionisasi berarti)'},
{id:'Eta',nm:'Etanol',c:'non',n:0,sub:0,eq:'C₂H₅OH(aq): tetap sebagai molekul (tanpa ionisasi berarti)'},
{id:'Ure',nm:'Urea',c:'non',n:0,sub:0,eq:'(NH₂)₂CO(aq): tetap sebagai molekul (tanpa ionisasi berarti)'},
{id:'Dist',nm:'Air suling',c:'non',n:0,fixed:1,sub:1,eq:'H₂O(l): ion sangat sedikit, praktis tidak menghantarkan'},
{id:'Tap',nm:'Air keran',c:'tap',n:0,fixed:1,sub:1,eq:'Mengandung ion terlarut (misalnya Ca²⁺, Mg²⁺, HCO₃⁻, Cl⁻); jumlahnya bergantung sumber air'}];
const KLAS={kuat:'Elektrolit kuat',lemah:'Elektrolit lemah',non:'Nonelektrolit',tap:'Elektrolit (bergantung ion terlarut)'};
const gs=id=>SUB.find(x=>x.id===id);
const conc=v=>Math.pow(10,-3+3*v/100);
const fmt=c=>(c>=0.1?c.toFixed(2):c>=0.01?c.toFixed(3):c.toFixed(4)).replace('.',',');
// MODEL ILUSTRATIF (bukan data eksperimen nyata): I = ion/(ion+0,01). Elektrolit lemah: alpha ≈ 0,013·√(0,1/c).
function model(s,c,mode){
 if(mode==='melt'&&s.melt)return{I:.95,ions:1,a:1};
 if(mode==='solid')return{I:0,ions:0,a:0};
 let ions=0,a=1;
 if(s.c==='kuat')ions=c*s.n;
 else if(s.c==='lemah'){a=Math.min(1,.013*Math.sqrt(.1/c));ions=c*a*2}
 else if(s.id==='Dist')ions=1e-5; else if(s.id==='Tap')ions=.005;
 return{I:ions/(ions+.01),ions,a};
}
const lamp=I=>I>.6?'terang':I>.05?'redup':'padam';

/* ---------- UI DASAR ---------- */
const D=[()=>S.started,()=>S.diag.length>=5,()=>Object.keys(S.qc).length>=6,()=>!!S.aper.fu,()=>Object.keys(S.pred).length>=11,()=>new Set(S.tests.map(t=>t.id)).size>=4,()=>S.critOk,()=>Object.values(S.eq).filter(Boolean).length>=5&&!!S.calc.done&&!!S.myst.done,()=>S.form.length>=5&&S.fin.length>=10];
let R=[];
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),3200)}
function openModal(t,h){$('#mtitle').textContent=t;$('#mbody').innerHTML=h;$('#modal').hidden=false;$('#mclose').focus()}
$('#mclose').onclick=()=>$('#modal').hidden=true;
$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').hidden=true};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').hidden=true});
$$('[data-logo]').forEach(e=>e.innerHTML=LOGO);
$$('.devs').forEach(u=>u.innerHTML=DEV.map((d,i)=>`<li>${i+1}. ${d}</li>`).join(''));
function steps(){
 $('#steps').innerHTML=STEPS.map((n,i)=>{const ok=[...Array(i).keys()].every(j=>D[j]());const dn=D[i]();return `<button data-i="${i}" class="${i===S.stage?'cur':dn?'done':''} ${ok?'':'lock'}" aria-label="Tahap ${i+1} ${n}${dn?' selesai':ok?'':' terkunci'}">${dn?'✓':ok?'':'🔒'} 0${i+1} ${n}</button>`}).join('');
 $$('#steps button').forEach(b=>b.onclick=()=>tryGo(+b.dataset.i));
 const k=D.filter(f=>f()).length,p=Math.round(k/9*100);$('#pfill').style.width=p+'%';$('#ptxt').textContent=`${k} dari 9 tahap selesai`;$('.pbar').setAttribute('aria-valuenow',p);
 $('#prev').disabled=S.stage===0;$('#next').hidden=S.stage===8;
}
function tryGo(n){for(let i=0;i<n;i++)if(!D[i]()){toast('Tahap '+(i+1)+' belum selesai: '+REQ[i]);return}go(n)}
function go(n){S.stage=n;save();steps();R[n]();window.scrollTo(0,0);$('#stage').focus({preventScroll:true})}
$('#prev').onclick=()=>go(S.stage-1);$('#next').onclick=()=>tryGo(S.stage+1);
$('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$$('#menu button').forEach(b=>b.onclick=()=>{$('#menu').classList.remove('open');({home:()=>go(0),pocket:pocket,gloss:gloss,help:help,reset:()=>{if(confirm('Hapus SEMUA progres, jawaban, dan data pengujian di browser ini? Tindakan ini tidak dapat dibatalkan.')){S=blank();save();location.reload()}}})[b.dataset.act]()});

/* ---------- LOGIN ---------- */
function enter(){
  const login = $('#login');
  const app = $('#app');

  login.classList.add('login-exit');

  setTimeout(() => {
    login.hidden = true;
    app.hidden = false;

    app.classList.add('app-enter');

    // Setelah login, selalu masuk ke halaman AWAL
    S.stage = 0;
    save();
    go(0);

    setTimeout(() => {
      app.classList.remove('app-enter');
    }, 700);
  }, 500);
}
if(S.name){$('#resume').hidden=false;$('#rname').textContent=S.name;$('#inName').value=S.name;$('#inClass').value=S.kelas}
$('#btnResume').onclick=enter;
$('#btnRestart').onclick=()=>{if(confirm('Mulai ulang akan menghapus seluruh progres sebelumnya. Lanjutkan?')){S=blank();save();$('#resume').hidden=true;$('#inName').value='';$('#inClass').value=''}};
$('#btnStart').onclick=()=>{const n=$('#inName').value.trim();if(!n){$('#loginErr').textContent='Nama lengkap tidak boleh kosong.';$('#inName').focus();return}
 $('#loginErr').textContent='';if(S.name&&n!==S.name&&!confirm('Nama berbeda dari progres tersimpan. Progres lama akan dihapus. Lanjutkan?'))return;
 if(S.name&&n!==S.name)S=blank();S.name=n;S.kelas=$('#inClass').value.trim();save();enter()};

/* ---------- KUIS GENERIK (umpan balik + lanjut otomatis) ---------- */
function quiz(host,qs,arr,done){
 (function show(){
  const i=arr.length;if(i>=qs.length){done();return}const q=qs[i];
  host.innerHTML=`<div class="card"><p class="muted">Soal ${i+1} dari ${qs.length}</p><h3>${q.q}</h3><div class="opts">${q.o.map((t,k)=>`<button class="opt" data-k="${k}"><b>${'ABCD'[k]}.</b> ${t}</button>`).join('')}</div><div class="fb" aria-live="polite"></div></div>`;
  $$('.opt',host).forEach(b=>b.onclick=()=>{const k=+b.dataset.k,bs=$$('.opt',host);bs.forEach(x=>x.disabled=true);bs[q.a].classList.add('ok');if(k!==q.a)b.classList.add('bad');
   arr.push(k);save();steps();$('.fb',host).innerHTML=fbHtml(k===q.a,q.e)+'<p class="muted">Soal berikutnya muncul otomatis…</p>';
   setTimeout(()=>{if(host.isConnected)show()},4000+q.e.length*25)});
 })();
}
const pct=(arr,qs)=>Math.round(100*arr.filter((k,i)=>k===qs[i].a).length/qs.length);

/* ---------- TAHAP 1–2 ---------- */
R[0]=()=>{$('#stage').innerHTML=`<section class="card hero">${LOGO}<h1>ION LAB — Menyelidiki Larutan Elektrolit dan Nonelektrolit</h1><p class="sub">“Mari cari tahu mengapa beberapa larutan dapat menghantarkan listrik.”</p><button class="btn big" id="go1">Mulai Belajar</button></section>
<section class="card"><h2>Tujuan Pembelajaran</h2><p>Siswa mampu:</p><ol><li>Membedakan larutan elektrolit dan nonelektrolit.</li><li>Menjelaskan hubungan keberadaan ion dengan daya hantar listrik.</li><li>Membedakan elektrolit kuat dan elektrolit lemah.</li><li>Menganalisis hasil pengujian daya hantar listrik.</li><li>Menjelaskan disosiasi, hidrasi, dan ionisasi.</li><li>Menghubungkan representasi makroskopis, submikroskopis, dan simbolik.</li></ol></section>
<section class="card"><h2>Petunjuk Singkat</h2><ol><li>Kerjakan sembilan tahap berurutan; tahap berikutnya terbuka jika syarat terpenuhi.</li><li>Jawab soal dan baca umpan balik dengan teliti.</li><li>Buka Buku Saku, Glosarium, atau Bantuan kapan saja — progres tidak hilang.</li></ol></section>
<section class="card"><h2>Pengembang</h2><ul class="devs">${DEV.map((d,i)=>`<li>${i+1}. ${d}</li>`).join('')}</ul></section>`;
 $('#go1').onclick=()=>{S.started=true;save();go(1)}};
function diagDone(h){const wr=S.diag.map((k,i)=>k!==DIAG[i].a?DIAG[i]:null).filter(Boolean),sc=S.diag.filter((k,i)=>k===DIAG[i].a).length;
 const tp=[...new Set(wr.map(q=>TOP[q.t]))];
 h.innerHTML=`<div class="card"><h2>Hasil Diagnostik</h2><p class="score">${sc} / 5 benar (skor ${sc*20})</p>${wr.length?`<p><b>Miskonsepsi yang teridentifikasi:</b></p><ul>${wr.map(q=>`<li>${q.m}</li>`).join('')}</ul><p class="note">Kamu perlu mempelajari kembali: ${tp.join(', ')}.</p>`:'<p class="note">Semua jawaban benar. Tetap lanjutkan ke materi untuk memperdalam konsep.</p>'}<button class="btn" id="toMat">Lanjut ke Materi →</button></div>`;$('#toMat').onclick=()=>go(2);steps()}
R[1]=()=>{$('#stage').innerHTML='<h2 style="margin:6px 0">Asesmen Diagnostik</h2><div id="qh"></div>';quiz($('#qh'),DIAG,S.diag,()=>diagDone($('#qh')))};

/* ---------- TAHAP 3: MATERI ---------- */
R[2]=()=>{const i=S.sub,s=SUBS[i],q=s.q,done=Object.keys(S.qc).length,ans=S.qc[i];
 $('#stage').innerHTML=`<p><b>Materi ${done} dari 6 selesai</b></p><div class="tabs">${SUBS.map((x,k)=>`<button data-k="${k}" class="${k===i?'cur':''}">${S.qc[k]!==undefined?'✓ ':''}${k+1}. ${x.t}</button>`).join('')}</div>
 <section class="card"><h2>Subtopik ${i+1} — ${s.t}</h2>${ILL[i]}${s.h}<button class="btn ghost sm" id="more">Buka Materi Lengkap</button> <a class="btn ghost sm" href="${GDOCS}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Bahan tambahan (Google Docs)</a></section>
 <section class="card"><h3>Cek Cepat</h3><p>${q.q}</p><div class="opts">${q.o.map((t,k)=>`<button class="opt" data-o="${k}" ${ans!==undefined?'disabled':''}><b>${'ABCD'[k]}.</b> ${t}</button>`).join('')}</div>${ans===undefined?`<div id="hints"></div><button class="btn ghost sm" id="hbtn">Petunjuk (<span id="hn">1</span>/3)</button>`:''}<div id="fb"></div></section>
 <button class="btn ghost" id="ps" ${i?'':'disabled'}>← Subtopik Sebelumnya</button><button class="btn" id="ns" ${i<5?'':'disabled'}>Subtopik Berikutnya →</button>`;
 $$('.tabs button').forEach(b=>b.onclick=()=>{S.sub=+b.dataset.k;R[2]()});$('#ps').onclick=()=>{S.sub--;R[2]()};$('#ns').onclick=()=>{S.sub++;R[2]()};
 $('#more').onclick=()=>openModal(s.t,s.h+s.more);
 if(ans!==undefined){$$('.opt')[q.a].classList.add('ok');if(ans!==q.a)$$('.opt')[ans].classList.add('bad');$('#fb').innerHTML=fbHtml(ans===q.a,q.e)}
 else{let hl=0;$('#hbtn').onclick=()=>{if(hl<3){$('#hints').insertAdjacentHTML('beforeend',`<p class="hint"><b>Petunjuk ${hl+1}:</b> ${q.h[hl]}</p>`);hl++;$('#hn').textContent=Math.min(hl+1,3);if(hl>=3)$('#hbtn').disabled=true}};
  $$('[data-o]').forEach(b=>b.onclick=()=>{S.qc[i]=+b.dataset.o;save();steps();R[2]()})}};

/* ---------- TAHAP 4: APERSEPSI ---------- */
const ionSvg=(p,n,m)=>svgw([...Array(p)].map((_,k)=>ion(30+k*28,30+(k%2)*30,1)).join('')+[...Array(n)].map((_,k)=>ion(30+k*28,60+(k%2)*25,0)).join('')+[...Array(m)].map((_,k)=>mol(220+k*22,50)).join(''));
const BR={hujan:{t:'Air hujan',s:'Kamu memilih air hujan. Air hujan melarutkan gas dan debu dari udara, sehingga mengandung sedikit ion terlarut. Daya hantarnya rendah, tetapi tidak nol. Ketika tangan basah, keringat dan garam di kulit menambah ion; arus tetap dapat mengalir melalui tubuh.',ill:ionSvg(2,2,6),fu:{q:'Mengapa tangan basah oleh air hujan tetap berbahaya?',o:['Karena air hujan nonelektrolit murni.','Karena ion dari air hujan dan garam di kulit membuat lapisan air menghantarkan listrik.','Karena air hujan berisi elektron bebas.'],a:1,e:'Ion terlarut (dari air dan kulit) berfungsi sebagai pembawa muatan.'}},
 laut:{t:'Air laut',s:'Kamu memilih air laut. Air laut kaya ion Na⁺ dan Cl⁻ serta ion lain, sehingga menghantarkan listrik dengan baik. Tangan basah air laut sangat berbahaya di dekat peralatan listrik: banyak ion siap membawa muatan.',ill:ionSvg(6,6,0),fu:{q:'Apa yang membuat air laut menghantarkan listrik dengan baik?',o:['Banyaknya molekul netral.','Banyaknya ion terlarut yang bebas bergerak.','Adanya elektron bebas dalam air.'],a:1,e:'Garam terdisosiasi menjadi ion bebas yang membawa muatan.'}},
 suling:{t:'Air suling',s:'Kamu memilih air suling. Air suling murni praktis hampir tidak menghantarkan listrik karena ionnya sangat sedikit. Tetapi tangan basah tidak pernah benar-benar air suling murni: air melarutkan keringat, debu, dan garam dari kulit atau permukaan alat, sehingga ion muncul dan bahaya tetap ada.',ill:ionSvg(0,0,7),fu:{q:'Mengapa air suling di tangan tidak boleh dianggap aman?',o:['Air suling selalu menghantarkan sangat baik.','Air suling melarutkan zat dari kulit dan permukaan sehingga mengandung ion.','Air suling mengandung elektron bebas.'],a:1,e:'Air suling murni sangat buruk menghantarkan, tetapi kontaminasi ion mengubahnya.'}}};
R[3]=()=>{const c=S.aper.ch,b=BR[c];
 $('#stage').innerHTML=`<section class="card"><h2>Apersepsi</h2><p><b>Mengapa tangan basah berbahaya saat memegang alat listrik, padahal air suling memiliki daya hantar listrik yang sangat rendah?</b></p><p>Pilih air yang membasahi tanganmu:</p>${Object.entries(BR).map(([k,v])=>`<button class="btn ${c===k?'':'ghost'}" data-b="${k}">${v.t}</button>`).join('')}</section>${b?`<section class="card"><h3>${b.t}</h3>${b.ill}<p>${b.s}</p><p class="note">Ingat: jangan pernah menyentuh peralatan listrik dengan tangan basah.</p><h3>Pertanyaan lanjutan</h3><p>${b.fu.q}</p><div class="opts">${b.fu.o.map((t,k)=>`<button class="opt" data-f="${k}" ${S.aper.fu?'disabled':''}>${t}</button>`).join('')}</div><div id="fb"></div></section>`:''}`;
 $$('[data-b]').forEach(x=>x.onclick=()=>{S.aper={ch:x.dataset.b};save();steps();R[3]()});
 if(b){if(S.aper.fu){$$('[data-f]')[b.fu.a].classList.add('ok');$('#fb').innerHTML=fbHtml(true,b.fu.e)}
  $$('[data-f]').forEach(x=>x.onclick=()=>{const k=+x.dataset.f;if(k!==b.fu.a){x.classList.add('bad');$('#fb').innerHTML=fbHtml(false,'Pikirkan: apa yang membawa muatan di dalam larutan? Coba pilihan lain.');return}
   S.aper.fu=1;save();steps();R[3]()})}};

/* ---------- DRAG & DROP GENERIK (seret atau sentuh) ---------- */
function dnd(root,onMove,mode){let sel=null;
 root.addEventListener('dragstart',e=>{const c=e.target.closest('.chip');if(c){sel=c;e.dataTransfer.setData('text/plain','x')}});
 root.addEventListener('dragover',e=>{if(e.target.closest('.zone'))e.preventDefault()});
 root.addEventListener('drop',e=>{const z=e.target.closest('.zone');if(z&&sel){e.preventDefault();z.appendChild(sel);sel.classList.remove('sel');sel=null;onMove()}});
 root.addEventListener('click',e=>{const c=e.target.closest('.chip'),z=e.target.closest('.zone');
  if(c&&mode==='toggle'){const b=c.closest('.eqb'),w=c.parentNode.dataset.z==='pool'?'ans':'pool';$(`.zone[data-z="${w}"]`,b).appendChild(c);onMove();return}
  if(c){if(sel)sel.classList.remove('sel');sel=sel===c?null:c;if(sel)sel.classList.add('sel');return}
  if(z&&sel){z.appendChild(sel);sel.classList.remove('sel');sel=null;onMove()}})}

/* ---------- TAHAP 5: PREDIKSI ---------- */
R[4]=()=>{const z=(k,t)=>`<div class="zone" data-z="${k}"><h4>${t}</h4><button class="btn sm ghost" data-z="${k}" style="display:none">Taruh di sini</button></div>`;
 $('#stage').innerHTML=`<section class="card"><h2>Prediksi: kelompokkan zat</h2><p>Seret zat ke kelompok yang menurutmu tepat. Di layar sentuh: ketuk zat, lalu ketuk kelompok tujuan. Kamu boleh mengubah penempatan. Ini <b>prediksi</b>, bukan hasil eksperimen — buktinya ada di Virtual Lab.</p><p class="note">Air keran: daya hantarnya bergantung pada kandungan ion terlarut dan dapat berbeda menurut sumber air.</p>
 <div class="zone pool" data-z="pool"><h4>Zat belum dikelompokkan</h4></div><div class="zones">${z('kuat','ELEKTROLIT KUAT')}${z('lemah','ELEKTROLIT LEMAH')}${z('non','NONELEKTROLIT')}</div><p id="pc" class="muted"></p></section>`;
 SUB.forEach(s=>{const c=document.createElement('span');c.className='chip';c.draggable=true;c.tabIndex=0;c.dataset.id=s.id;c.textContent=s.nm;$(`.zone[data-z="${S.pred[s.id]||'pool'}"]`).appendChild(c)});
 const upd=()=>{S.pred={};$$('.chip').forEach(c=>{const k=c.parentNode.dataset.z;if(k!=='pool')S.pred[c.dataset.id]=k});save();steps();$('#pc').textContent=`${Object.keys(S.pred).length} dari 11 zat sudah ditempatkan (tersimpan otomatis).`};
 dnd($('#stage'),upd,'pick');upd()};

/* ---------- TAHAP 6: VIRTUAL LAB ---------- */
let lab={id:'NaCl',mode:'solution',v:50,on:false,ps:[],bub:[]};
function labBuild(){const s=gs(lab.id),c=conc(lab.v),ps=[],rnd=(a,b)=>a+Math.random()*(b-a);
 const add=(k,n,fixed)=>{for(let i=0;i<n;i++)ps.push({k,x:rnd(130,390),y:rnd(90,260),vx:rnd(-.4,.4),vy:rnd(-.4,.4)})};
 const nf=Math.max(2,Math.round(2+10*(Math.log10(c)+3)/3));
 if(lab.mode==='solid'&&s.melt){for(let i=0;i<5;i++)for(let j=0;j<4;j++)ps.push({k:(i+j)%2?'n':'p',x:160+i*50,y:100+j*45,vx:0,vy:0,fix:1})}
 else if(lab.mode==='melt'&&s.melt){add('p',7);add('n',7)}
 else if(lab.mode==='solution'){
  if(s.c==='kuat'){add('p',nf*s.pn);add('n',nf*s.nn)}
  else if(s.c==='lemah'){const w=Math.max(1,Math.min(nf,Math.round(nf*model(s,c,'solution').a*5)));add('p',w);add('n',w);add('m',nf)}
  else if(s.c==='non')add('m',s.fixed?3:nf+2);
  else{add('p',2);add('n',2);add('m',3)}}
 lab.ps=ps;lab.bub=[]}
function labUpdate(){const s=gs(lab.id),c=s.fixed?(s.id==='Dist'?1e-5:.005):conc(lab.v),m=model(s,conc(lab.v),lab.mode),ok=lab.mode==='solution'||s.melt;
 $('#cv-val').textContent=s.fixed?'tetap (tidak diatur)':fmt(conc(lab.v))+' M';$('#cv-sl').disabled=!!s.fixed||lab.mode!=='solution';
 const md={solid:'padat',melt:'lelehan',solution:'larutan'}[lab.mode];
 let mac=!ok?`Pada kondisi biasa ${s.nm} tidak diuji dalam wujud ${md}: HCl dan NH₃ murni berupa gas molekuler, etanol berupa cairan, sedangkan glukosa dan urea padat berupa molekul netral tanpa ion bebas.`:!lab.on?'Tekan “Uji Larutan” untuk menutup rangkaian.':`Lampu <b>${lamp(m.I)}</b> (intensitas model ${m.I.toFixed(2)}); gelembung ${m.I>.6?'banyak':m.I>.05?'sedikit':'tidak ada/sangat sedikit'}. Status: ${m.I>.05?'menghantarkan listrik':'daya hantar sangat rendah / tidak terdeteksi'}.`;
 let sm=lab.mode==='solid'&&s.melt?'Ion berada pada posisi relatif tetap di kisi dan tidak bebas bergerak sebagai pembawa muatan.':lab.mode==='melt'&&s.melt?'Ion dapat bergerak bebas sehingga dapat menghantarkan listrik.':!ok?'—':s.c==='kuat'?'Proporsi ion besar; ion terhidrasi bergerak menuju elektroda berlawanan muatan.':s.c==='lemah'?'Sebagian besar masih molekul; hanya sebagian kecil terionisasi.':s.c==='tap'?'Ion terlarut dalam jumlah kecil–sedang, bergantung sumber air.':'Molekul netral; tanpa pembentukan ion berarti.';
 let sy=lab.mode==='melt'&&s.melt?s.eq.replace(/\(s\)/g,'(l)').replace(/\(aq\)/g,'(l)'):lab.mode==='solid'&&s.melt?s.nm+'(s): ion terikat dalam kisi kristal':s.eq;
 $('#macro').innerHTML=mac;$('#micro').textContent=sm+' (Jumlah partikel adalah model konseptual.)';$('#sym').textContent=ok?sy:'—';$('#utest').disabled=!ok;
 $('#expl').onclick=()=>openModal(SUBS[s.sub].t,SUBS[s.sub].h+SUBS[s.sub].more)}
function labTable(){const rows=S.tests.map(t=>`<tr><td>${gs(t.id).nm}</td><td>${t.fixed?'—':fmt(t.c)+' M'} (${{solid:'padat',melt:'lelehan',solution:'larutan'}[t.mode]})</td><td>${t.pred?KLAS[t.pred]:'Belum diprediksi'}</td><td>${t.res}</td><td>${t.match==null?'—':t.match?'✓ Cocok':'✗ Beda'}</td></tr>`).join('');
 $('#ttab').innerHTML=rows||'<tr><td colspan="5">Belum ada pengujian.</td></tr>'}
function labLoop(){const cv=$('#cv');if(!cv)return;const g=cv.getContext('2d'),s=gs(lab.id),m=model(s,conc(lab.v),lab.mode),ok=lab.mode==='solution'||s.melt,L=100,Rr=420,sp=matchMedia('(prefers-reduced-motion:reduce)').matches?.3:1;
 g.clearRect(0,0,520,300);g.fillStyle=lab.mode==='melt'?'#f7dcc8':lab.mode==='solid'?'#efe6d6':'#dff0ea';g.fillRect(60,70,400,215);g.strokeStyle='#8a7a6a';g.lineWidth=3;g.strokeRect(60,70,400,215);
 g.fillStyle='#7d7d7d';g.fillRect(L-5,30,10,200);g.fillRect(Rr-5,30,10,200);g.fillStyle='#333';g.font='bold 16px sans-serif';g.fillText('−',L-4,24);g.fillText('+',Rr-5,24);
 g.strokeStyle='#555';g.lineWidth=2;g.beginPath();g.moveTo(L,30);g.lineTo(L,12);g.lineTo(235,12);g.moveTo(285,12);g.lineTo(Rr,12);g.lineTo(Rr,30);g.stroke();
 const I=ok&&lab.on?m.I:0;g.save();g.shadowColor='rgba(246,196,112,.9)';g.shadowBlur=26*I;g.fillStyle=lab.on?`rgba(246,200,120,${.12+.88*I})`:'#eee';g.beginPath();g.arc(260,12,16,0,7);g.fill();g.restore();g.strokeStyle='#8a7a6a';g.beginPath();g.arc(260,12,16,0,7);g.stroke();
 if(ok&&lab.on&&I>.05&&Math.random()<I*.25*sp){lab.bub.push({x:L+(Math.random()<.5?-9:9),y:225,r:2+Math.random()*2});lab.bub.push({x:Rr+(Math.random()<.5?-9:9),y:225,r:2+Math.random()*2})}
 g.fillStyle='rgba(255,255,255,.85)';g.strokeStyle='#7aa5b8';lab.bub=lab.bub.filter(b=>(b.y-=1.2*sp)>72);lab.bub.forEach(b=>{g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill();g.stroke()});
 if(ok)lab.ps.forEach(p=>{if(!p.fix){p.x+=(p.vx+(lab.on&&m.I>.01?(p.k==='p'?-.5:p.k==='n'?.5:0):0))*sp;p.y+=p.vy*sp;if(Math.random()<.05){p.vx+=(Math.random()-.5)*.3;p.vy+=(Math.random()-.5)*.3}
  p.vx=Math.max(-.7,Math.min(.7,p.vx));p.vy=Math.max(-.7,Math.min(.7,p.vy));if(p.x<75||p.x>445)p.vx*=-1,p.x=Math.max(75,Math.min(445,p.x));if(p.y<85||p.y>270)p.vy*=-1,p.y=Math.max(85,Math.min(270,p.y))}
  if(p.k==='m'){g.fillStyle='#ebdfc9';g.strokeStyle='#a89675';g.beginPath();g.arc(p.x,p.y,7,0,7);g.fill();g.stroke()}
  else{if(lab.mode==='solution'){g.strokeStyle='rgba(122,165,184,.7)';g.setLineDash([3,3]);g.beginPath();g.arc(p.x,p.y,14,0,7);g.stroke();g.setLineDash([])}
   g.fillStyle=p.k==='p'?'#f2b8a0':'#bfe3d0';g.strokeStyle=p.k==='p'?'#b5654a':'#5f8a6e';g.beginPath();g.arc(p.x,p.y,8,0,7);g.fill();g.stroke();g.fillStyle='#333';g.font='12px sans-serif';g.fillText(p.k==='p'?'+':'−',p.x-4,p.y+4)}});
 requestAnimationFrame(labLoop)}
R[5]=()=>{$('#stage').innerHTML=`<section class="card"><h2>Laboratorium Virtual ION LAB</h2><p class="muted">Intensitas lampu adalah <b>model ilustratif</b>, bukan hasil eksperimen nyata. Terang lampu gabungan jenis zat, konsentrasi, proporsi ion, mobilitas ion, dan kondisi uji — bukan ukuran tunggal konsentrasi atau kekuatan elektrolit.</p>
 <div class="lab"><div><canvas id="cv" width="520" height="300" aria-label="Bejana uji dengan elektroda, lampu, dan partikel"></canvas><p class="muted">Lingkaran putus-putus = hidrasi. Ion bergerak menuju elektroda berlawanan muatan (tidak ada elektron bebas di larutan).</p></div>
 <div><label for="sel">Zat</label><select id="sel">${SUB.map(s=>`<option value="${s.id}" ${s.id===lab.id?'selected':''}>${s.nm}</option>`).join('')}</select>
 <label>Wujud/mode</label><div>${[['solid','Padat'],['melt','Lelehan'],['solution','Larutan']].map(([k,t])=>`<label style="display:inline-block;margin-right:8px"><input type="radio" name="mode" value="${k}" style="width:auto" ${lab.mode===k?'checked':''}> ${t}</label>`).join('')}</div>
 <label for="cv-sl">Konsentrasi: <b id="cv-val"></b></label><input type="range" id="cv-sl" min="0" max="100" value="${lab.v}"><button class="btn" id="utest">Uji Larutan</button><button class="btn ghost" id="expl">Lihat Penjelasan</button></div></div></section>
 <section class="card"><h3>Tiga representasi</h3><p><b>Makroskopis:</b> <span id="macro"></span></p><p><b>Submikroskopis:</b> <span id="micro"></span></p><p><b>Simbolik:</b> <code id="sym"></code></p></section>
 <section class="card"><h3>Tabel hasil pengujian</h3><div class="tw"><table><tr><th>Zat</th><th>Konsentrasi</th><th>Prediksiku</th><th>Hasil</th><th>Cocok/Beda</th></tr><tbody id="ttab"></tbody></table></div><p class="muted">Uji minimal 4 zat berbeda. “Prediksiku” diambil dari tahap 5; hasil adalah keluaran model, bukan bukti eksperimen nyata.</p></section>`;
 const re=(on)=>{lab.on=on;labBuild();labUpdate()};
 $('#sel').onchange=e=>{lab.id=e.target.value;if(gs(lab.id).fixed)lab.mode='solution',$$('[name=mode]').forEach(r=>r.checked=r.value==='solution');re(false)};
 $$('[name=mode]').forEach(r=>r.onchange=()=>{lab.mode=r.value;re(false)});
 $('#cv-sl').oninput=e=>{lab.v=+e.target.value;const on=lab.on;labBuild();lab.on=on;labUpdate()};
 $('#utest').onclick=()=>{const s=gs(lab.id),m=model(s,conc(lab.v),lab.mode),p=S.pred[s.id]||null;
  lab.on=true;S.tests.push({id:s.id,c:conc(lab.v),fixed:!!s.fixed,mode:lab.mode,pred:p,res:`Lampu ${lamp(m.I)}; ${KLAS[s.c]}`,match:p?(s.c==='tap'?p!=='non':p===s.c):null});save();steps();labUpdate();labTable()};
 labBuild();labUpdate();labTable();labLoop()};

/* ---------- TAHAP 7: ANALISIS ---------- */
function chart(){const W=560,H=300,L=56,B=44,T=14,Rm=14,pw=W-L-Rm,ph=H-T-B,X=c=>L+pw*(Math.log10(c)+3)/3,Y=i=>T+ph*(1-i);
 const cur=id=>{let d='';for(let v=0;v<=100;v+=2){const c=conc(v);d+=(v?'L':'M')+X(c).toFixed(1)+' '+Y(model(gs(id),c,'solution').I).toFixed(1)}return d};
 const pts=S.tests.filter(t=>t.mode==='solution'&&!t.fixed&&['kuat','lemah'].includes(gs(t.id).c)).map(t=>`<circle cx="${X(t.c)}" cy="${Y(model(gs(t.id),t.c,'solution').I)}" r="5" fill="${gs(t.id).c==='kuat'?'#b5654a':'#4f8a6e'}" stroke="#fff"/>`).join('');
 const a=model(gs('HCl'),.001,'solution').I,b=model(gs('CH3COOH'),1,'solution').I;
 return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:640px" role="img" aria-label="Grafik konsentrasi vs intensitas cahaya"><rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="#fff" stroke="#cdbb98"/>${[.001,.01,.1,1].map(c=>`<line x1="${X(c)}" x2="${X(c)}" y1="${T}" y2="${T+ph}" stroke="#eee"/><text x="${X(c)}" y="${T+ph+16}" font-size="11" text-anchor="middle">${String(c).replace('.',',')}</text>`).join('')}${[0,.25,.5,.75,1].map(i=>`<line y1="${Y(i)}" y2="${Y(i)}" x1="${L}" x2="${L+pw}" stroke="#eee"/><text x="${L-6}" y="${Y(i)+4}" font-size="11" text-anchor="end">${String(i).replace('.',',')}</text>`).join('')}
 <path d="${cur('NaCl')}" fill="none" stroke="#b5654a" stroke-width="3"/><path d="${cur('CH3COOH')}" fill="none" stroke="#4f8a6e" stroke-width="3"/>${pts}
 <circle cx="${X(.001)}" cy="${Y(a)}" r="6" fill="none" stroke="#b5654a" stroke-width="2.5"/><circle cx="${X(1)}" cy="${Y(b)}" r="6" fill="none" stroke="#4f8a6e" stroke-width="2.5"/>
 <text x="${X(.001)+8}" y="${Y(a)-8}" font-size="11">HCl 0,001 M: ${a.toFixed(2)}</text><text x="${X(1)-8}" y="${Y(b)+18}" font-size="11" text-anchor="end">CH₃COOH 1 M: ${b.toFixed(2)}</text>
 <text x="${L+pw/2}" y="${H-6}" font-size="12" text-anchor="middle">Konsentrasi (M, skala log)</text><text transform="translate(14 ${T+ph/2}) rotate(-90)" font-size="12" text-anchor="middle">Intensitas cahaya relatif</text>
 <line x1="${L+10}" x2="${L+34}" y1="${T+14}" y2="${T+14}" stroke="#b5654a" stroke-width="3"/><text x="${L+38}" y="${T+18}" font-size="11">Elektrolit kuat (NaCl)</text><line x1="${L+10}" x2="${L+34}" y1="${T+30}" y2="${T+30}" stroke="#4f8a6e" stroke-width="3"/><text x="${L+38}" y="${T+34}" font-size="11">Elektrolit lemah (CH₃COOH)</text></svg>`}
R[6]=()=>{const hs=['Bandingkan jumlah ion yang dihasilkan 1 mol NaCl dan 1 mol CH₃COOH.','Perhatikan: pada konsentrasi sama, siapa yang menghasilkan ion lebih banyak? Lalu bandingkan titik HCl 0,001 M dengan CH₃COOH 1 M.','Terang lampu mengikuti jumlah ion total per volume = konsentrasi × derajat ionisasi × jumlah ion per rumus; jadi kekuatan elektrolit saja tidak cukup.'];
 $('#stage').innerHTML=`<section class="card"><h2>Analisis Data</h2><p><b>Pertanyaan penuntun:</b> Pada konsentrasi yang sama, mana yang lampunya lebih terang, elektrolit kuat atau lemah? Apakah hal itu berlaku pada semua konsentrasi?</p><div id="hints"></div><button class="btn ghost sm" id="hb">Petunjuk (<span id="hn">1</span>/3)</button></section>
 <section class="card"><h3>Grafik: Konsentrasi vs Intensitas Cahaya</h3>${chart()}<p class="muted">Asumsi model: elektrolit kuat terdisosiasi sempurna; elektrolit lemah α ≈ 0,013·√(0,1/c); I = ion/(ion + 0,01). Ini model ilustratif. Titik bulat penuh = pengujianmu di Virtual Lab (mode larutan). Grafik tidak berarti elektrolit lemah selalu lebih redup di semua kondisi.</p></section>
 <section class="card"><h3>Susun kriteriamu sendiri</h3><label for="crit">Larutan disebut elektrolit jika ...</label><textarea id="crit" rows="3">${esc(S.crit)}</textarea><button class="btn" id="chk">Periksa</button><div id="fb"></div><p class="muted">Pemeriksaan berbasis kata kunci konsep, bukan penilaian makna yang sempurna.</p></section>`;
 let h=0;$('#hb').onclick=()=>{if(h<3){$('#hints').insertAdjacentHTML('beforeend',`<p class="hint"><b>Hint ${h+1}:</b> ${hs[h]}</p>`);h++;$('#hn').textContent=Math.min(h+1,3);if(h>=3)$('#hb').disabled=true}};
 $('#chk').onclick=()=>{const t=$('#crit').value.trim().toLowerCase();S.crit=$('#crit').value;const ks=[[/ion|partikel bermuatan/,'keberadaan ion'],[/bebas|bergerak|mobil/,'ion bebas bergerak'],[/listrik|hantar|lampu|muatan/,'daya hantar listrik/pembawa muatan']],f=ks.filter(k=>k[0].test(t)),ms=ks.filter(k=>!k[0].test(t));
  S.critOk=t.length>=15&&f.length>=2;save();steps();$('#fb').innerHTML=fbHtml(S.critOk,S.critOk?`Kriteriamu memuat: ${f.map(k=>k[1]).join(', ')}.${ms.length?' Kamu bisa menambahkan: '+ms.map(k=>k[1]).join(', ')+'.':''} Contoh: “Larutan disebut elektrolit jika mengandung ion bebas yang bergerak sehingga dapat menghantarkan listrik.”`:`Kriteria belum memuat cukup konsep. Tambahkan: ${ms.map(k=>k[1]).join(', ')||'penjelasan lebih lengkap (minimal satu kalimat)'}.`)}};

/* ---------- TAHAP 8: PENGUATAN ---------- */
const EQS=[['NaCl','→','Na⁺','+','Cl⁻'],['CaCl₂','→','Ca²⁺','+','2Cl⁻'],['Na₂SO₄','→','2Na⁺','+','SO₄²⁻'],['CH₃COOH','⇌','H⁺','+','CH₃COO⁻'],['NH₃','+','H₂O','⇌','NH₄⁺','+','OH⁻']];
function bal(str){const sides=str.split(/→|⇌/);if(sides.length!==2)return null;const sup={'²':2,'³':3},res=sides.map(sd=>{const at={};let q=0;for(let t of sd.split(' + ')){t=t.trim();if(!t)return null;const co=+((t.match(/^\d+/)||['1'])[0]);t=t.replace(/^\d+/,'');const m=t.match(/([²³]?)([⁺⁻])$/);if(m){q+=co*(m[1]?sup[m[1]]:1)*(m[2]==='⁺'?1:-1);t=t.slice(0,-m[0].length)}t=t.replace(/[₀-₉]/g,c=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(c));for(const x of t.matchAll(/([A-Z][a-z]?)(\d*)/g))at[x[1]]=(at[x[1]]||0)+co*(+x[2]||1)}return{at,q}});
 if(res.includes(null))return null;return{ok:JSON.stringify(Object.entries(res[0].at).sort())===JSON.stringify(Object.entries(res[1].at).sort())&&res[0].q===res[1].q,L:res[0],Rr:res[1]}}
const shuf=a=>[...a].sort(()=>Math.random()-.5);
const CALC=[['Na₂SO₄ 0,350 M','[Na⁺]',.7,'Na₂SO₄ → 2Na⁺ + SO₄²⁻; [Na⁺] = 2 × 0,350 = 0,700 M'],['Na₂SO₄ 0,350 M','[SO₄²⁻]',.35,'[SO₄²⁻] = 1 × 0,350 = 0,350 M'],['FeBr₃ 0,225 M','[Fe³⁺]',.225,'FeBr₃ → Fe³⁺ + 3Br⁻; [Fe³⁺] = 1 × 0,225 = 0,225 M'],['FeBr₃ 0,225 M','[Br⁻]',.675,'[Br⁻] = 3 × 0,225 = 0,675 M']];
const MY={X:{d:'Lampu redup, gelembung sedikit, partikel: sebagian besar molekul dengan sedikit ion, 0,10 M, kondisi sama.',a:'lemah',e:'Pada konsentrasi 0,10 M lampu redup, gelembung sedikit, dan sebagian besar partikel masih molekul: hanya sebagian kecil terionisasi → elektrolit lemah.'},Y:{d:'Lampu terang, gelembung banyak, partikel: hampir seluruhnya ion, 0,10 M, kondisi sama.',a:'kuat',e:'Pada 0,10 M lampu terang, gelembung banyak, dan hampir semua partikel berupa ion → elektrolit kuat.'}};
R[7]=()=>{$('#stage').innerHTML=`<section class="card"><h2>Aktivitas 1 — Menyusun persamaan</h2><p>Seret atau ketuk potongan ke kotak “Susunanmu”, lalu tekan Periksa. Pemeriksaan mencakup kesetaraan atom dan muatan.</p>${EQS.map((e,i)=>`<div class="eqb card" data-i="${i}"><b>Persamaan ${i+1}</b><div class="zone" data-z="pool" style="min-height:56px">${shuf(e).map(t=>`<span class="chip" draggable="true" tabindex="0">${t}</span>`).join('')}</div><div class="zone" data-z="ans" style="min-height:56px;background:var(--mint)"><h4>Susunanmu</h4></div><button class="btn sm" data-chk="${i}">Periksa</button> ${S.eq[i]?'✓ ':''}<div class="eqfb"></div></div>`).join('')}</section>
 <section class="card"><h2>Aktivitas 2 — Konsentrasi ion</h2><p class="muted">Asumsi: disosiasi sempurna. Gunakan koma/titik desimal; satuan M.</p>${CALC.map((c,i)=>`<p>${c[0]}: ${c[1]} = <input type="text" inputmode="decimal" id="c${i}" style="width:110px;display:inline" value="${S.calc.v?S.calc.v[i]:''}"> M</p>`).join('')}<button class="btn" id="cchk">Periksa Perhitungan</button><div id="cfb"></div></section>
 <section class="card"><h2>Aktivitas 3 — Larutan misterius</h2>${Object.entries(MY).map(([k,m])=>`<p><b>Larutan ${k}:</b> ${m.d}</p><select id="m${k}"><option value="">— pilih kesimpulan —</option>${Object.entries(KLAS).slice(0,3).map(([v,t])=>`<option value="${v}" ${S.myst[k]===v?'selected':''}>${t}</option>`).join('')}</select>`).join('')}<button class="btn" id="mchk">Periksa Kesimpulan</button><div id="mfb"></div></section>`;
 $$('.eqb').forEach(b=>{const z=$('.zone[data-z=pool]',b);});
 dnd($('#stage'),()=>{},'toggle');
 $$('[data-chk]').forEach(b=>b.onclick=()=>{const i=+b.dataset.chk,bx=b.closest('.eqb'),tk=$$('.zone[data-z=ans] .chip',bx).map(c=>c.textContent),str=tk.join(' '),tg=EQS[i].join(' '),bb=bal(tg),bs=bal(str);
  const ok=str===tg;S.eq[i]=ok||S.eq[i];save();steps();const f=o=>Object.entries(o.at).map(a=>a.join('=')).join(', ')+'; muatan '+o.q;
  $('.eqfb',bx).innerHTML=fbHtml(ok,ok?`Setara. Kiri: ${f(bb.L)}; kanan: ${f(bb.Rr)}. ${i>2?'Panah ⇌ dipakai karena elektrolit lemah (ionisasi sebagian).':'Panah → dipakai karena elektrolit kuat (disosiasi sempurna).'}`:(bs?(bs.ok?'Atom dan muatan setara, tetapi susunan/panah belum sesuai persamaan yang dimaksud.':'Jumlah atom atau muatan belum setara.'):'Susunan belum lengkap atau bentuknya belum benar (harus ada dua ruas dengan panah).')+' Periksa koefisien dan jenis panah.')});
 $('#cchk').onclick=()=>{const v=CALC.map((c,i)=>$('#c'+i).value),r=v.map((x,i)=>Math.abs(parseFloat(x.replace(',','.'))-CALC[i][2])<=.002);if(v.some(x=>!x.trim())){toast('Isi semua kolom dahulu.');return}
  S.calc={v,done:1};save();steps();$('#cfb').innerHTML=r.map((ok,i)=>`<p>${ok?'✓':'✗'} ${CALC[i][1]} dari ${CALC[i][0]}: ${CALC[i][3]}</p>`).join('')+fbHtml(r.every(Boolean),r.every(Boolean)?'Semua perhitungan sesuai perbandingan koefisien.':'Periksa pembahasan di atas dan bandingkan dengan jawabanmu.')};
 $('#mchk').onclick=()=>{const a=$('#mX').value,b=$('#mY').value;if(!a||!b){toast('Pilih kesimpulan untuk X dan Y.');return}S.myst={X:a,Y:b,done:1};save();steps();
  $('#mfb').innerHTML=['X','Y'].map(k=>fbHtml(S.myst[k]===MY[k].a,`<b>${k}:</b> ${MY[k].e}`)).join('')}};

/* ---------- TAHAP 9: EVALUASI & RAPOR ---------- */
R[8]=()=>{const h=$('#stage');
 if(S.form.length<5){h.innerHTML='<h2 style="margin:6px 0">Evaluasi Formatif (5 soal)</h2><div id="qh"></div>';quiz($('#qh'),FORM,S.form,()=>{R[8]()});return}
 if(S.fin.length<10){h.innerHTML=`<p class="note">Formatif selesai: skor ${pct(S.form,FORM)}.</p><h2 style="margin:6px 0">Evaluasi Akhir (10 soal)</h2><div id="qh"></div>`;quiz($('#qh'),FIN,S.fin,()=>{S.date=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});save();R[8]()});return}
 h.innerHTML=`<section class="card hero"><h2>Evaluasi selesai</h2><p>Skor formatif ${pct(S.form,FORM)} · skor evaluasi akhir ${pct(S.fin,FIN)}</p><button class="btn big" id="rep">Lihat Rapor</button></section>`;$('#rep').onclick=report};
function report(){
 const items=[...S.diag.map((k,i)=>({t:DIAG[i].t,ok:k===DIAG[i].a})),...Object.entries(S.qc).map(([i,k])=>({t:SUBS[i].q.t,ok:k===SUBS[i].q.a})),...S.form.map((k,i)=>({t:FORM[i].t,ok:k===FORM[i].a})),...S.fin.map((k,i)=>({t:FIN[i].t,ok:k===FIN[i].a}))];
 const st={};items.forEach(x=>{st[x.t]=st[x.t]||[0,0];st[x.t][1]++;if(x.ok)st[x.t][0]++});
 const ms=Object.entries(st).filter(([,v])=>v[0]/v[1]>=.8).map(([k,v])=>`${TOP[k]} (${v[0]}/${v[1]} benar)`),rv=Object.entries(st).filter(([,v])=>v[0]/v[1]<.7).map(([k,v])=>`${TOP[k]} (${v[0]}/${v[1]} benar)`);
 const bn=items.filter(x=>x.ok).length,fs=pct(S.form,FORM),es=pct(S.fin,FIN),ds=pct(S.diag,DIAG),nilai=Math.round(.4*fs+.6*es),mt=S.tests.filter(t=>t.match!=null),mc=mt.filter(t=>t.match).length;
 $('#stage').innerHTML=`<section class="card rep"><div style="display:flex;align-items:center;gap:12px">${LOGO}<div><h2 style="margin:0">LAPORAN HASIL BELAJAR — ION LAB</h2><small>ION LAB — Media Pembelajaran Kimia</small></div></div>
 <table><tr><th>Nama</th><td>${esc(S.name)}</td></tr><tr><th>Kelas</th><td>${esc(S.kelas)||'-'}</td></tr><tr><th>Tanggal</th><td>${S.date||new Date().toLocaleDateString('id-ID')}</td></tr></table>
 <h3>Progres</h3><p>Tahap: ${D.filter(f=>f()).length} dari 9 selesai (${STEPS.map((n,i)=>(D[i]()?'✓ ':'✗ ')+n).join(', ')}).<br>Materi: ${Object.keys(S.qc).length} dari 6 subtopik selesai.</p>
 <h3>Skor (skala 0–100)</h3><table><tr><th>Diagnostik</th><th>Formatif</th><th>Evaluasi akhir</th><th>Nilai akhir</th></tr><tr><td>${ds}</td><td>${fs}</td><td>${es}</td><td class="score">${nilai}</td></tr></table>
 <p class="muted">Dasar penilaian: skor = jawaban benar ÷ jumlah soal × 100. Nilai akhir = 40% formatif + 60% evaluasi akhir. Diagnostik hanya mengukur pengetahuan awal dan tidak masuk nilai akhir.</p>
 <p>Jawaban benar/salah (diagnostik + cek cepat + formatif + akhir): <b>${bn} benar, ${items.length-bn} salah</b>.</p>
 <h3>Prediksi vs Virtual Lab</h3><p>${mt.length?`${mc} dari ${mt.length} pengujian cocok dengan prediksimu.`:'Belum ada pengujian dengan prediksi.'}</p><div class="tw"><table><tr><th>Zat</th><th>Prediksiku</th><th>Hasil model</th><th>Status</th></tr>${S.tests.map(t=>`<tr><td>${gs(t.id).nm}</td><td>${t.pred?KLAS[t.pred]:'-'}</td><td>${t.res}</td><td>${t.match==null?'—':t.match?'Cocok':'Beda'}</td></tr>`).join('')}</table></div>
 <h3>Konsep paling dikuasai</h3><p>${ms.length?ms.join('; '):'Belum ada konsep dengan bukti ≥ 80% benar.'}</p><h3>Perlu dipelajari kembali</h3><p>${rv.length?rv.join('; '):'Tidak ada konsep di bawah 70% benar.'}</p>
 <h3>Refleksi</h3><textarea id="refl" rows="4" class="noprint" placeholder="Apa yang paling kamu pahami? Apa yang masih membingungkan?">${esc(S.refl)}</textarea><p id="reflp" style="white-space:pre-wrap;display:none"></p>
 <h3>Rekomendasi belajar</h3><p>${rv.length?'Pelajari ulang: '+rv.map(x=>x.split(' (')[0]).join(', ')+' melalui Buku Saku dan Virtual Lab.':'Pertahankan pemahamanmu; coba uji zat lain di Virtual Lab dan kerjakan soal sifat koligatif sebagai pengayaan.'}</p>
 <button class="btn noprint" id="prt">Simpan / Cetak Laporan</button><button class="btn ghost noprint" id="bk">← Kembali</button></section>`;
 $('#refl').oninput=e=>{S.refl=e.target.value;save()};
 $('#prt').onclick=()=>{$('#reflp').textContent=S.refl;$('#reflp').style.display=S.refl?'block':'none';window.print()};$('#bk').onclick=()=>go(8)}

/* ---------- BUKU SAKU, GLOSARIUM, BANTUAN ---------- */
const POCKET=[['Konsep larutan elektrolit dan nonelektrolit','Elektrolit: zat yang larutannya menghantarkan listrik. Nonelektrolit: larutannya tidak menghantarkan listrik. Penyebabnya adalah ion bebas sebagai pembawa muatan. Contoh: NaCl (elektrolit), gula dan etanol (nonelektrolit). Ringkasan: ada ion bebas → menghantarkan.'],['Prinsip uji daya hantar listrik','Lampu menyala jika rangkaian tertutup oleh ion bebas. Terang, redup, dan padam menunjukkan jumlah ion dari banyak ke tidak ada (pada konsentrasi sama). Air suling praktis daya hantarnya sangat rendah; air keran menghantarkan karena ion terlarut.'],['Disosiasi, hidrasi, dan ionisasi','Disosiasi: senyawa ion terpisah menjadi ion (NaCl(s) → Na⁺(aq) + Cl⁻(aq)). Hidrasi: ion dikelilingi molekul air. Ionisasi: pembentukan ion dari zat molekuler (HCl(aq) → H⁺(aq) + Cl⁻(aq)). NaCl padat tidak menghantarkan karena ion tidak bebas bergerak; lelehan dan larutannya menghantarkan.'],['Elektrolit kuat, lemah, dan nonelektrolit','Kuat: terionisasi hampir sempurna (→), contoh HCl, NaOH, NaCl. Lemah: sebagian kecil (⇌), contoh CH₃COOH, NH₃. Non: tetap molekul, contoh glukosa, etanol, urea. HCl dan NH₃ sama-sama molekuler, tetapi HCl kuat dan NH₃ lemah dalam air.'],['Konsentrasi, kekuatan elektrolit, dan perhitungan ion','Konsentrasi (M) berbeda dari kekuatan elektrolit. Konsentrasi ion = molaritas × koefisien (disosiasi sempurna). Contoh: CaCl₂ 0,10 M → [Cl⁻] = 0,20 M. Elektrolit kuat sangat encer dapat lebih redup daripada elektrolit lemah pekat.'],['Miskonsepsi umum','Lampu padam tidak selalu nonelektrolit; lampu lebih terang tidak otomatis konsentrasi lebih tinggi; yang bergerak dalam larutan adalah ion, bukan elektron bebas; tidak semua zat terlarut membentuk ion; kovalen tidak pasti nonelektrolit.']];
const GLOS=[['Elektrolit','Zat yang larutannya atau lelehannya dapat menghantarkan listrik karena mengandung ion bebas.'],['Nonelektrolit','Zat yang larutannya tidak menghantarkan listrik karena tetap berupa molekul netral.'],['Ion','Atom atau gugus atom bermuatan listrik; pembawa muatan dalam larutan.'],['Disosiasi','Pemisahan senyawa ion menjadi kation dan anion.'],['Hidrasi','Peristiwa ion dikelilingi dan distabilkan oleh molekul air.'],['Ionisasi','Pembentukan ion dari zat molekuler yang bereaksi dengan air.'],['Elektrolit kuat','Elektrolit yang terdisosiasi/terionisasi hampir sempurna dalam air.'],['Elektrolit lemah','Elektrolit yang hanya sebagian kecil terionisasi dan berkesetimbangan dengan molekulnya.'],['Konsentrasi','Jumlah zat terlarut per volume larutan, misalnya molaritas (mol/L).'],['Daya hantar listrik','Kemampuan larutan menghantarkan arus listrik melalui gerakan ion.']];
const HELP=['Cara menggunakan: masuk dengan nama dan kelas, lalu ikuti tahap 1–9 pada bilah di atas.','Sembilan tahap: tahap berikutnya terbuka setelah syarat tahap saat ini terpenuhi (ikon 🔒 berarti terkunci).','Soal: pilih jawaban, baca umpan balik; pada kuis, soal berikutnya muncul otomatis setelah jeda baca.','Virtual lab: pilih zat dan wujud, atur slider konsentrasi, tekan “Uji Larutan”; hasil masuk ke tabel.','Drag and drop: di laptop seret zat; di smartphone ketuk zat lalu ketuk kelompok tujuan (persamaan: ketuk potongan untuk memindahkan).','Tiga representasi: makroskopis (lampu, gelembung), submikroskopis (partikel), simbolik (persamaan) berubah bersama.','Buku Saku dan Glosarium ada di menu dan tidak menghapus progres.','Cetak rapor: buka Rapor lalu tekan “Simpan / Cetak Laporan”, pilih “Simpan sebagai PDF”.'];
function pocket(){openModal('Buku Saku Materi',POCKET.map((p,i)=>`<h3>${i+1}. ${p[0]}</h3><p>${p[1]}</p>`).join(''))}
function gloss(){openModal('Glosarium','<input id="gq" placeholder="Cari istilah…" aria-label="Cari istilah"><div id="gl"></div>');const r=()=>{const q=$('#gq').value.toLowerCase();$('#gl').innerHTML=GLOS.filter(g=>(g[0]+g[1]).toLowerCase().includes(q)).map(g=>`<p><b>${g[0]}</b>: ${g[1]}</p>`).join('')||'<p>Istilah tidak ditemukan.</p>'};$('#gq').oninput=r;r()}
function help(){openModal('Bantuan','<ol>'+HELP.map(h=>`<li>${h}</li>`).join('')+'</ol>')}

/* ---------- BACKGROUND ANIMASI (CSS/JS, tanpa teks, pointer-events:none) ---------- */
(function(){const bg=$('#bg'),k=['p','n','m','b'];bg.innerHTML='<div class="blob" style="left:-10vw;top:-10vh"></div><div class="blob" style="right:-12vw;bottom:-12vh;animation-delay:-8s;background:#f7d6c0"></div>';
 for(let i=0;i<26;i++){const s=document.createElement('span'),z=14+Math.random()*34;s.className='bgp '+k[i%4];s.style.cssText=`width:${z}px;height:${z}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${14+Math.random()*16};animation-delay:-${Math.random()*20}s`;bg.appendChild(s)}})();
