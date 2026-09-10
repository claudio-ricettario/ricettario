// ============================================================
// FONDO BRUNO DI MANZO — inserimento via console browser
// Incolla questo script nella console del browser su index.html
// ============================================================

(function() {
  // Legge il magazzino dal localStorage
  var mag = JSON.parse(localStorage.getItem('rc_magazzino4') || '[]');

  // Funzione per trovare magIdx per nome (case-insensitive, parziale)
  function findIdx(keyword) {
    var k = keyword.toLowerCase();
    var idx = mag.findIndex(function(m) {
      return m.nome && m.nome.toLowerCase().indexOf(k) !== -1;
    });
    if (idx === -1) console.warn('⚠️ Ingrediente non trovato: ' + keyword);
    else console.log('✅ ' + keyword + ' → magIdx ' + idx + ' (' + mag[idx].nome + ')');
    return idx;
  }

  // Trova gli indici delle materie prime
  var idxOssa       = findIdx('ossa');
  var idxCipolla    = findIdx('cipolla');
  var idxCarota     = findIdx('carota');
  var idxSedano     = findIdx('sedano');
  var idxVino       = findIdx('vino rosso');
  var idxConcentrato= findIdx('concentrato');
  var idxAcqua      = findIdx('acqua');
  var idxOlio       = findIdx('olio extra');
  var idxAlloro     = findIdx('alloro');
  var idxPepe       = findIdx('pepe nero');

  // Costruisce il componente — conv: 0.001 per g/ml, 1 per kg/lt
  function comp(idx, nome, qta, unit) {
    var conv = (unit === 'g' || unit === 'ml') ? 0.001 : 1;
    return { magIdx: idx, nome: nome, qtaBase: qta, unit: unit, conv: conv };
  }

  // Semilavorato fondo bruno di manzo
  var fondoBruno = {
    codice: 'SL-' + String(Date.now()).slice(-4), // codice provvisorio
    nome: 'Fondo bruno di manzo',
    categoria: 'Fondi e brodi',
    resaQta: 1,
    resaUm: 'lt',
    tempo: 360,
    procedimento:
      '1. Tostare le ossa di manzo in forno a 200°C per 40-45 minuti fino a doratura intensa.\n' +
      '2. Rosolare le verdure (cipolla, carota, sedano) in olio EVO nella pentola.\n' +
      '3. Aggiungere il concentrato di pomodoro e tostare 2-3 minuti.\n' +
      '4. Unire le ossa tostate, sfumare con il vino rosso e deglassare bene.\n' +
      '5. Coprire con acqua fredda. Portare a bollore schiumando.\n' +
      '6. Sobbollire a fuoco basso per 3 ore.\n' +
      '7. A metà cottura aggiungere abbondante ghiaccio (shock termico) per estrarre ' +
      'al meglio il collagene e la gelatina. Riprendere la cottura.\n' +
      '8. Filtrare con colino a maglie fitte.\n' +
      '9. Ridurre il liquido filtrato fino a consistenza sciropposa (circa 1 litro finale).\n' +
      '10. Conservare in frigorifero o porzionare e congelare.',
    coefficiente: 1,
    shelfLifeFrigo: 5,
    shelfLifeSottovuoto: 14,
    shelfLifeCongelato: 90,
    dataCreazione: new Date().toISOString().slice(0, 10),
    componenti: [
      comp(idxOssa,        'Ossa di manzo',              1500, 'g'),
      comp(idxCipolla,     'Cipolla',                     200, 'g'),
      comp(idxCarota,      'Carota',                      150, 'g'),
      comp(idxSedano,      'Sedano',                      100, 'g'),
      comp(idxVino,        'Vino Rosso Cucina',           200, 'ml'),
      comp(idxConcentrato, 'Concentrato pomodoro',         30, 'g'),
      comp(idxAcqua,       'Acqua',                         4, 'lt'),
      comp(idxOlio,        'Olio extra vergine d\'oliva',  30, 'g'),
      comp(idxAlloro,      'Alloro foglie Wiberg',          2, 'g'),
      comp(idxPepe,        'Pepe Nero Macinato Wiberg',     2, 'g'),
    ].filter(function(c) { return c.magIdx !== -1; })
  };

  // Legge i semilavorati esistenti e aggiunge il nuovo
  var semi = JSON.parse(localStorage.getItem('rc_semilavorati') || '[]');

  // Controlla se esiste già
  var esistente = semi.findIndex(function(s) {
    return s.nome && s.nome.toLowerCase().indexOf('fondo bruno di manzo') !== -1;
  });

  if (esistente !== -1) {
    if (!confirm('Esiste già un "Fondo bruno di manzo". Vuoi sovrascriverlo?')) {
      console.log('Operazione annullata.');
      return;
    }
    semi[esistente] = fondoBruno;
    console.log('✅ Fondo bruno di manzo AGGIORNATO.');
  } else {
    semi.push(fondoBruno);
    console.log('✅ Fondo bruno di manzo AGGIUNTO.');
  }

  // Salva e ricarica la UI
  localStorage.setItem('rc_semilavorati', JSON.stringify(semi));
  console.log('💾 Salvato in localStorage. Ricarica la pagina per vedere le modifiche.');

  // Tenta di ricaricare la UI senza refresh se la funzione è disponibile
  if (typeof loadSemilavorati === 'function') {
    loadSemilavorati();
    if (typeof renderSemilavorati === 'function') renderSemilavorati();
    console.log('🔄 UI aggiornata senza refresh.');
  } else {
    console.log('ℹ️ Fai un refresh della pagina per vedere il semilavorato.');
  }

})();
