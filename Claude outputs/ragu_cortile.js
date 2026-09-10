// ============================================================
// RAGÙ DI CORTILE — inserimento via console browser
// Incolla questo script nella console del browser su index.html
// ============================================================

(function() {
  var mag  = JSON.parse(localStorage.getItem('rc_magazzino4') || '[]');
  var semi = JSON.parse(localStorage.getItem('rc_semilavorati') || '[]');

  // Trova magIdx per nome (case-insensitive, parziale)
  function findIdx(keyword) {
    var k = keyword.toLowerCase();
    var idx = mag.findIndex(function(m) {
      return m.nome && m.nome.toLowerCase().indexOf(k) !== -1;
    });
    if (idx === -1) console.warn('⚠️  MP non trovata: ' + keyword);
    else console.log('✅ ' + keyword + ' → magIdx ' + idx + ' (' + mag[idx].nome + ')');
    return idx;
  }

  // Trova semiIdx per nome (case-insensitive, parziale)
  function findSemiIdx(keyword) {
    var k = keyword.toLowerCase();
    var idx = semi.findIndex(function(s) {
      return s.nome && s.nome.toLowerCase().indexOf(k) !== -1;
    });
    if (idx === -1) console.warn('⚠️  Semilavorato non trovato: ' + keyword);
    else console.log('✅ ' + keyword + ' → semiIdx ' + idx + ' (' + semi[idx].nome + ')');
    return idx;
  }

  // Ingredienti MP
  var idxConiglio    = findIdx('coniglio');
  var idxPollo       = findIdx('pollo');
  var idxAnatra      = findIdx('anatra');
  var idxTastasal    = findIdx('tastasal');
  var idxSoffritto   = findIdx('soffritto');
  var idxOlio        = findIdx('olio extra');
  var idxVinoBianco  = findIdx('vino bianco');
  var idxAlloro      = findIdx('alloro');
  var idxRosmarino   = findIdx('rosmarino');
  var idxSalvia      = findIdx('salvia');
  var idxSale        = findIdx('sale fino');
  var idxPepe        = findIdx('pepe nero');

  // Semilavorato: fondo bruno
  var idxFondo = findSemiIdx('fondo bruno');

  // Costruisce componente MP
  function comp(idx, nome, qta, unit) {
    if (idx === -1) return null;
    var conv = (unit === 'g' || unit === 'ml') ? 0.001 : 1;
    return { magIdx: idx, nome: nome, qtaBase: qta, unit: unit, conv: conv };
  }

  // Costruisce componente Semilavorato
  function compSl(idx, nome, qta, unit) {
    if (idx === -1) return null;
    var conv = (unit === 'g' || unit === 'ml') ? 0.001 : 1;
    var s = semi[idx];
    return {
      tipo: 'sl',
      semiIdx: idx,
      codiceSl: s ? s.codice : '',
      nome: nome,
      qtaBase: qta,
      unit: unit,
      conv: conv
    };
  }

  // Lista componenti (filtra i null se magIdx non trovato)
  var componenti = [
    comp(idxConiglio,   'Macinato di Coniglio',           200, 'g'),
    comp(idxPollo,      'Macinato di Pollo',               300, 'g'),
    comp(idxAnatra,     'Macinato di Anatra',              300, 'g'),
    comp(idxTastasal,   'Tastasal',                        200, 'g'),
    comp(idxSoffritto,  'Soffritto Misto Gelo',            300, 'g'),
    comp(idxOlio,       'Olio extra vergine d\'oliva',      50, 'g'),
    comp(idxVinoBianco, 'Vino Bianco Cucina',              150, 'ml'),
    compSl(idxFondo,    'Fondo bruno di manzo',            300, 'ml'),
    comp(idxAlloro,     'Alloro foglie Wiberg',              2, 'g'),
    comp(idxRosmarino,  'Rosmarino',                         2, 'g'),
    comp(idxSalvia,     'Salvia',                            1, 'g'),
    comp(idxSale,       'Sale Fino',                         0, 'q.b.'),
    comp(idxPepe,       'Pepe Nero Macinato Wiberg',         0, 'q.b.'),
  ].filter(Boolean);

  // Semilavorato
  var ragu = {
    codice: 'SL-' + String(Date.now()).slice(-4),
    nome: 'Ragù di cortile',
    categoria: 'Carni lavorate',
    resaQta: 1260,
    resaUm: 'g',
    tempo: 90,
    procedimento:
      '1. Rosolare il soffritto misto in olio EVO fino a doratura.\n' +
      '2. Aggiungere il tastasal e sgranarlo bene in padella.\n' +
      '3. Unire macinato di coniglio, pollo e anatra. Rosolare a fuoco vivo mescolando.\n' +
      '4. Sfumare con il vino bianco e far evaporare completamente.\n' +
      '5. Aggiungere alloro, rosmarino e salvia.\n' +
      '6. Incorporare il fondo bruno di manzo per mantenere il ragù sugoso.\n' +
      '7. Cuocere a fuoco basso con coperchio per 60-70 minuti, aggiungendo fondo se necessario.\n' +
      '8. Aggiustare di sale e pepe. Il ragù deve risultare morbido e ben legato.\n' +
      '9. Rimuovere gli aromi prima del servizio.',
    coefficiente: 1,
    shelfLifeFrigo: 4,
    shelfLifeSottovuoto: 10,
    shelfLifeCongelato: 90,
    dataCreazione: new Date().toISOString().slice(0, 10),
    componenti: componenti
  };

  // Controlla duplicati
  var esistente = semi.findIndex(function(s) {
    return s.nome && s.nome.toLowerCase().indexOf('ragù di cortile') !== -1;
  });

  if (esistente !== -1) {
    if (!confirm('Esiste già un "Ragù di cortile". Vuoi sovrascriverlo?')) {
      console.log('Operazione annullata.');
      return;
    }
    semi[esistente] = ragu;
    console.log('✅ Ragù di cortile AGGIORNATO.');
  } else {
    semi.push(ragu);
    console.log('✅ Ragù di cortile AGGIUNTO.');
  }

  localStorage.setItem('rc_semilavorati', JSON.stringify(semi));
  console.log('💾 Salvato in localStorage.');

  if (typeof loadSemilavorati === 'function') {
    loadSemilavorati();
    if (typeof renderSemilavorati === 'function') renderSemilavorati();
    console.log('🔄 UI aggiornata senza refresh.');
  } else {
    console.log('ℹ️ Fai un refresh della pagina per vedere il semilavorato.');
  }

})();
