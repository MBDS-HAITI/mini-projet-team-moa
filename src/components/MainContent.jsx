import { useEffect, useState } from "react";
import data from '../data/data.json'

import StudentCard from "./StudentCard";


export default function MainContent() {

  const [selectedItem, setSelectedItem] = useState(null);

  function choiceItemListe() {
    if (!Array.isArray(data) || data.length === 0) return;
    const index = Math.floor(Math.random() * data.length);
    setSelectedItem(data[index]);
  }

  useEffect(() => {
    choiceItemListe();
  }, []);
    
  return (
    <main className="Main">
      <div className="Container">

        <div className="content-section">
          <div className="section-header">
            <h1>Tirage aléatoire dans la liste</h1>
            <p className="section-subtitle">
              {data.length} records available
            </p>
          </div>
          
          <button className="btn-random btn-lg" onClick={choiceItemListe}>
            🎲 Choose a random record
          </button>
          
          {selectedItem ? (
            <div className="result-container">
              <h3 className="result-title">✓ Selected record</h3>
              <StudentCard item={selectedItem} />
            </div>
          ) : (
            <div className="empty-state">
              <p>📋 No record selected yet.</p>
            </div>
          )}
        </div>

        <hr className="sep" />
      </div>
    </main>
  );
}
