export default function StudentCard({ item }) {
  if (!item) {
    return null; // if nothing to display
  }

  // Function to get color by course
  const getCourseColor = (course) => {
    const colors = {
      "Math 101": "#3b82f6",
      "Physics 505": "#8b5cf6",
      "Chemistry 606": "#ec4899",
      "English 102": "#06b6d4",
      "History 301": "#f59e0b",
      "Biology 404": "#10b981",
      "Art 201": "#f43f5e",
      "Music 303": "#a78bfa"
    };
    return colors[course] || "#2563eb";
  };

  return (
    <div className="student-card" style={{ borderLeftColor: getCourseColor(item.course) }}>
      <p><strong>📚 Course:</strong> {item.course}</p>
      <p><strong>👤 Student:</strong> {item.student.firstname} {item.student.lastname}</p>
      <p><strong>🆔 Student ID:</strong> {item.student.id}</p>
      <p><strong>#️⃣ Unique ID:</strong> {item.unique_id}</p>
      <p><strong>📅 Date:</strong> {item.date}</p>
      <p><strong>📊 Grade:</strong> <span style={{ 
        backgroundColor: item.grade >= 70 ? '#d1fae5' : item.grade >= 60 ? '#fef3c7' : '#fee2e2',
        color: item.grade >= 70 ? '#065f46' : item.grade >= 60 ? '#92400e' : '#7f1d1d',
        padding: '4px 12px',
        borderRadius: '6px',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>{item.grade}/100</span></p>
    </div>
  );
}
