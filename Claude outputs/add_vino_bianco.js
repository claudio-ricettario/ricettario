// ============================================================
// VINO BIANCO CUCINA — copia da Vino Rosso Cucina
// Incolla questo script nella console del browser su index.html
// ============================================================

(function() {
  var mag = JSON.parse(localStorage.getItem('rc_magazzino4') || '[]');

  // Trova il Vino Rosso Cucina
  var idxRosso = mag.findIndex(function(m) {
    return m.nome && m.nome.toLowerCase().indexOf('vino rosso') !== -1;
  });

  if (idxRosso === -1) {
    console.error('❌ Vino Rosso Cucina non trovato nel magazzino. Controlla il nome.');
    return;
  }
  console.log('✅ Trovato: ' + mag[idxRosso].nome + ' (magIdx ' + idxRosso + ')');

  // Controlla se esiste già il Vino Bianco
  var esistente = mag.findIndex(function(m) {
    return m.nome && m.nome.toLowerCase().indexOf('vino bianco') !== -1;
  });
  if (esistente !== -1) {
    console.warn('⚠️  Vino Bianco già presente come "' + mag[esistente].nome + '". Operazione annullata.');
    return;
  }

  // Copia profonda del Vino Rosso e cambia solo il nome
  var vinoBianco = JSON.parse(JSON.stringify(mag[idxRosso]));
  vinoBianco.nome = 'Vino Bianco Cucina';

  // Aggiunge in fondo al magazzino
  mag.push(vinoBianco);

  localStorage.setItem('rc_magazzino4', JSON.stringify(mag));
  console.log('✅ Vino Bianco Cucina aggiunto (magIdx ' + (mag.length - 1) + ').');
  console.log('💾 Salvato in localStorage.');

  // Tenta aggiornamento UI senza refresh
  if (typeof renderMagazzino === 'function') {
    renderMagazzino();
    console.log('🔄 UI aggiornata senza refresh.');
  } else {
    console.log('ℹ️ Fai un refresh della pagina per vedere la nuova voce.');
  }

})();
