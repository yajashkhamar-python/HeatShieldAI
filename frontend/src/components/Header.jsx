import "./Header.css";

export default function Header({ city, date }) {

  return (

    <header className="header">

      <div>

        <h1>🔥 HeatShield AI</h1>

        <p>

          Urban Heat Island Monitoring & AI Recommendation System

        </p>

      </div>

      <div className="city">

        <h3>{city}</h3>

        <small>{date}</small>

      </div>

    </header>

  );

}