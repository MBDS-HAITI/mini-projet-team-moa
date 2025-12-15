import { useState, useMemo } from 'react';
import { useCourses } from '../../hooks/useAPI';

export default function Courses() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { data: courses = [], loading, error } = useCourses();

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courses;
    const term = searchTerm.toLowerCase();
    return courses.filter(c => 
      (c.name || '').toLowerCase().includes(term) ||
      (c.code || '').toLowerCase().includes(term) ||
      (c.id || '').toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    if (!sortConfig.key) return filteredCourses;
    
    return [...filteredCourses].sort((a, b) => {
      const aValue = (a[sortConfig.key] || '').toString().toLowerCase();
      const bValue = (b[sortConfig.key] || '').toString().toLowerCase();
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCourses, sortConfig]);

  const total = sortedCourses.length;
  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  // Paginate courses
  const visible = useMemo(() => {
    if (pageSize === 0) return sortedCourses;
    const start = (page - 1) * pageSize;
    return sortedCourses.slice(start, start + pageSize);
  }, [sortedCourses, page, pageSize]);

  if (loading) return <main className="Main page-content"><p>📥 Loading courses...</p></main>;
  if (error) return <main className="Main page-content"><p>❌ Error: {error}</p></main>;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const goTo = (n) => setPage(Math.min(Math.max(1, n), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  return (
    <main className="Main page-content">
      <header style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',marginBottom:20}}>
        <div>
          <h1>📚 Courses</h1>
          <p>{total} courses total</p>
        </div>
        
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input
            type="text"
            placeholder="Search by name or code..."
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
            <th 
              style={{textAlign:'left',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('code')}
            >
              Code {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{textAlign:'left',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('name')}
            >
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((course) => (
            <tr key={course.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:12,fontWeight:'bold'}}>{course.code}</td>
              <td style={{padding:12}}>{course.name}</td>
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