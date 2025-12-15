 import { useEffect, useState } from "react";

 export default function Footer(){

    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 100);
      return () => clearInterval(t);
    }, []
  );

  const day = now.getDate();
  const dayLabel = day === 1 ? "1er" : String(day);
  const month = now.toLocaleString("fr-FR", {month: "long" });
  const year = now.getFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

    return (
      <footer className="site-footer">
        <p>
           Bonjour, on est le {dayLabel}, {month} {year} et il est {hour}:{minute}:{second}
        </p>
        © 2025 - Orelus Josselet, All rights reserved.
      </footer>
      
    );
  }
  