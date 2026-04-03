"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./home.module.css";
export default function Inputfield() {
  const [name, setName] = useState("");
  const [results, setResults] = useState<{
    city: string;
    temp: number;
    icon: string;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchWeather() {
    if (!name.trim()) return;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
    
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
            const data = await response.json();
            //console.log(data);
            setResults({
              city: data.name,
              temp: Math.round(data.main.temp),
              icon: data.weather[0].icon,
            });
            //setName("");
            setError("");
    } catch {
            setError("No city found. Please check the spelling.");
            setResults(null);
            setName("");
    } finally {
          setIsLoading(false); //ここにローディング
    }
  }

  function getClothingAdvice(temp: number) {
    let code = "";
    if (temp < 15) {
      code = "You need something warm outer like acoat ";
    } else if (15 <= temp && temp < 25) {
      code = "We recommend long-sleeve shirts or light outerwear.";
    } else {
      code = "Short sleeves are fine! Watch out for heatstroke! ";
    }
    return code;
  }
function getBgColor(temp: number) {
  if (temp < 15) {
    return "#2196f3"; // 少しリッチな青
  } else if (15 <= temp && temp < 25) {
    return "#4caf50"; // 少しリッチな緑
  } else {
    return "#ff9800"; // 少しリッチなオレンジ
  }
}
  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <h1 className={styles.title}>Weather & Outfit</h1>

        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Enter city name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()} // エンターキー処理
          />
          <button
            className={styles.searchButton}
            onClick={fetchWeather}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Search"}
          </button>
        </div>

        {results !== null && (
          <div
            className={styles.card}
            style={{ backgroundColor: getBgColor(results.temp) }}
          >
            <h2 className={styles.cityText}>{results.city}</h2>
            <Image
              src={`https://openweathermap.org/img/wn/${results.icon}@2x.png`}
              alt="天気アイコン"
              width={100}
              height={100}
            />
            <p className={styles.tempText}>{results.temp}℃</p>
            <p className={styles.adviceText}>
              {getClothingAdvice(results.temp)}
            </p>
          </div>
        )}

        {error && <div className={styles.errorText}>{error}</div>}
      </div>
    </div>
  );
}
