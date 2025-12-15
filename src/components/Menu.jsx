import { useState, useEffect } from "react";
import data from "../data/data.json";

export default function Menu({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedFilter, setExpandedFilter] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  // Icons and colors for courses
  const courseIcons = {
    "Math 101": "📐",
    "Physics 505": "⚛️",
    "Chemistry 606": "🧪",
    "English 102": "📚",
    "History 301": "📜",
    "Biology 404": "🔬",
    "Art 201": "🎨",
    "Music 303": "🎵"
  };

  const courseColors = {
    "Math 101": "#3b82f6",
    "Physics 505": "#8b5cf6",
    "Chemistry 606": "#ec4899",
    "English 102": "#06b6d4",
    "History 301": "#f59e0b",
    "Biology 404": "#10b981",
    "Art 201": "#f43f5e",
    "Music 303": "#a78bfa"
  };

  useEffect(() => {
    const uniqueCourses = [...new Set(data.map(item => item.course))].sort();
    setCourses(uniqueCourses);
  }, []);

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    onSelectCourse(course);
  };

  const getCourseCount = (course) => {
    if (course === "all") return data.length;
    return data.filter(item => item.course === course).length;
  };

  // Calculer les statistiques
  const getStatistics = () => {
    const filteredData = selectedCourse === "all" 
      ? data 
      : data.filter(item => item.course === selectedCourse);
    
    const grades = filteredData.map(item => item.grade);
    const avgGrade = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
    const maxGrade = Math.max(...grades);
    const minGrade = Math.min(...grades);
    
    return { avgGrade, maxGrade, minGrade };
  };

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "name") return a.localeCompare(b);
    if (sortBy === "count") return getCourseCount(b) - getCourseCount(a);
    return 0;
  });

  const stats = getStatistics();

  return (
    <nav className="menu-container">
      {/* Header avec titre et sous-titre */}
      <div className="menu-header">
        <div className="menu-title-wrapper">
          <h2 className="menu-title">🎓 Course Manager</h2>
          <p className="menu-subtitle">Explore and filter academic records</p>
        </div>
      </div>

      {/* Barre de contrôle avec recherche et tri */}
      <div className="menu-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search a course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm("")}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-wrapper">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Trier par"
          >
            <option value="name">↕️ Nom (A-Z)</option>
            <option value="count">📊 Nombre</option>
          </select>
        </div>

        <button 
          className={`filter-toggle ${expandedFilter ? "expanded" : ""}`}
          onClick={() => setExpandedFilter(!expandedFilter)}
          aria-label="Basculer le filtre"
        >
          ⚙️ Filtres {expandedFilter ? "▼" : "▶"}
        </button>
      </div>

      {/* Course Buttons Section */}
      <div className="menu-items">
        <button
          className={`menu-btn menu-btn-all ${selectedCourse === "all" ? "active" : ""} ${hoveredCourse === "all" ? "hovered" : ""}`}
          onClick={() => handleCourseChange("all")}
          onMouseEnter={() => setHoveredCourse("all")}
          onMouseLeave={() => setHoveredCourse(null)}
          title="Show all records"
        >
          <span className="btn-icon">📋</span>
          <div className="btn-content">
            <span className="btn-text">All Courses</span>
            <span className="btn-desc">Complete View</span>
          </div>
          <span className="btn-count">{getCourseCount("all")}</span>
        </button>

        {sortedCourses.map((course) => (
          <button
            key={course}
            className={`menu-btn ${selectedCourse === course ? "active" : ""} ${hoveredCourse === course ? "hovered" : ""}`}
            onClick={() => handleCourseChange(course)}
            onMouseEnter={() => setHoveredCourse(course)}
            onMouseLeave={() => setHoveredCourse(null)}
            title={`${course} - ${getCourseCount(course)} record(s)`}
            style={{
              "--course-color": courseColors[course] || "#2563eb",
              "--border-color": courseColors[course] || "#2563eb"
            }}
          >
            <span className="btn-icon">{courseIcons[course] || "📚"}</span>
            <div className="btn-content">
              <span className="btn-text">{course}</span>
              <span className="btn-desc">{getCourseCount(course)} enreg.</span>
            </div>
            <span className="btn-count">{getCourseCount(course)}</span>
          </button>
        ))}

        {searchTerm && sortedCourses.length === 0 && (
          <div className="menu-empty">
            <p>🔎 No course matches your search</p>
            <button 
              className="reset-search-btn"
              onClick={() => setSearchTerm("")}
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Statistiques dynamiques */}
      <div className="menu-stats">
        <div className="stat-item">
          <span className="stat-icon">📚</span>
          <div className="stat-content">
            <span className="stat-label">Averages:</span>
            <span className="stat-value">{stats.avgGrade}/100</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <div className="stat-content">
            <span className="stat-label">Meilleur score:</span>
            <span className="stat-value">{stats.maxGrade}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⚠️</span>
          <div className="stat-content">
            <span className="stat-label">Score bas:</span>
            <span className="stat-value">{stats.minGrade}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedCourse !== "all" && (
        <div className="selection-indicator">
          <span className="indicator-icon">{courseIcons[selectedCourse] || "📚"}</span>
          <span className="indicator-text">Selected Course: <strong>{selectedCourse}</strong></span>
          <button 
            className="indicator-close"
            onClick={() => handleCourseChange("all")}
            aria-label="Désélectionner"
          >
            ✕
          </button>
        </div>
      )}
    </nav>
  );
}
