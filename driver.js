// Lightweight driver app logic (works with driver.html)
(function(){
  const $ = s => document.querySelector(s);
  const toast = msg => { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); };

  // Storage keys
  const SALES_KEY = 'driver_sales';
  const GPS_KEY = 'driver_gps';
  const DRIVER_KEY = 'driver_profile';

  // UI elements
  const loginForm = document.getElementById('driverLoginForm');
  const driverPage = document.getElementById('driverPage');
  const loginScreen = document.getElementById('loginScreen');
  const syncButton = document.getElementById('syncButton');
  const addSaleBtn = document.getElementById('addSale');
  const salesList = document.getElementById('salesList');
  const gpsInfo = document.getElementById('gpsInfo');
  const lastLocation = document.getElementById('lastLocation');
  const toggleTracking = document.getElementById('toggleTracking');
  let watchId = null;

  // Helpers
  function load(key){ const v = localStorage.getItem(key); return v ? JSON.parse(v) : []; }
  function save(key, v){ localStorage.setItem(key, JSON.stringify(v)); }
  function getDriver(){ return JSON.parse(localStorage.getItem(DRIVER_KEY) || 'null'); }
  function setDriver(d){ localStorage.setItem(DRIVER_KEY, JSON.stringify(d)); }

  // Render sales from storage
  function renderSales(){
    const sales = load(SALES_KEY).slice().reverse();
    salesList.innerHTML = sales.length ? sales.map(s=>`<p><b>${escapeHtml(s.customer)}</b> · ${escapeHtml(s.payment)} · ₱${Number(s.amount).toFixed(2)} <small>${new Date(s.ts).toLocaleTimeString()}</small></p>`).join('') : '<p>No sales recorded</p>';
  }

  function escapeHtml(str){ return String(str||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // Signup / login
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('driverId').value.trim();
    const phone = document.getElementById('devicePhone').value.trim();
    if(!id){ toast('Enter driver ID'); return; }
    setDriver({id, phone});
    loginScreen.hidden = true;
    driverPage.hidden = false;
    document.getElementById('greeting').textContent = `Good morning, ${id}`;
    renderSales();
    toast('Signed in as '+id);
    // try to start tracking automatically if permission already granted
    if(navigator.permissions) navigator.permissions.query({name:'geolocation'}).then(p=>{ if(p.state==='granted') startTracking(); }).catch(()=>{});
  });

  // Add sale
  addSaleBtn.addEventListener('click', e => {
    e.preventDefault();
    const d = getDriver();
    if(!d){ toast('Sign in first'); return; }
    const customer = document.getElementById('saleCustomer').value || 'Walk-in';
    const amount = Number(document.getElementById('saleAmount').value) || 0;
    const payment = document.getElementById('salePayment').value || 'Cash';
    const sale = { id: 's_'+Date.now(), driver_id: d.id, customer, amount, payment, ts: new Date().toISOString(), device_ts: Date.now() };
    const sales = load(SALES_KEY);
    sales.push(sale);
    save(SALES_KEY, sales);
    renderSales();
    toast('Sale recorded (offline)');
    document.getElementById('saleCustomer').value = '';
    document.getElementById('saleAmount').value = '';
  });

  // Sync to server
  async function syncNow(){
    const driver = getDriver();
    if(!driver){ toast('Sign in first'); return; }
    const sales = load(SALES_KEY);
    const gps = load(GPS_KEY);
    if(!navigator.onLine){ toast('Offline — will sync when online'); return; }
    try{
      syncButton.disabled = true; syncButton.textContent = 'Syncing…';
      const resp = await fetch('/api/driver/sync', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({driver, sales, gps})
      });
      if(!resp.ok) throw new Error('Sync failed');
      const result = await resp.json();
      if(result.syncedSalesCount && result.syncedSalesCount>0){ save(SALES_KEY, []); }
      if(result.syncedGpsCount && result.syncedGpsCount>0){ save(GPS_KEY, []); }
      toast('Sync complete');
      renderSales();
    }catch(err){
      console.error(err);
      toast('Sync error — will retry later');
    }finally{
      syncButton.disabled = false; syncButton.textContent = navigator.onLine ? 'Sync now' : '● Offline';
    }
  }
  syncButton.addEventListener('click', syncNow);
  window.addEventListener('online', () => { syncButton.textContent = 'Sync now'; toast('Back online — syncing'); syncNow(); });
  window.addEventListener('offline', () => { syncButton.textContent = '● Offline'; toast('Offline'); });

  // GPS tracking
  function startTracking(){
    if(watchId) return;
    if(!navigator.geolocation){ toast('GPS not available'); return; }
    watchId = navigator.geolocation.watchPosition(pos => {
      const {latitude:lat, longitude:lng, accuracy, speed} = pos.coords;
      const p = {id: 'g_'+Date.now(), driver_id: getDriver()?.id||'unknown', ts: new Date().toISOString(), lat, lng, accuracy, speed};
      const gps = load(GPS_KEY); gps.push(p); save(GPS_KEY, gps);
      gpsInfo.textContent = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (acc ${Math.round(accuracy)}m)`;
      lastLocation.textContent = `Last location · ${new Date().toLocaleTimeString()}`;
      if(navigator.onLine && navigator.sendBeacon){ try{ navigator.sendBeacon('/api/driver/gps', JSON.stringify(p)); }catch(e){} }
    }, err => { console.warn('gps err', err); toast('GPS error: '+err.message); }, {enableHighAccuracy:true, maximumAge:5000, timeout:10000});
    toggleTracking.textContent = 'Stop';
    toast('Tracking started');
  }
  function stopTracking(){
    if(!watchId) return;
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    toggleTracking.textContent = 'Start';
    toast('Tracking stopped');
  }
  toggleTracking.addEventListener('click', e => { if(watchId) stopTracking(); else startTracking(); });

  // Initial UI state
  if(getDriver()){ loginScreen.hidden=true; driverPage.hidden=false; document.getElementById('greeting').textContent = 'Good morning, '+getDriver().id; renderSales(); }

  // Back to login / logout
  document.getElementById('logout').addEventListener('click', ()=>{
    localStorage.removeItem(DRIVER_KEY);
    loginScreen.hidden=false; driverPage.hidden=true; toast('Signed out');
  });

  // small helper to display saved entries on load
  renderSales();
})();
