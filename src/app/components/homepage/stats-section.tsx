"use client"
import { useEffect, useState } from "react";

export function StatsSection() {
  const defaultBackground = "/default-title-bg.jpg";
  
  // Stats target values
  const stats = [
    { label: "Delighted Customers", value: 100, unit: "+" },
    { label: "Ongoing Projects", value: 28, unit: "+" },
    { label: "Years of Experience", value: 20, unit: "+" },
    { label: "Satisfied Customers", value: 100, unit: "%" },
  ];

  // State to store animated values
  const [animatedStats, setAnimatedStats] = useState(
    stats.map(() => ({ current: 0, target: 0 }))
  );

  // Function to animate stats
  const animateStats = (targetValue: number, index: number) => {
    let currentValue = 0;
    const increment = targetValue / 100;

    const interval = setInterval(() => {
      if (currentValue >= targetValue) {
        clearInterval(interval);
      } else {
        currentValue += increment;
        setAnimatedStats((prevStats) =>
          prevStats.map((stat, i) =>
            i === index
              ? { ...stat, current: Math.floor(currentValue) }
              : stat
          )
        );
      }
    }, 30);
  };

  useEffect(() => {
    stats.forEach((stat, index) => animateStats(stat.value, index));
  }, []);

  return (
    <section
      className="relative w-full md:h-55 flex items-center justify-center text-center text-black font-bold text-xl md:text-3xl"
      style={{
        backgroundImage: `url(${defaultBackground})`,
        backgroundSize: "cover",
      }}
    >
      {/* Yellow Overlay */}
      <div className="absolute inset-0 bg-yellow-500 opacity-80"></div>
      <div className="container mx-auto px-4 max-w-7xl md:px-0 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-black">
          {animatedStats.map((stat, index) => (
            <div className="p-4" key={index}>
              <h3 className="text-3xl md:text-5xl font-bold mb-2">
                {stat.current}
                {stats[index].unit}
              </h3>
              <p className="text-sm md:text-xl font-normal">{stats[index].label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
