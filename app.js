(function(){
  const STORAGE_KEY = 'plw_data_v1';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function todayISO(){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }

  function addDaysISO(iso, days){
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0,10);
  }

  function fmtDate(iso){
    if(!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'2-digit'});
  }

  function uid(prefix){
    return prefix + '_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  function loadData(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object') return parsed;
      }
    }catch(e){
      // ignore
    }
    return null;
  }

  function saveData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function seedDataIfMissing(){
    let data = loadData();
    if(data) return data;

    const seedBooks = [
      {id:'b_1001', title:'The Great Gatsby', author:'F. Scott Fitzgerald', subject:'Classic', isbn:'9780743273565', format:'Print', location:'Adult Fiction', available:true, featured:true, newArrival:false, cover:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'},
      {id:'b_1002', title:'Atomic Habits', author:'James Clear', subject:'Self-Help', isbn:'9780735211292', format:'Print', location:'Non-Fiction', available:true, featured:true, newArrival:true, cover:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'},
      {id:'b_1003', title:'A Brief History of Time', author:'Stephen Hawking', subject:'Science', isbn:'9780553380163', format:'Print', location:'Science', available:false, featured:false, newArrival:false, cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'},
      {id:'b_1004', title:'Pride and Prejudice', author:'Jane Austen', subject:'Classic', isbn:'9781503290563', format:'E-Book', location:'Digital', available:true, featured:false, newArrival:true, cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'},
      {id:'b_1005', title:'The Alchemist', author:'Paulo Coelho', subject:'Fiction', isbn:'9780061122415', format:'Print', location:'Adult Fiction', available:true, featured:false, newArrival:false, cover:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'},
      {id:'b_1006', title:'The Hobbit', author:'J.R.R. Tolkien', subject:'Fantasy', isbn:'9780345339683', format:'Print', location:'Teen/YA', available:true, featured:true, newArrival:false, cover:'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop'},
      {id:'b_1007', title:'Digital Minimalism', author:'Cal Newport', subject:'Technology', isbn:'9780525536512', format:'E-Book', location:'Digital', available:true, featured:false, newArrival:false, cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'},
      {id:'b_1008', title:'The Very Hungry Caterpillar', author:'Eric Carle', subject:'Children', isbn:'9780399226908', format:'Print', location:'Children', available:true, featured:false, newArrival:true, cover:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'}
    ];

    const seedPatrons = [
      {id:'p_2001', name:'Aarav Sharma', email:'aarav@demo.local', phone:'+91 90000 00000', fines:0, maxRenewalsPerLoan:2, heavyFineThreshold:200},
      {id:'p_2002', name:'Meera Iyer', email:'meera@demo.local', phone:'+91 98888 11111', fines:25, maxRenewalsPerLoan:2, heavyFineThreshold:200}
    ];

    const seedLoans = [
      {
        id:'l_3001',
        patronId:'p_2001',
        bookId:'b_1003',
        borrowedOn:addDaysISO(todayISO(), -7),
        dueOn:addDaysISO(todayISO(), 7),
        renewalsUsed:0,
        maxRenewals:2,
        holdByOther:false
      },
      {
        id:'l_3002',
        patronId:'p_2001',
        bookId:'b_1001',
        borrowedOn:addDaysISO(todayISO(), -20),
        dueOn:addDaysISO(todayISO(), 1),
        renewalsUsed:1,
        maxRenewals:2,
        holdByOther:true
      }
    ];

    const seedEvents = [
      {id:'e_4001', title:'Story Time (Kids)', schedule:'Every Saturday', time:'11:00 AM – 12:00 PM', location:'Children\'s Corner', description:'Includes read-aloud sessions and fun activities.'},
      {id:'e_4002', title:'Career & Resume Clinic', schedule:'2nd Wednesday', time:'4:00 PM – 6:00 PM', location:'Community Hall', description:'Bring your resume and get one-on-one guidance.'},
      {id:'e_4003', title:'Digital Literacy Workshop', schedule:'Monthly', time:'TBA', location:'Computer Lab', description:'Topics: Online safety, email basics, and e-resources. Registration: Required at the help desk.'},
      {id:'e_4004', title:'Book Club Meetup', schedule:'Every Friday', time:'5:30 PM – 6:30 PM', location:'Reading Room', description:'Theme rotates weekly. Check announcements on the notice board.'}
    ];

    const dataSeed = {
      version:1,
      library:{
        name:'City Central Public Library',
        address:'12 Knowledge Avenue, Civic Center',
        city:'Your City',
        phone:'+91 80000 12345',
        email:'helpdesk@library.local',
        timings:'Mon–Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 2:00 PM'
      },
      books: seedBooks,
      patrons: seedPatrons,
      loans: seedLoans,
      holds: [],
      events: seedEvents,
      session:{
        patronId:null,
        isAdmin:false
      }
    };

    saveData(dataSeed);
    return dataSeed;
  }

  function getData(){
    const data = seedDataIfMissing();
    // Ensure events array exists for backward compatibility
    if(!data.events) data.events = [];
    return data;
  }

  function setSession(updates){
    const data = getData();
    data.session = {...data.session, ...updates};
    saveData(data);
  }

  function toast(title, message){
    let wrap = $('.toast-wrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(message)}</p>
      </div>
      <button class="x" aria-label="Dismiss">✕</button>
    `;
    wrap.appendChild(el);

    const t = setTimeout(()=>{ el.remove(); }, 4800);
    $('.x', el).addEventListener('click', ()=>{ clearTimeout(t); el.remove(); });
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  function setActiveNav(){
    const page = document.body.getAttribute('data-page');
    if(!page) return;
    $$('.nav a').forEach(a=>{
      if(a.getAttribute('data-nav') === page) a.classList.add('active');
    });
  }

  function patron(){
    const data = getData();
    if(!data.session.patronId) return null;
    return data.patrons.find(p=>p.id === data.session.patronId) || null;
  }

  function requirePatronOrRedirect(){
    const p = patron();
    if(p) return p;
    toast('Sign in required', 'Please sign in to access your Patron Account.');
    setTimeout(()=>{ window.location.href = 'patron-login.html'; }, 350);
    return null;
  }

  function renderCatalog(list, mount, isAdmin = false){
    if(!mount) return;
    if(!list.length){
      mount.innerHTML = '<div class="note">No matching books found. Try a different search.</div>';
      return;
    }

    const data = getData();
    const p = patron();

    mount.innerHTML = list.map(b=>{
      const availability = b.available ? '<span class="badge good">Available</span>' : '<span class="badge bad">Checked out</span>';
      const featured = b.featured ? '<span class="badge">Featured</span>' : '';
      const newArrival = b.newArrival ? '<span class="badge warn">New</span>' : '';

      const holdBtn = isAdmin ? '' : `<button class="btn" data-action="hold" data-book="${b.id}">Place Hold</button>`;
      const reserveBtn = isAdmin ? '' : `<button class="btn success" data-action="reserve" data-book="${b.id}">Reserve</button>`;
      const signInBtn = isAdmin ? '' : `<a class="btn primary" href="patron-login.html">Sign in to Reserve</a>`;
      const deleteBtn = isAdmin ? `<button class="btn danger" type="button" data-delete-book="${b.id}">Delete</button>` : '';
      const toggleBtn = isAdmin ? `<button class="btn" type="button" data-toggle-avail="${b.id}">Toggle Availability</button>` : '';

      const actionPrimary = isAdmin ? '' : (p ? reserveBtn : signInBtn);

      const coverImage = b.cover ? `<img src="${b.cover}" alt="${escapeHtml(b.title)} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'>${escapeHtml(b.title)}</div>'">` : `<div class="book-cover-placeholder">${escapeHtml(b.title)}</div>`;
      
      return `
        <article class="book-card" data-book-card="${b.id}">
          <div class="book-cover">
            ${coverImage}
          </div>
          <div class="book-top">
            <div>
              <h3 class="book-title">${escapeHtml(b.title)}</h3>
              <p class="book-sub">by ${escapeHtml(b.author)} • ${escapeHtml(b.format)}</p>
            </div>
          </div>

          <div class="book-meta">
            <div class="meta"><b>Subject</b><span>${escapeHtml(b.subject)}</span></div>
            <div class="meta"><b>ISBN</b><span>${escapeHtml(b.isbn)}</span></div>
            <div class="meta"><b>Location</b><span>${escapeHtml(b.location)}</span></div>
            <div class="meta"><b>Catalog ID</b><span>${escapeHtml(b.id)}</span></div>
          </div>

          <div class="book-badges">
            ${availability}
            ${newArrival}
            ${featured}
            <span class="badge-spacer"></span>
          </div>

          <div class="book-actions">
            ${actionPrimary}
            ${holdBtn}
            ${toggleBtn}
            ${deleteBtn}
            ${!isAdmin ? `<a class="btn" href="catalog.html#${encodeURIComponent(b.id)}">View in Catalog</a>` : ''}
          </div>
        </article>
      `;
    }).join('');

    mount.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-action]');
      if(!btn) return;
      const action = btn.getAttribute('data-action');
      const bookId = btn.getAttribute('data-book');
      if(action === 'reserve'){
        const pNow = patron();
        if(!pNow){
          toast('Sign in required', 'Please sign in to reserve books.');
          return;
        }
        reserveBook(bookId, pNow.id);
      }
      if(action === 'hold'){
        const pNow = patron();
        if(!pNow){
          toast('Sign in required', 'Please sign in to place a hold.');
          return;
        }
        placeHold(bookId, pNow.id);
      }
    }, {once:true});
  }

  function reserveBook(bookId, patronId){
    const data = getData();
    const b = data.books.find(x=>x.id === bookId);
    if(!b){
      toast('Not found', 'That book could not be found.');
      return;
    }
    if(!b.available){
      toast('Not available', 'This book is currently checked out. Try placing a hold.');
      return;
    }

    b.available = false;

    const loan = {
      id: uid('l'),
      patronId,
      bookId,
      borrowedOn: todayISO(),
      dueOn: addDaysISO(todayISO(), 14),
      renewalsUsed: 0,
      maxRenewals: 2,
      holdByOther: false
    };
    data.loans.push(loan);
    saveData(data);

    toast('Reserved', `“${b.title}” has been reserved and loaned to your account.`);
  }

  function placeHold(bookId, patronId){
    const data = getData();
    const b = data.books.find(x=>x.id === bookId);
    if(!b){
      toast('Not found', 'That book could not be found.');
      return;
    }

    const existing = data.holds.find(h=>h.bookId===bookId && h.patronId===patronId);
    if(existing){
      toast('Already on hold', 'You already placed a hold for this title.');
      return;
    }

    data.holds.push({id: uid('h'), patronId, bookId, placedOn: todayISO()});
    saveData(data);

    toast('Hold placed', `You are in the hold queue for “${b.title}”.`);
  }

  function signOut(){
    setSession({patronId:null, isAdmin:false});
    toast('Signed out', 'You have been signed out.');
    setTimeout(()=>{ window.location.href = 'index.html'; }, 250);
  }

  function initHeaderSessionUI(){
    const data = getData();
    const p = patron();
    const mount = $('[data-session-ui]');
    if(!mount) return;

    // Simplify navigation when patron is signed in
    const nav = $('.nav');
    if(nav && p){
      const currentPage = document.body.getAttribute('data-page');
      // Keep only Home and Catalog links
      const allNavLinks = nav.querySelectorAll('a');
      allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        const navAttr = link.getAttribute('data-nav');
        // Hide links that are not Home or Catalog
        if(navAttr !== 'home' && navAttr !== 'catalog' && href !== 'index.html' && href !== 'catalog.html'){
          link.style.display = 'none';
        }
      });
    }

    if(p){
      const currentPage = document.body.getAttribute('data-page');
      const isOnPatronAccount = currentPage === 'patron-account';
      
      // Don't show "Patron Account" button if already on that page
      const accountButton = isOnPatronAccount ? '' : `<a class="btn" href="patron-account.html">Patron Account</a>`;
      
      mount.innerHTML = `
        <span class="badge">Signed in as <b style="color:var(--text)">${escapeHtml(p.name)}</b></span>
        ${accountButton}
        <button class="btn danger" type="button" data-signout>Sign out</button>
      `;
      $('[data-signout]', mount).addEventListener('click', signOut);
      return;
    }

    // Restore all navigation links when not signed in
    if(nav){
      const allNavLinks = nav.querySelectorAll('a');
      allNavLinks.forEach(link => {
        link.style.display = '';
      });
    }

    mount.innerHTML = `
      <a class="btn primary" href="patron-login.html">Patron Sign in</a>
      <a class="btn" href="membership.html">Get a Library Card</a>
    `;
  }

  function initHome(){
    const data = getData();

    const featured = data.books.filter(b=>b.featured).slice(0,6);
    const arrivals = data.books.filter(b=>b.newArrival).slice(0,6);

    renderCatalog(featured, $('[data-featured]'));
    renderCatalog(arrivals, $('[data-arrivals]'));

    const lib = data.library;
    const info = $('[data-library-info]');
    if(info){
      info.innerHTML = `
        <div class="meta"><b>Timings</b><span>${escapeHtml(lib.timings)}</span></div>
        <div class="meta"><b>Address</b><span>${escapeHtml(lib.address)}, ${escapeHtml(lib.city)}</span></div>
        <div class="meta"><b>Contact</b><span>${escapeHtml(lib.phone)} • ${escapeHtml(lib.email)}</span></div>
      `;
    }
  }

  function initCatalogPage(){
    const data = getData();
    const isAdmin = data.session.isAdmin;

    const mount = $('[data-catalog]');
    const search = $('[data-search]');
    const subject = $('[data-subject]');
    const availability = $('[data-availability]');

    // Show/hide admin controls
    const adminSection = $('[data-admin-section]');
    const adminAddBtn = $('[data-admin-add-book]');
    const patronLink = $('[data-patron-link]');
    
    if(isAdmin){
      if(adminSection) adminSection.style.display = 'block';
      if(adminAddBtn) adminAddBtn.style.display = 'inline-flex';
      if(patronLink) patronLink.style.display = 'none';
    } else {
      if(adminSection) adminSection.style.display = 'none';
      if(adminAddBtn) adminAddBtn.style.display = 'none';
      if(patronLink) patronLink.style.display = 'inline-flex';
    }

    if(subject){
      const subjects = Array.from(new Set(data.books.map(b=>b.subject))).sort();
      subject.innerHTML = `<option value="">All subjects</option>` + subjects.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    }

    function filter(){
      const q = (search?.value || '').trim().toLowerCase();
      const sub = subject?.value || '';
      const av = availability?.value || '';

      const list = data.books.filter(b=>{
        const matchQ = !q || [b.title,b.author,b.subject,b.isbn,b.id].some(x=>String(x).toLowerCase().includes(q));
        const matchSub = !sub || b.subject === sub;
        const matchAv = !av || (av==='available' ? b.available : !b.available);
        return matchQ && matchSub && matchAv;
      });

      renderCatalog(list, mount, isAdmin);
      const count = $('[data-result-count]');
      if(count) count.textContent = `${list.length} result(s)`;
    }

    ['input','change'].forEach(evt=>{
      search?.addEventListener(evt, filter);
      subject?.addEventListener(evt, filter);
      availability?.addEventListener(evt, filter);
    });

    filter();

    // Admin: Add book
    const addForm = $('[data-add-book-form]');
    if(addForm && isAdmin){
      addForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const dataNow = getData();
        const title = ($('[name=title]', addForm)?.value || '').trim();
        const author = ($('[name=author]', addForm)?.value || '').trim();
        const subject = ($('[name=subject]', addForm)?.value || '').trim();
        const isbn = ($('[name=isbn]', addForm)?.value || '').trim();
        const format = ($('[name=format]', addForm)?.value || '').trim();
        const location = ($('[name=location]', addForm)?.value || '').trim();
        const cover = ($('[name=cover]', addForm)?.value || '').trim();
        
        if(!title || !author){
          toast('Missing details', 'Please provide at least title and author.');
          return;
        }

        dataNow.books.push({
          id: uid('b'),
          title,
          author,
          subject: subject || 'General',
          isbn: isbn || '—',
          format: format || 'Print',
          location: location || 'Stacks',
          cover: cover || undefined,
          available: true,
          featured: false,
          newArrival: true
        });
        saveData(dataNow);
        toast('Added', 'New book added to catalog.');
        addForm.reset();
        if(adminSection) adminSection.style.display = 'none';
        filter();
      });
    }

    // Admin: Toggle add form
    adminAddBtn?.addEventListener('click', ()=>{
      if(adminSection) adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
      if(adminSection && adminSection.style.display === 'block'){
        adminSection.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });

    $('[data-cancel-add-book]')?.addEventListener('click', ()=>{
      if(adminSection) adminSection.style.display = 'none';
      if(addForm) addForm.reset();
    });

    // Admin: Delete book and toggle availability
    if(isAdmin){
      mount?.addEventListener('click', (e)=>{
        const deleteBtn = e.target.closest('[data-delete-book]');
        if(deleteBtn){
          const bookId = deleteBtn.getAttribute('data-delete-book');
          const book = data.books.find(x=>x.id===bookId);
          if(!book) return;
          
          if(confirm(`Delete book "${book.title}" from catalog?`)){
            const dataNow = getData();
            dataNow.books = dataNow.books.filter(x=>x.id!==bookId);
            dataNow.loans = dataNow.loans.filter(l=>l.bookId!==bookId);
            dataNow.holds = dataNow.holds.filter(h=>h.bookId!==bookId);
            saveData(dataNow);
            toast('Deleted', `Book "${book.title}" has been removed.`);
            filter();
          }
          return;
        }

        const toggleBtn = e.target.closest('[data-toggle-avail]');
        if(toggleBtn){
          const bookId = toggleBtn.getAttribute('data-toggle-avail');
          const dataNow = getData();
          const book = dataNow.books.find(x=>x.id===bookId);
          if(book){
            book.available = !book.available;
            saveData(dataNow);
            toast('Updated', `Availability updated for "${book.title}".`);
            filter();
          }
        }
      });
    }

    if(window.location.hash){
      const id = decodeURIComponent(window.location.hash.slice(1));
      setTimeout(()=>{
        const el = document.querySelector(`[data-book-card="${CSS.escape(id)}"]`);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }, 200);
    }
  }

  function initPatronLogin(){
    const data = getData();

    const form = $('[data-login-form]');
    const email = $('[name=email]');

    const quick = $('[data-quick-login]');
    if(quick){
      quick.innerHTML = data.patrons.map(p=>{
        return `<button type="button" class="btn" data-login="${p.id}">${escapeHtml(p.name)}</button>`;
      }).join('');

      quick.addEventListener('click', (e)=>{
        const btn = e.target.closest('[data-login]');
        if(!btn) return;
        const pid = btn.getAttribute('data-login');
        const p = data.patrons.find(x=>x.id===pid);
        if(!p) return;
        setSession({patronId:p.id, isAdmin:false});
        toast('Welcome', `Signed in as ${p.name}.`);
        setTimeout(()=>{ window.location.href = 'patron-account.html'; }, 250);
      });
    }

    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const value = (email?.value || '').trim().toLowerCase();
      const p = data.patrons.find(x=>x.email.toLowerCase() === value);
      if(!p){
        toast('Sign-in failed', 'No patron account found for that email. Use quick sign-in for the demo.');
        return;
      }
      setSession({patronId:p.id, isAdmin:false});
      toast('Welcome', `Signed in as ${p.name}.`);
      setTimeout(()=>{ window.location.href = 'patron-account.html'; }, 250);
    });

    const adminForm = $('[data-admin-form]');
    adminForm?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const pin = ($('[name=adminPin]')?.value || '').trim();
      if(pin !== '1234'){
        toast('Access denied', 'Invalid admin PIN. (Demo PIN: 1234)');
        return;
      }
      setSession({isAdmin:true, patronId:null});
      toast('Admin access', 'Opening dashboard...');
      setTimeout(()=>{ window.location.href = 'dashboard.html'; }, 250);
    });
  }

  function renewalEligibility(data, loan, patronObj){
    const book = data.books.find(b=>b.id===loan.bookId);
    if(!book) return {ok:false, reason:'Book not found.'};

    if(loan.holdByOther) return {ok:false, reason:'This title is reserved by another patron.'};
    if(loan.renewalsUsed >= loan.maxRenewals) return {ok:false, reason:'Maximum renewal limit reached.'};

    const fines = Number(patronObj.fines || 0);
    if(fines >= patronObj.heavyFineThreshold) return {ok:false, reason:'Account has heavy fines. Please contact the help desk.'};

    return {ok:true, reason:'Eligible for renewal.'};
  }

  function renewLoan(loanId){
    const data = getData();
    const p = patron();
    if(!p){
      toast('Sign in required', 'Please sign in to renew items.');
      return;
    }

    const loan = data.loans.find(l=>l.id===loanId && l.patronId===p.id);
    if(!loan){
      toast('Not found', 'That loan could not be found.');
      return;
    }

    const check = renewalEligibility(data, loan, p);
    if(!check.ok){
      toast('Renewal blocked', check.reason);
      return;
    }

    loan.renewalsUsed += 1;
    loan.dueOn = addDaysISO(loan.dueOn, 14);
    saveData(data);

    toast('Renewed', `New due date: ${fmtDate(loan.dueOn)}.`);
  }

  function initPatronAccount(){
    const p = requirePatronOrRedirect();
    if(!p) return;

    const data = getData();
    const name = $('[data-patron-name]');
    if(name) name.textContent = p.name;

    // Calculate statistics
    const allLoans = data.loans.filter(l=>l.patronId===p.id);
    const activeLoans = allLoans.filter(l=>!l.returnedOn);
    const returnedLoans = allLoans.filter(l=>l.returnedOn);
    const totalBorrowed = allLoans.length;
    const membershipDate = p.membershipDate || p.id; // Use ID as fallback for membership date
    const daysSinceMembership = Math.floor((Date.now() - new Date(membershipDate).getTime()) / (1000 * 60 * 60 * 24));
    const accountStatus = (p.fines || 0) > 50 ? 'Restricted' : 'Active';

    const summary = $('[data-patron-summary]');
    if(summary){
      summary.innerHTML = `
        <div class="col-3">
          <div class="meta">
            <b>📧 Email</b>
            <span>${escapeHtml(p.email || 'Not provided')}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>📞 Phone</b>
            <span>${escapeHtml(p.phone || 'Not provided')}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>💰 Fines</b>
            <span style="color:${(p.fines||0) > 0 ? 'var(--danger)' : 'var(--brand2)'}">$${Number(p.fines||0).toFixed(2)}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>📚 Active Loans</b>
            <span>${activeLoans.length} book${activeLoans.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>⏳ Holds</b>
            <span>${data.holds.filter(h=>h.patronId===p.id).length} item${data.holds.filter(h=>h.patronId===p.id).length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>📖 Total Borrowed</b>
            <span>${totalBorrowed} book${totalBorrowed !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>📅 Member Since</b>
            <span>${fmtDate(membershipDate)}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="meta">
            <b>✅ Account Status</b>
            <span class="badge ${accountStatus === 'Active' ? 'good' : 'bad'}">${accountStatus}</span>
          </div>
        </div>
      `;
    }

    const loans = data.loans.filter(l=>l.patronId===p.id && !l.returnedOn);
    const loansMount = $('[data-loans]');

    if(loansMount){
      if(!loans.length){
        loansMount.innerHTML = `
          <div class="card pad">
            <div class="note" style="text-align:center; padding:40px 20px">
              <div style="font-size:48px; margin-bottom:12px">📚</div>
              <div style="font-size:16px; font-weight:600; margin-bottom:8px; color:var(--text)">No borrowed items</div>
              <div style="color:var(--muted); margin-bottom:16px">Browse the catalog and reserve a book to see it here.</div>
              <a class="btn primary" href="catalog.html">Browse Catalog</a>
            </div>
          </div>
        `;
      }else{
        loansMount.innerHTML = `
          <div class="catalog">
            ${loans.map(l=>{
              const b = data.books.find(x=>x.id===l.bookId);
              const check = renewalEligibility(data, l, p);
              const dueDate = new Date(l.dueOn);
              const today = new Date();
              const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
              
              const dueBadge = isOverdue 
                ? `<span class="badge bad">Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}</span>`
                : isDueSoon 
                ? `<span class="badge warn">Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}</span>`
                : `<span class="badge good">Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}</span>`;
              
              const renewalBadge = check.ok ? '<span class="badge good">Renewable</span>' : '<span class="badge bad">Not renewable</span>';
              const btn = check.ok
                ? `<button class="btn success" type="button" data-renew="${l.id}">Renew Now</button>`
                : `<button class="btn" type="button" data-renew="${l.id}" title="${check.reason || 'Cannot renew'}">Why not?</button>`;
              
              const coverImage = b && b.cover 
                ? `<img src="${b.cover}" alt="${escapeHtml(b.title)} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'>${escapeHtml(b.title)}</div>'">`
                : `<div class="book-cover-placeholder">${escapeHtml(b ? b.title : l.bookId)}</div>`;

              return `
                <article class="book-card" data-loan-card="${l.id}">
                  <div class="book-cover">
                    ${coverImage}
                  </div>
                  <div class="book-top">
                    <div>
                      <h3 class="book-title">${escapeHtml(b ? b.title : l.bookId)}</h3>
                      <p class="book-sub">by ${escapeHtml(b ? b.author : 'Unknown Author')} • ${escapeHtml(b ? b.format : 'Print')}</p>
                    </div>
                  </div>
                  <div class="book-meta">
                    <div class="meta"><b>Borrowed</b><span>${fmtDate(l.borrowedOn)}</span></div>
                    <div class="meta"><b>Due Date</b><span>${fmtDate(l.dueOn)}</span></div>
                    <div class="meta"><b>Renewals</b><span>${l.renewalsUsed} of ${l.maxRenewals} used</span></div>
                    <div class="meta"><b>Status</b><span>${l.holdByOther ? '<span class="badge warn">Reserved by another</span>' : '<span class="badge">Available</span>'}</span></div>
                  </div>
                  <div class="book-badges">
                    ${dueBadge}
                    ${renewalBadge}
                    <span class="badge-spacer"></span>
                  </div>
                  <div class="book-actions">
                    ${btn}
                    <a class="btn" href="catalog.html#${encodeURIComponent(l.bookId)}">View Details</a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
          <div class="note" style="margin-top:16px">
            <strong>Renewal Policy:</strong> Renewals are allowed when the item is not reserved by another patron, you have not exceeded the renewal limit (${p.maxRenewalsPerLoan} per loan), and your account does not have heavy fines.
          </div>
        `;
      }

      loansMount.addEventListener('click', (e)=>{
        const btn = e.target.closest('[data-renew]');
        if(!btn) return;
        const id = btn.getAttribute('data-renew');
        const dataNow = getData();
        const pNow = patron();
        const loan = dataNow.loans.find(x=>x.id===id);
        if(!loan || !pNow) return;

        const check = renewalEligibility(dataNow, loan, pNow);
        if(!check.ok){
          toast('Renewal blocked', check.reason);
          return;
        }
        renewLoan(id);
        setTimeout(()=>{ initPatronAccount(); }, 250);
      });
    }

    const holds = data.holds.filter(h=>h.patronId===p.id);
    const holdsMount = $('[data-holds]');
    if(holdsMount){
      if(!holds.length){
        holdsMount.innerHTML = `
          <div class="card pad">
            <div class="note" style="text-align:center; padding:40px 20px">
              <div style="font-size:48px; margin-bottom:12px">⏳</div>
              <div style="font-size:16px; font-weight:600; margin-bottom:8px; color:var(--text)">No active holds</div>
              <div style="color:var(--muted); margin-bottom:16px">Place a hold on unavailable items to be notified when they become available.</div>
              <a class="btn primary" href="catalog.html">Browse Catalog</a>
            </div>
          </div>
        `;
      }else{
        // Calculate position in queue
        const holdsWithPosition = holds.map(h=>{
          const sameBookHolds = data.holds.filter(x=>x.bookId===h.bookId).sort((a,b)=>new Date(a.placedOn) - new Date(b.placedOn));
          const position = sameBookHolds.findIndex(x=>x.id===h.id) + 1;
          const book = data.books.find(x=>x.id===h.bookId);
          return {...h, position, totalInQueue: sameBookHolds.length, book};
        });

        holdsMount.innerHTML = `
          <div class="catalog">
            ${holdsWithPosition.map(h=>{
              const b = h.book || data.books.find(x=>x.id===h.bookId);
              const isAvailable = b && b.available;
              const coverImage = b && b.cover 
                ? `<img src="${b.cover}" alt="${escapeHtml(b.title)} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'>${escapeHtml(b.title)}</div>'">`
                : `<div class="book-cover-placeholder">${escapeHtml(b ? b.title : h.bookId)}</div>`;

              return `
                <article class="book-card" data-hold-card="${h.id}">
                  <div class="book-cover">
                    ${coverImage}
                  </div>
                  <div class="book-top">
                    <div>
                      <h3 class="book-title">${escapeHtml(b ? b.title : h.bookId)}</h3>
                      <p class="book-sub">by ${escapeHtml(b ? b.author : 'Unknown Author')} • ${escapeHtml(b ? b.format : 'Print')}</p>
                    </div>
                  </div>
                  <div class="book-meta">
                    <div class="meta"><b>Placed On</b><span>${fmtDate(h.placedOn)}</span></div>
                    <div class="meta"><b>Queue Position</b><span>#${h.position} of ${h.totalInQueue}</span></div>
                    <div class="meta"><b>Status</b><span>${isAvailable ? '<span class="badge good">Available Now</span>' : '<span class="badge warn">Waiting</span>'}</span></div>
                    <div class="meta"><b>Subject</b><span>${escapeHtml(b ? b.subject : 'N/A')}</span></div>
                  </div>
                  <div class="book-badges">
                    ${isAvailable ? '<span class="badge good">Ready for Pickup</span>' : `<span class="badge warn">Position #${h.position}</span>`}
                    <span class="badge-spacer"></span>
                  </div>
                  <div class="book-actions">
                    ${isAvailable ? '<a class="btn primary" href="catalog.html">Reserve Now</a>' : '<button class="btn" disabled>Waiting in Queue</button>'}
                    <a class="btn" href="catalog.html#${encodeURIComponent(h.bookId)}">View Details</a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `;
      }
    }

    // Reading History
    const historyMount = $('[data-reading-history]');
    if(historyMount){
      const returnedLoans = data.loans.filter(l=>l.patronId===p.id && l.returnedOn).slice(0, 6);
      if(!returnedLoans.length){
        historyMount.innerHTML = `
          <div class="card pad">
            <div class="note" style="text-align:center; padding:40px 20px">
              <div style="font-size:48px; margin-bottom:12px">📖</div>
              <div style="font-size:16px; font-weight:600; margin-bottom:8px; color:var(--text)">No reading history yet</div>
              <div style="color:var(--muted)">Books you've returned will appear here.</div>
            </div>
          </div>
        `;
      }else{
        historyMount.innerHTML = `
          <div class="catalog">
            ${returnedLoans.map(l=>{
              const b = data.books.find(x=>x.id===l.bookId);
              const coverImage = b && b.cover 
                ? `<img src="${b.cover}" alt="${escapeHtml(b.title)} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'>${escapeHtml(b.title)}</div>'">`
                : `<div class="book-cover-placeholder">${escapeHtml(b ? b.title : l.bookId)}</div>`;

              return `
                <article class="book-card">
                  <div class="book-cover">
                    ${coverImage}
                  </div>
                  <div class="book-top">
                    <div>
                      <h3 class="book-title">${escapeHtml(b ? b.title : l.bookId)}</h3>
                      <p class="book-sub">by ${escapeHtml(b ? b.author : 'Unknown Author')}</p>
                    </div>
                  </div>
                  <div class="book-meta">
                    <div class="meta"><b>Borrowed</b><span>${fmtDate(l.borrowedOn)}</span></div>
                    <div class="meta"><b>Returned</b><span>${fmtDate(l.returnedOn)}</span></div>
                  </div>
                  <div class="book-badges">
                    <span class="badge">Completed</span>
                    <span class="badge-spacer"></span>
                  </div>
                  <div class="book-actions">
                    <a class="btn" href="catalog.html#${encodeURIComponent(l.bookId)}">View Again</a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
          ${returnedLoans.length >= 6 ? '<div class="note" style="margin-top:12px">Showing your 6 most recent returns. <a href="catalog.html">Browse more books</a> to continue reading!</div>' : ''}
        `;
      }
    }

    const form = $('[data-update-form]');
    if(form){
      const emailInput = $('[name=email]', form);
      const phoneInput = $('[name=phone]', form);
      if(emailInput) emailInput.value = p.email || '';
      if(phoneInput) phoneInput.value = p.phone || '';
      
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const dataNow = getData();
        const pNow = patron();
        if(!pNow) return;
        const phone = (phoneInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();

        const rec = dataNow.patrons.find(x=>x.id===pNow.id);
        if(rec){
          if(phone) rec.phone = phone;
          if(email) rec.email = email;
          saveData(dataNow);
          toast('Updated', 'Your contact details were updated successfully.');
          setTimeout(()=>{ window.location.reload(); }, 250);
        }
      });
    }
  }

  function requireAdminOrRedirect(){
    const data = getData();
    if(data.session.isAdmin) return true;
    toast('Admin only', 'Please sign in as admin to access the dashboard.');
    setTimeout(()=>{ window.location.href = 'patron-login.html'; }, 350);
    return false;
  }

  function getUserRole(){
    const data = getData();
    if(data.session.isAdmin) return 'admin';
    if(data.session.patronId) return 'user';
    return 'guest';
  }

  function initDashboard(){
    const data = getData();
    const role = getUserRole();
    const isAdmin = role === 'admin';
    const isUser = role === 'user';
    const isGuest = role === 'guest';

    // Update header session UI based on role
    const sessionUI = $('[data-session-ui]');
    if(sessionUI){
      if(isAdmin){
        sessionUI.innerHTML = `
          <span class="badge">Admin Mode</span>
          <button class="btn danger" type="button" data-admin-signout>Sign out</button>
        `;
      } else if(isUser){
        const p = patron();
        sessionUI.innerHTML = `
          <span class="badge">Signed in as <b style="color:var(--text)">${escapeHtml(p.name)}</b></span>
          <button class="btn danger" type="button" data-signout>Sign out</button>
        `;
        $('[data-signout]')?.addEventListener('click', signOut);
      } else {
        sessionUI.innerHTML = `
          <a class="btn primary" href="patron-login.html">Sign in</a>
        `;
      }
      
      $('[data-admin-signout]')?.addEventListener('click', ()=>{
        setSession({isAdmin:false, patronId:null});
        toast('Signed out', 'Admin session ended.');
        setTimeout(()=>{ window.location.reload(); }, 250);
      });
    }

    // Apply role-based visibility
    function applyRoleVisibility(){
      // Admin sections - always visible for admin
      const adminSections = $$('[data-admin-section]');
      adminSections.forEach(section => {
        section.style.display = isAdmin ? 'block' : 'none';
      });

      // Admin buttons
      const adminButtons = $$('[data-admin-add-book], [data-admin-add-event]');
      adminButtons.forEach(btn => {
        btn.style.display = isAdmin ? 'inline-flex' : 'none';
      });

      // Role hints
      const roleHints = $$('[data-role-hint]');
      roleHints.forEach(hint => {
        if(isAdmin){
          hint.textContent = 'Admin: You can add, edit, and delete items.';
        } else if(isUser){
          hint.textContent = 'User: You can view and interact with items.';
        } else {
          hint.textContent = 'Guest: Browse and view information only.';
        }
      });

      // User controls - show reserve/hold buttons for users, sign in prompt for guests
      const userActions = $$('[data-user-action]');
      userActions.forEach(action => {
        action.style.display = isUser ? 'inline-flex' : 'none';
      });
    }

    // Smooth scroll for section navigation with header offset
    const sectionNavs = $$('.section-nav');
    sectionNavs.forEach(nav => {
      nav.addEventListener('click', (e)=>{
        e.preventDefault();
        const section = nav.getAttribute('data-section');
        const target = $(`#${section}`);
        if(target){
          // Calculate header height (approximately 80px including padding)
          const headerHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Initialize dashboard overview
    function initDashboardOverview(){
      const statsMount = $('[data-dashboard-stats]');
      if(!statsMount) return;

      const totalBooks = data.books.length;
      const availableBooks = data.books.filter(b=>b.available).length;
      const checkedOutBooks = totalBooks - availableBooks;
      const totalPatrons = data.patrons.length;
      const activeLoans = data.loans.filter(l=>!l.returnedOn).length;
      const activeHolds = data.holds.length;
      const totalEvents = (data.events || []).length;
      const overdueLoans = data.loans.filter(l=>{
        if(l.returnedOn) return false;
        const dueDate = new Date(l.dueOn);
        const today = new Date();
        return dueDate < today;
      }).length;
      const totalFines = data.patrons.reduce((sum, p)=>sum + (Number(p.fines) || 0), 0);

      statsMount.innerHTML = `
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Total Books</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">${totalBooks}</div>
              </div>
              <div style="font-size:36px">📚</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>${availableBooks} available</span>
              <span>•</span>
              <span>${checkedOutBooks} checked out</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Total Patrons</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">${totalPatrons}</div>
              </div>
              <div style="font-size:36px">👥</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>${activeLoans} active loans</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Active Loans</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">${activeLoans}</div>
              </div>
              <div style="font-size:36px">📖</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>${overdueLoans > 0 ? `<span style="color:var(--danger)">${overdueLoans} overdue</span>` : 'All on time'}</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Active Holds</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">${activeHolds}</div>
              </div>
              <div style="font-size:36px">🔖</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>Pending requests</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Upcoming Events</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">${totalEvents}</div>
              </div>
              <div style="font-size:36px">📅</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>Scheduled programs</span>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card pad" style="min-height:140px">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
              <div>
                <div style="color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">Total Fines</div>
                <div style="font-size:32px; font-weight:700; color:var(--brand)">$${totalFines.toFixed(2)}</div>
              </div>
              <div style="font-size:36px">💰</div>
            </div>
            <div style="display:flex; gap:8px; font-size:12px; color:var(--muted)">
              <span>Outstanding balance</span>
            </div>
          </div>
        </div>
      `;
    }

    const patronsMount = $('[data-admin-patrons]');
    const loansMount = $('[data-admin-loans]');
    const holdsMount = $('[data-admin-holds]');
    const membersMount = $('[data-admin-members]');

    function renderPatrons(){
      if(!patronsMount) return;
      if(!data.patrons.length){
        patronsMount.innerHTML = '<div class="note">No patrons registered yet.</div>';
        return;
      }

      const rows = data.patrons.map(p=>{
        const activeLoans = data.loans.filter(l=>l.patronId===p.id && !l.returnedOn).length;
        const totalLoans = data.loans.filter(l=>l.patronId===p.id).length;
        const activeHolds = data.holds.filter(h=>h.patronId===p.id).length;
        const accountStatus = (p.fines || 0) > 50 ? 'Restricted' : 'Active';
        
        return `
          <tr>
            <td>
              <div style="display:grid; gap:4px">
                <b>${escapeHtml(p.name)}</b>
                <div style="color:var(--muted); font-size:12px">${escapeHtml(p.email || 'No email')}</div>
                <div style="color:var(--muted); font-size:12px">${escapeHtml(p.phone || 'No phone')}</div>
              </div>
            </td>
            <td>${fmtDate(p.membershipDate || p.id)}</td>
            <td>${activeLoans}</td>
            <td>${activeHolds}</td>
            <td>$${Number(p.fines||0).toFixed(2)}</td>
            <td><span class="badge ${accountStatus === 'Active' ? 'good' : 'bad'}">${accountStatus}</span></td>
            <td>
              <button class="btn" type="button" data-edit-patron="${p.id}">Edit</button>
              <button class="btn danger" type="button" data-delete-patron="${p.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      patronsMount.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Patron</th>
              <th>Member Since</th>
              <th>Active Loans</th>
              <th>Holds</th>
              <th>Fines</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    function renderLoans(){
      if(!loansMount) return;
      const activeLoans = data.loans.filter(l=>!l.returnedOn);
      if(!activeLoans.length){
        loansMount.innerHTML = '<div class="note">No active loans.</div>';
        return;
      }

      const rows = activeLoans.map(l=>{
        const b = data.books.find(x=>x.id===l.bookId);
        const p = data.patrons.find(x=>x.id===l.patronId);
        const dueDate = new Date(l.dueOn);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDue < 0;
        
        return `
          <tr>
            <td><b>${escapeHtml(b ? b.title : l.bookId)}</b><div style="color:var(--muted); font-size:12px">${escapeHtml(b ? b.author : '')}</div></td>
            <td>${escapeHtml(p ? p.name : l.patronId)}</td>
            <td>${fmtDate(l.borrowedOn)}</td>
            <td>${fmtDate(l.dueOn)} ${isOverdue ? '<span class="badge bad">Overdue</span>' : ''}</td>
            <td>${l.renewalsUsed}/${l.maxRenewals}</td>
            <td>${l.holdByOther ? '<span class="badge warn">Has hold</span>' : '<span class="badge">No hold</span>'}</td>
            <td>
              <button class="btn success" type="button" data-return-loan="${l.id}">Return</button>
            </td>
          </tr>
        `;
      }).join('');

      loansMount.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Patron</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Renewals</th>
              <th>Holds</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    function renderHolds(){
      if(!holdsMount) return;
      if(!data.holds.length){
        holdsMount.innerHTML = '<div class="note">No active holds.</div>';
        return;
      }

      const rows = data.holds.map(h=>{
        const b = data.books.find(x=>x.id===h.bookId);
        const p = data.patrons.find(x=>x.id===h.patronId);
        const sameBookHolds = data.holds.filter(x=>x.bookId===h.bookId).sort((a,b)=>new Date(a.placedOn) - new Date(b.placedOn));
        const position = sameBookHolds.findIndex(x=>x.id===h.id) + 1;
        const isAvailable = b && b.available;
        
        return `
          <tr>
            <td><b>${escapeHtml(b ? b.title : h.bookId)}</b><div style="color:var(--muted); font-size:12px">${escapeHtml(b ? b.author : '')}</div></td>
            <td>${escapeHtml(p ? p.name : h.patronId)}</td>
            <td>${fmtDate(h.placedOn)}</td>
            <td>#${position} of ${sameBookHolds.length}</td>
            <td>${isAvailable ? '<span class="badge good">Available</span>' : '<span class="badge warn">Waiting</span>'}</td>
            <td>
              <button class="btn danger" type="button" data-delete-hold="${h.id}">Remove</button>
            </td>
          </tr>
        `;
      }).join('');

      holdsMount.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Patron</th>
              <th>Placed On</th>
              <th>Position</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // Initialize Catalog section
    function initCatalogSection(){
      const mount = $('[data-catalog]');
      const search = $('[data-search]');
      const subject = $('[data-subject]');
      const availability = $('[data-availability]');
      const adminSection = $('[data-content-section="catalog"] [data-admin-section]');
      const adminAddBtn = $('[data-admin-add-book]');

      if(subject){
        const subjects = Array.from(new Set(data.books.map(b=>b.subject))).sort();
        subject.innerHTML = `<option value="">All subjects</option>` + subjects.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
      }

      function filter(){
        const q = (search?.value || '').trim().toLowerCase();
        const sub = subject?.value || '';
        const av = availability?.value || '';

        const list = data.books.filter(b=>{
          const matchQ = !q || [b.title,b.author,b.subject,b.isbn,b.id].some(x=>String(x).toLowerCase().includes(q));
          const matchSub = !sub || b.subject === sub;
          const matchAv = !av || (av==='available' ? b.available : !b.available);
          return matchQ && matchSub && matchAv;
        });

        // Pass role info to renderCatalog - admin gets full control, users get interaction, guests get read-only
        renderCatalog(list, mount, isAdmin);
        const count = $('[data-result-count]');
        if(count) count.textContent = `${list.length} result(s)`;
      }

      ['input','change'].forEach(evt=>{
        search?.addEventListener(evt, filter);
        subject?.addEventListener(evt, filter);
        availability?.addEventListener(evt, filter);
      });

      filter();

      // Admin: Add book
      const addForm = $('[data-add-book-form]');
      if(addForm && isAdmin){
        addForm.addEventListener('submit', (e)=>{
          e.preventDefault();
          const dataNow = getData();
          const title = ($('[name=title]', addForm)?.value || '').trim();
          const author = ($('[name=author]', addForm)?.value || '').trim();
          const subject = ($('[name=subject]', addForm)?.value || '').trim();
          const isbn = ($('[name=isbn]', addForm)?.value || '').trim();
          const format = ($('[name=format]', addForm)?.value || '').trim();
          const location = ($('[name=location]', addForm)?.value || '').trim();
          const cover = ($('[name=cover]', addForm)?.value || '').trim();
          
          if(!title || !author){
            toast('Missing details', 'Please provide at least title and author.');
            return;
          }

          dataNow.books.push({
            id: uid('b'),
            title,
            author,
            subject: subject || 'General',
            isbn: isbn || '—',
            format: format || 'Print',
            location: location || 'Stacks',
            cover: cover || undefined,
            available: true,
            featured: false,
            newArrival: true
          });
          saveData(dataNow);
          toast('Added', 'New book added to catalog.');
          addForm.reset();
          if(adminSection) adminSection.style.display = 'none';
          filter();
        });
      }

      adminAddBtn?.addEventListener('click', ()=>{
        if(adminSection) adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
        if(adminSection && adminSection.style.display === 'block'){
          const headerHeight = 80;
          const targetPosition = adminSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });

      $('[data-cancel-add-book]')?.addEventListener('click', ()=>{
        if(adminSection) adminSection.style.display = 'none';
        if(addForm) addForm.reset();
      });

      // Admin: Delete book and toggle availability
      if(isAdmin){
        mount?.addEventListener('click', (e)=>{
          const deleteBtn = e.target.closest('[data-delete-book]');
          if(deleteBtn){
            const bookId = deleteBtn.getAttribute('data-delete-book');
            const book = data.books.find(x=>x.id===bookId);
            if(!book) return;
            
            if(confirm(`Delete book "${book.title}" from catalog?`)){
              const dataNow = getData();
              dataNow.books = dataNow.books.filter(x=>x.id!==bookId);
              dataNow.loans = dataNow.loans.filter(l=>l.bookId!==bookId);
              dataNow.holds = dataNow.holds.filter(h=>h.bookId!==bookId);
              saveData(dataNow);
              toast('Deleted', `Book "${book.title}" has been removed.`);
              filter();
            }
            return;
          }

          const toggleBtn = e.target.closest('[data-toggle-avail]');
          if(toggleBtn){
            const bookId = toggleBtn.getAttribute('data-toggle-avail');
            const dataNow = getData();
            const book = dataNow.books.find(x=>x.id===bookId);
            if(book){
              book.available = !book.available;
              saveData(dataNow);
              toast('Updated', `Availability updated for "${book.title}".`);
              filter();
            }
          }
        });
      }
    }

    // Initialize Events section
    function initEventsSection(){
      const eventsList = $('[data-events-list]');
      const adminSection = $('[data-content-section="events"] [data-admin-section]');
      const adminAddBtn = $('[data-admin-add-event]');

      function renderEvents(){
        if(!eventsList) return;
        const events = data.events || [];
        
        if(!events.length){
          eventsList.innerHTML = '<div class="col-12"><div class="note">No events scheduled.</div></div>';
          return;
        }

        eventsList.innerHTML = events.map(e=>{
          const deleteBtn = isAdmin ? `<button class="btn danger" type="button" data-delete-event="${e.id}" style="margin-top:12px">Delete</button>` : '';
          return `
            <div class="col-6">
              <div class="card pad">
                <div class="section-title">
                  <h2>${escapeHtml(e.title)}</h2>
                  <p>${escapeHtml(e.schedule)}</p>
                </div>
                <div class="note">
                  ${e.time ? `Time: ${escapeHtml(e.time)}<br />` : ''}
                  ${e.location ? `Location: ${escapeHtml(e.location)}<br />` : ''}
                  ${e.description ? escapeHtml(e.description) : ''}
                </div>
                ${deleteBtn}
              </div>
            </div>
          `;
        }).join('');
      }

      renderEvents();

      // Admin: Add event
      const addForm = $('[data-add-event-form]');
      if(addForm && isAdmin){
        addForm.addEventListener('submit', (e)=>{
          e.preventDefault();
          const dataNow = getData();
          const title = ($('[name=title]', addForm)?.value || '').trim();
          const schedule = ($('[name=schedule]', addForm)?.value || '').trim();
          const time = ($('[name=time]', addForm)?.value || '').trim();
          const location = ($('[name=location]', addForm)?.value || '').trim();
          const description = ($('[name=description]', addForm)?.value || '').trim();
          
          if(!title || !schedule){
            toast('Missing details', 'Please provide at least title and schedule.');
            return;
          }

          if(!dataNow.events) dataNow.events = [];
          dataNow.events.push({
            id: uid('e'),
            title,
            schedule,
            time: time || 'TBA',
            location: location || 'TBA',
            description: description || ''
          });
          saveData(dataNow);
          toast('Added', 'New event added.');
          addForm.reset();
          if(adminSection) adminSection.style.display = 'none';
          renderEvents();
        });
      }

      adminAddBtn?.addEventListener('click', ()=>{
        if(adminSection) adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
        if(adminSection && adminSection.style.display === 'block'){
          const headerHeight = 80;
          const targetPosition = adminSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });

      $('[data-cancel-add-event]')?.addEventListener('click', ()=>{
        if(adminSection) adminSection.style.display = 'none';
        if(addForm) addForm.reset();
      });

      // Admin: Delete event
      if(isAdmin){
        eventsList?.addEventListener('click', (e)=>{
          const deleteBtn = e.target.closest('[data-delete-event]');
          if(deleteBtn){
            const eventId = deleteBtn.getAttribute('data-delete-event');
            const event = data.events.find(x=>x.id===eventId);
            if(!event) return;
            
            if(confirm(`Delete event "${event.title}"?`)){
              const dataNow = getData();
              dataNow.events = dataNow.events.filter(x=>x.id!==eventId);
              saveData(dataNow);
              toast('Deleted', `Event "${event.title}" has been removed.`);
              renderEvents();
            }
          }
        });
      }
    }

    // Initialize Membership section (patrons management)
    function initMembershipSection(){
      // Admin members view (if separate from patrons)
      if(membersMount && isAdmin){
        const patrons = data.patrons || [];
        if(!patrons.length){
          membersMount.innerHTML = '<div class="note">No members registered yet.</div>';
        } else {
          const rows = patrons.map(p=>{
            const activeLoans = data.loans.filter(l=>l.patronId===p.id && !l.returnedOn).length;
            const accountStatus = (p.fines || 0) > 50 ? 'Restricted' : 'Active';
            
            return `
              <tr>
                <td>
                  <div style="display:grid; gap:4px">
                    <b>${escapeHtml(p.name)}</b>
                    <div style="color:var(--muted); font-size:12px">${escapeHtml(p.email || 'No email')}</div>
                    <div style="color:var(--muted); font-size:12px">${escapeHtml(p.phone || 'No phone')}</div>
                  </div>
                </td>
                <td>${fmtDate(p.membershipDate || p.id)}</td>
                <td>${activeLoans}</td>
                <td>$${Number(p.fines||0).toFixed(2)}</td>
                <td><span class="badge ${accountStatus === 'Active' ? 'good' : 'bad'}">${accountStatus}</span></td>
                <td>
                  <button class="btn" type="button" data-edit-member="${p.id}">Edit</button>
                  <button class="btn danger" type="button" data-delete-member="${p.id}">Delete</button>
                </td>
              </tr>
            `;
          }).join('');

          membersMount.innerHTML = `
            <table class="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Member Since</th>
                  <th>Active Loans</th>
                  <th>Fines</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `;

          // Edit/Delete member handlers
          membersMount.addEventListener('click', (e)=>{
            const editBtn = e.target.closest('[data-edit-member]');
            if(editBtn){
              const patronId = editBtn.getAttribute('data-edit-member');
              const p = data.patrons.find(x=>x.id===patronId);
              if(!p) return;
              
              const newFines = prompt(`Update fines for ${p.name} (current: $${Number(p.fines||0).toFixed(2)}):`, p.fines || 0);
              if(newFines !== null){
                const fines = parseFloat(newFines) || 0;
                p.fines = fines;
                saveData(data);
                toast('Updated', `Fines updated for ${p.name}.`);
                initMembershipSection();
              }
              return;
            }

            const deleteBtn = e.target.closest('[data-delete-member]');
            if(deleteBtn){
              const patronId = deleteBtn.getAttribute('data-delete-member');
              const p = data.patrons.find(x=>x.id===patronId);
              if(!p) return;
              
              if(confirm(`Delete member "${p.name}"? This will also remove all their loans and holds.`)){
                const dataNow = getData();
                dataNow.patrons = dataNow.patrons.filter(x=>x.id!==patronId);
                dataNow.loans = dataNow.loans.filter(l=>l.patronId!==patronId);
                dataNow.holds = dataNow.holds.filter(h=>h.patronId!==patronId);
                saveData(dataNow);
                toast('Deleted', `Member "${p.name}" has been removed.`);
                initMembershipSection();
                renderPatrons();
                renderLoans();
                renderHolds();
              }
            }
          });
        }
      }
    }

    // Apply role-based visibility
    applyRoleVisibility();

    // Initialize all sections
    initDashboardOverview();
    renderPatrons();
    renderLoans();
    renderHolds();
    initCatalogSection();
    initEventsSection();
    initMembershipSection();

    // Edit patron
    patronsMount?.addEventListener('click', (e)=>{
      const editBtn = e.target.closest('[data-edit-patron]');
      if(editBtn){
        const patronId = editBtn.getAttribute('data-edit-patron');
        const p = data.patrons.find(x=>x.id===patronId);
        if(!p) return;
        
        const newFines = prompt(`Update fines for ${p.name} (current: $${Number(p.fines||0).toFixed(2)}):`, p.fines || 0);
        if(newFines !== null){
          const fines = parseFloat(newFines) || 0;
          p.fines = fines;
          saveData(data);
          toast('Updated', `Fines updated for ${p.name}.`);
          renderPatrons();
        }
        return;
      }

      const deleteBtn = e.target.closest('[data-delete-patron]');
      if(deleteBtn){
        const patronId = deleteBtn.getAttribute('data-delete-patron');
        const p = data.patrons.find(x=>x.id===patronId);
        if(!p) return;
        
        if(confirm(`Delete patron "${p.name}"? This will also remove all their loans and holds.`)){
          data.patrons = data.patrons.filter(x=>x.id!==patronId);
          data.loans = data.loans.filter(l=>l.patronId!==patronId);
          data.holds = data.holds.filter(h=>h.patronId!==patronId);
          saveData(data);
          toast('Deleted', `Patron "${p.name}" has been removed.`);
          renderPatrons();
          renderLoans();
          renderHolds();
        }
      }
    });

    // Return loan
    loansMount?.addEventListener('click', (e)=>{
      const returnBtn = e.target.closest('[data-return-loan]');
      if(returnBtn){
        const loanId = returnBtn.getAttribute('data-return-loan');
        const loan = data.loans.find(x=>x.id===loanId);
        if(!loan) return;
        
        loan.returnedOn = todayISO();
        const book = data.books.find(x=>x.id===loan.bookId);
        if(book) book.available = true;
        saveData(data);
        toast('Returned', 'Book has been returned.');
        renderLoans();
        renderPatrons();
      }
    });

    // Delete hold
    holdsMount?.addEventListener('click', (e)=>{
      const deleteBtn = e.target.closest('[data-delete-hold]');
      if(deleteBtn){
        const holdId = deleteBtn.getAttribute('data-delete-hold');
        const hold = data.holds.find(x=>x.id===holdId);
        if(!hold) return;
        
        data.holds = data.holds.filter(x=>x.id!==holdId);
        saveData(data);
        toast('Removed', 'Hold has been removed.');
        renderHolds();
      }
    });

    const signOutBtn = $('[data-admin-signout]');
    signOutBtn?.addEventListener('click', ()=>{
      setSession({isAdmin:false, patronId:null});
      toast('Signed out', 'Admin session ended.');
      setTimeout(()=>{ window.location.href = 'index.html'; }, 250);
    });

    // Reset button removed - no reset functionality needed
  }

  function initEventsPage(){
    const data = getData();
    const isAdmin = data.session.isAdmin;
    const eventsList = $('[data-events-list]');
    const adminSection = $('[data-admin-section]');
    const adminAddBtn = $('[data-admin-add-event]');

    if(isAdmin){
      if(adminSection) adminSection.style.display = 'block';
      if(adminAddBtn) adminAddBtn.style.display = 'inline-flex';
    } else {
      if(adminSection) adminSection.style.display = 'none';
      if(adminAddBtn) adminAddBtn.style.display = 'none';
    }

    function renderEvents(){
      if(!eventsList) return;
      const events = data.events || [];
      
      if(!events.length){
        eventsList.innerHTML = '<div class="col-12"><div class="note">No events scheduled.</div></div>';
        return;
      }

      eventsList.innerHTML = events.map(e=>{
        const deleteBtn = isAdmin ? `<button class="btn danger" type="button" data-delete-event="${e.id}" style="margin-top:12px">Delete</button>` : '';
        return `
          <div class="col-6">
            <div class="card pad">
              <div class="section-title">
                <h2>${escapeHtml(e.title)}</h2>
                <p>${escapeHtml(e.schedule)}</p>
              </div>
              <div class="note">
                ${e.time ? `Time: ${escapeHtml(e.time)}<br />` : ''}
                ${e.location ? `Location: ${escapeHtml(e.location)}<br />` : ''}
                ${e.description ? escapeHtml(e.description) : ''}
              </div>
              ${deleteBtn}
            </div>
          </div>
        `;
      }).join('');
    }

    renderEvents();

    // Admin: Add event
    const addForm = $('[data-add-event-form]');
    if(addForm && isAdmin){
      addForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const dataNow = getData();
        const title = ($('[name=title]', addForm)?.value || '').trim();
        const schedule = ($('[name=schedule]', addForm)?.value || '').trim();
        const time = ($('[name=time]', addForm)?.value || '').trim();
        const location = ($('[name=location]', addForm)?.value || '').trim();
        const description = ($('[name=description]', addForm)?.value || '').trim();
        
        if(!title || !schedule){
          toast('Missing details', 'Please provide at least title and schedule.');
          return;
        }

        if(!dataNow.events) dataNow.events = [];
        dataNow.events.push({
          id: uid('e'),
          title,
          schedule,
          time: time || 'TBA',
          location: location || 'TBA',
          description: description || ''
        });
        saveData(dataNow);
        toast('Added', 'New event added.');
        addForm.reset();
        if(adminSection) adminSection.style.display = 'none';
        renderEvents();
      });
    }

    // Admin: Toggle add form
    adminAddBtn?.addEventListener('click', ()=>{
      if(adminSection) adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
      if(adminSection && adminSection.style.display === 'block'){
        adminSection.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });

    $('[data-cancel-add-event]')?.addEventListener('click', ()=>{
      if(adminSection) adminSection.style.display = 'none';
      if(addForm) addForm.reset();
    });

    // Admin: Delete event
    if(isAdmin){
      eventsList?.addEventListener('click', (e)=>{
        const deleteBtn = e.target.closest('[data-delete-event]');
        if(deleteBtn){
          const eventId = deleteBtn.getAttribute('data-delete-event');
          const event = data.events.find(x=>x.id===eventId);
          if(!event) return;
          
          if(confirm(`Delete event "${event.title}"?`)){
            const dataNow = getData();
            dataNow.events = dataNow.events.filter(x=>x.id!==eventId);
            saveData(dataNow);
            toast('Deleted', `Event "${event.title}" has been removed.`);
            renderEvents();
          }
        }
      });
    }
  }

  function initMembership(){
    const data = getData();
    const isAdmin = data.session.isAdmin;
    const adminSection = $('[data-admin-section]');
    const membersMount = $('[data-admin-members]');

    if(isAdmin && adminSection){
      adminSection.style.display = 'block';
    } else if(adminSection){
      adminSection.style.display = 'none';
    }

    // Admin: Render members list
    if(isAdmin && membersMount){
      const patrons = data.patrons || [];
      if(!patrons.length){
        membersMount.innerHTML = '<div class="note">No members registered yet.</div>';
      } else {
        const rows = patrons.map(p=>{
          const activeLoans = data.loans.filter(l=>l.patronId===p.id && !l.returnedOn).length;
          const accountStatus = (p.fines || 0) > 50 ? 'Restricted' : 'Active';
          
          return `
            <tr>
              <td>
                <div style="display:grid; gap:4px">
                  <b>${escapeHtml(p.name)}</b>
                  <div style="color:var(--muted); font-size:12px">${escapeHtml(p.email || 'No email')}</div>
                  <div style="color:var(--muted); font-size:12px">${escapeHtml(p.phone || 'No phone')}</div>
                </div>
              </td>
              <td>${fmtDate(p.membershipDate || p.id)}</td>
              <td>${activeLoans}</td>
              <td>$${Number(p.fines||0).toFixed(2)}</td>
              <td><span class="badge ${accountStatus === 'Active' ? 'good' : 'bad'}">${accountStatus}</span></td>
              <td>
                <button class="btn" type="button" data-edit-member="${p.id}">Edit</button>
                <button class="btn danger" type="button" data-delete-member="${p.id}">Delete</button>
              </td>
            </tr>
          `;
        }).join('');

        membersMount.innerHTML = `
          <table class="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Member Since</th>
                <th>Active Loans</th>
                <th>Fines</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;

        // Edit/Delete member handlers
        membersMount.addEventListener('click', (e)=>{
          const editBtn = e.target.closest('[data-edit-member]');
          if(editBtn){
            const patronId = editBtn.getAttribute('data-edit-member');
            const p = data.patrons.find(x=>x.id===patronId);
            if(!p) return;
            
            const newFines = prompt(`Update fines for ${p.name} (current: $${Number(p.fines||0).toFixed(2)}):`, p.fines || 0);
            if(newFines !== null){
              const fines = parseFloat(newFines) || 0;
              p.fines = fines;
              saveData(data);
              toast('Updated', `Fines updated for ${p.name}.`);
              initMembership();
            }
            return;
          }

          const deleteBtn = e.target.closest('[data-delete-member]');
          if(deleteBtn){
            const patronId = deleteBtn.getAttribute('data-delete-member');
            const p = data.patrons.find(x=>x.id===patronId);
            if(!p) return;
            
            if(confirm(`Delete member "${p.name}"? This will also remove all their loans and holds.`)){
              const dataNow = getData();
              dataNow.patrons = dataNow.patrons.filter(x=>x.id!==patronId);
              dataNow.loans = dataNow.loans.filter(l=>l.patronId!==patronId);
              dataNow.holds = dataNow.holds.filter(h=>h.patronId!==patronId);
              saveData(dataNow);
              toast('Deleted', `Member "${p.name}" has been removed.`);
              initMembership();
            }
          }
        });
      }
    }

    const form = $('[data-membership-form]');
    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = ($('[name=name]')?.value || '').trim();
      const email = ($('[name=email]')?.value || '').trim();
      if(!name || !email){
        toast('Missing details', 'Please fill in your name and email.');
        return;
      }

      const dataNow = getData();
      const existing = dataNow.patrons.find(p=>p.email.toLowerCase()===email.toLowerCase());
      if(existing){
        toast('Already registered', 'A patron account already exists for that email. Try signing in.');
        return;
      }

      const patronId = uid('p');
      dataNow.patrons.push({
        id: patronId,
        name,
        email,
        phone: ($('[name=phone]')?.value || '').trim(),
        fines: 0,
        maxRenewalsPerLoan: 2,
        heavyFineThreshold: 200
      });
      saveData(dataNow);

      toast('Registration submitted', 'Your patron account was created (demo). Signing you in...');
      setSession({patronId, isAdmin:false});
      setTimeout(()=>{ window.location.href = 'patron-account.html'; }, 450);
    });
  }

  function initTheme(){
    const THEME_KEY = 'plw_theme';
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    
    function setTheme(theme){
      if(theme === 'dark'){
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem(THEME_KEY, theme);
      
      const icons = $$('[data-theme-icon]');
      icons.forEach(icon => {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      });
    }
    
    setTheme(savedTheme);
    
    const toggles = $$('[data-theme-toggle]');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', ()=>{
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    });
  }

  function initLibraryInfo(){
    const data = getData();
    const lib = data.library;
    const info = $('[data-library-info]');
    if(info && !info.innerHTML){
      info.innerHTML = `
        <div class="meta"><b>Timings</b><span>${escapeHtml(lib.timings)}</span></div>
        <div class="meta"><b>Address</b><span>${escapeHtml(lib.address)}, ${escapeHtml(lib.city)}</span></div>
        <div class="meta"><b>Contact</b><span>${escapeHtml(lib.phone)} • ${escapeHtml(lib.email)}</span></div>
      `;
    }
  }

  function initBackToTop(){
    const backToTopBtn = $('[data-back-to-top]');
    if(!backToTopBtn) return;

    function toggleBackToTop(){
      if(window.scrollY > 300){
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Check initial state

    backToTopBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  function initPage(){
    initTheme();
    setActiveNav();
    initHeaderSessionUI();
    initBackToTop();

    const page = document.body.getAttribute('data-page');
    if(page==='home' || page==='home-2') initHome();
    if(page==='catalog') initCatalogPage();
    if(page==='patron-login') initPatronLogin();
    if(page==='patron-account') initPatronAccount();
    if(page==='membership') initMembership();
    if(page==='events') initEventsPage();
    if(page==='dashboard') initDashboard();
    
    // Initialize library info for pages that need it
    if(['about', 'home-2'].includes(page)){
      initLibraryInfo();
    }

    const year = $('[data-year]');
    if(year) year.textContent = String(new Date().getFullYear());

    const reset = $('[data-reset]');
    reset?.addEventListener('click', ()=>{
      localStorage.removeItem(STORAGE_KEY);
      toast('Reset', 'Demo data reset. Reloading...');
      setTimeout(()=>{ window.location.reload(); }, 350);
    });
  }

  document.addEventListener('DOMContentLoaded', initPage);
})();
