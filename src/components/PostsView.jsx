// components/PostsView.jsx — Vista de posts desde API con temática JRPG (Leyendas del Mundo)

import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const PostsView = ({ showToast }) => {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const PER_PAGE = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 10000);
      const res  = await fetch(API_URL, { signal: ctrl.signal });
      clearTimeout(tid);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inesperada.');
      setPosts(data);
      showToast(`${data.length} leyendas cargadas.`, 'success');
    } catch (err) {
      const msg = err.name === 'AbortError'
        ? 'La solicitud tardó demasiado. Intenta de nuevo.'
        : err.message || 'Error de conexión.';
      setError(msg);
      showToast('No se pudieron cargar las leyendas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.body.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="section-title mb-1">API Externa</p>
          <h5 style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>
            <i className="bi bi-journal-richtext me-2" style={{ color: '#F5C518' }} />
            Leyendas del Mundo
          </h5>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Datos obtenidos desde{' '}
            <code style={{ color: '#4fc3f7', fontSize: '0.78rem' }}>jsonplaceholder.typicode.com/posts</code>
          </p>
        </div>
        <button className="btn btn-ghost px-3 d-flex align-items-center gap-2" onClick={fetchPosts} disabled={loading}>
          <i className={`bi bi-arrow-clockwise`} />Recargar
        </button>
      </div>

      {/* Búsqueda */}
      <div className="search-wrapper mb-4">
        <i className="bi bi-search search-icon" />
        <input
          type="search"
          className="form-control form-control-dark search-input"
          placeholder="Buscar leyendas..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          maxLength={100}
        />
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border spinner-gold mb-3" role="status"><span className="visually-hidden">Cargando...</span></div>
          <p style={{ color: 'var(--text-muted)' }}>Conectando con el oráculo...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-custom alert-gold d-flex align-items-center gap-3 mb-4">
          <i className="bi bi-exclamation-triangle-fill fs-5" />
          <div>
            <strong>Error de conexión</strong><br />
            <small>{error}</small>
          </div>
          <button className="btn btn-gold ms-auto btn-sm" onClick={fetchPosts}>Reintentar</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-3">
            <small style={{ color: 'var(--text-muted)' }}>
              Mostrando {paginated.length} de {filtered.length} leyendas
              {search && <> — "<strong style={{ color: 'var(--text-secondary)' }}>{search}</strong>"</>}
            </small>
          </div>

          <div className="row g-3 mb-4">
            {paginated.length === 0 ? (
              <div className="col-12">
                <div className="empty-state">
                  <div className="empty-icon">📜</div>
                  <h6 style={{ color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif' }}>Sin resultados</h6>
                  <p style={{ fontSize: '0.83rem' }}>Intenta con otros términos.</p>
                </div>
              </div>
            ) : paginated.map(post => (
              <div key={post.id} className="col-12 col-md-6 col-lg-4">
                <div className="task-card h-100" style={{ borderLeftColor: '#4fc3f7', cursor: 'default' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{
                      background: 'rgba(79,195,247,0.12)', color: '#4fc3f7',
                      fontWeight: 700, fontSize: '0.68rem',
                      padding: '2px 8px', borderRadius: 20,
                      fontFamily: 'Cinzel, serif',
                    }}>
                      #{post.id}
                    </span>
                    <span className="badge-status badge-api">Leyenda</span>
                  </div>
                  <h6 style={{
                    fontWeight: 700, fontSize: '0.88rem',
                    color: 'var(--text-primary)', lineHeight: 1.4,
                    marginBottom: '0.45rem', textTransform: 'capitalize',
                  }}>
                    {post.title}
                  </h6>
                  <p style={{
                    fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.body}
                  </p>
                  <div className="mt-2" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <i className="bi bi-person-circle me-1" />Héroe {post.userId}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_,i) => i+1)
                .filter(p => p===1 || p===totalPages || Math.abs(p-page)<=1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i-1] > 1) acc.push('...');
                  acc.push(p); return acc;
                }, [])
                .map((p, i) => p === '...'
                  ? <span key={`e${i}`} style={{ color:'var(--text-muted)', padding:'4px 8px' }}>…</span>
                  : <button key={p} className={`btn btn-sm ${page===p?'btn-gold':'btn-ghost'}`} onClick={()=>setPage(p)} style={{ minWidth:34 }}>{p}</button>
                )}
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsView;
