import { useState, useMemo } from 'react';
import { useGrades } from '../../hooks/useAPI';

export default function Grades() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { data: grades = [], loading, error } = useGrades();

  // Filter grades based on search
  const filteredGrades = useMemo(() => {
    if (!searchTerm) return grades;
    const term = searchTerm.toLowerCase();
    return grades.filter(g => 
      (g.course || '').toLowerCase().includes(term) ||
      (g.student?.firstname || '').toLowerCase().includes(term) ||
      (g.student?.lastname || '').toLowerCase().includes(term) ||
      (g.id || '').toLowerCase().includes(term) ||
      (g.grade?.toString() || '').includes(term)
    );
  }, [grades, searchTerm]);

  // Sort grades
  const sortedGrades = useMemo(() => {
    if (!sortConfig.key) return filteredGrades;
    
    return [...filteredGrades].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'student') {
        aValue = `${a.student?.lastname || ''} ${a.student?.firstname || ''}`.toLowerCase();
        bValue = `${b.student?.lastname || ''} ${b.student?.firstname || ''}`.toLowerCase();
      } else if (sortConfig.key === 'grade') {
        aValue = a.grade || 0;
        bValue = b.grade || 0;
      } else {
        aValue = (a[sortConfig.key] || '').toString().toLowerCase();
        bValue = (b[sortConfig.key] || '').toString().toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredGrades, sortConfig]);

  const total = sortedGrades.length;
  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  // Paginate grades
  const visible = useMemo(() => {
    if (pageSize === 0) return sortedGrades;
    const start = (page - 1) * pageSize;
    return sortedGrades.slice(start, start + pageSize);
  }, [sortedGrades, page, pageSize]);

  if (loading) return <main className="Main page-content"><p>📥 Loading grades...</p></main>;
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
          <h1>📊 Grades</h1>
          <p>{total} grades total</p>
        </div>
        
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input
            type="text"
            placeholder="Search by student, course, or grade..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              minWidth: 300
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
              onClick={() => handleSort('id')}
            >
              ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{textAlign:'left',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('student')}
            >
              Student {sortConfig.key === 'student' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{textAlign:'left',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('course')}
            >
              Course {sortConfig.key === 'course' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{textAlign:'right',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('grade')}
            >
              Grade {sortConfig.key === 'grade' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              style={{textAlign:'left',padding:12,cursor:'pointer',userSelect:'none'}}
              onClick={() => handleSort('date')}
            >
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((grade) => (
            <tr key={grade.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:12}}>{grade.id}</td>
              <td style={{padding:12}}>
                {grade.student?.firstname} {grade.student?.lastname}
              </td>
              <td style={{padding:12}}>{grade.course}</td>
              <td style={{padding:12,textAlign:'right',fontWeight:'bold'}}>
                {grade.grade}
              </td>
              <td style={{padding:12}}>{grade.date}</td>
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