import { useState, useMemo } from 'react';
import { useStudents } from '../../hooks/useAPI';

export default function Students() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students = [], loading, error } = useStudents();

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(s => 
      (s.firstname || '').toLowerCase().includes(term) ||
      (s.lastname || '').toLowerCase().includes(term) ||
      (s.id || '').toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const total = filteredStudents.length;
  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  // Sort students by lastname, then firstname
  const sorted = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const la = (a.lastname ?? '').toLowerCase();
      const lb = (b.lastname ?? '').toLowerCase();
      if (la < lb) return -1;
      if (la > lb) return 1;
      const fa = (a.firstname ?? '').toLowerCase();
      const fb = (b.firstname ?? '').toLowerCase();
      return fa < fb ? -1 : fa > fb ? 1 : 0;
    });
  }, [filteredStudents]);

  // Paginate students
  const visible = useMemo(() => {
    if (pageSize === 0) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  if (loading) return <main className="Main page-content"><p>📥 Loading students...</p></main>;
  if (error) return <main className="Main page-content"><p>❌ Error: {error}</p></main>;

  const goTo = (n) => setPage(Math.min(Math.max(1, n), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  return (
    <main className="Main page-content">
      <header style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',marginBottom:20}}>
        <div>
          <h1>🎓 Students</h1>
          <p>{total} students total</p>
        </div>
        
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              minWidth: 250
            }}
          />
          
          <select 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{padding:'8px 12px',border:'1px solid #ddd',borderRadius:4}}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={0}>Show all</option>
          </select>
        </div>
      </header>

      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #333'}}>
            <th style={{textAlign:'left',padding:12}}>ID</th>
            <th style={{textAlign:'left',padding:12}}>First Name</th>
            <th style={{textAlign:'left',padding:12}}>Last Name</th>
            <th style={{textAlign:'left',padding:12}}>Email</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((student) => (
            <tr key={student.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:12}}>{student.id}</td>
              <td style={{padding:12}}>{student.firstname}</td>
              <td style={{padding:12}}>{student.lastname}</td>
              <td style={{padding:12}}>{student.email || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <footer style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,marginTop:20}}>
          <button onClick={prev} disabled={page === 1} style={{padding:'8px 16px',cursor:page===1?'not-allowed':'pointer'}}>
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={next} disabled={page === totalPages} style={{padding:'8px 16px',cursor:page===totalPages?'not-allowed':'pointer'}}>
            Next →
          </button>
        </footer>
      )}
    </main>
  );
}