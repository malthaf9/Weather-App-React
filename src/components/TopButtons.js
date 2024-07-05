import React from "react";

const TopButtons = ({ setQuery }) => {
  const cities = [
    {
      id: 1,
      title: "Hyderabad",
    },
    {
      id: 2,
      title: "Bengaluru",
    },
    {
      id: 3,
      title: "Mumbai",
    },
    {
      id: 4,
      title: "Chennai",
    },
    {
      id: 5,
      title: "Cochin",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-around my-6">
      {cities.map((city) => (
        <button
          key={city.id}
          className="text-white text-lg font-medium m-2"
          onClick={() => setQuery({ q: city.title })}
        >
          {city.title}
        </button>
      ))}
    </div>
  );
}

export default TopButtons;
