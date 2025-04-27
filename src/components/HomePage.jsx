import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const baseUrl = "http://localhost:5000";
  const baseUrl = "https://kiet-display-backend.onrender.com";

  const fetchData = async () => {
    try {
      const [imagesRes, activitiesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/images`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/activities`, { withCredentials: true }),
      ]);
      setImages(imagesRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCurrentActivitiesByYear = (year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activities.filter((activity) => {
      const startDate = new Date(activity.startDate);
      const endDate = new Date(activity.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return startDate <= today && endDate >= today && activity.year === year;
    });
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const years = [
    { year: 1, label: "1st" },
    { year: 2, label: "2nd" },
    { year: 3, label: "3rd" },
    { year: 4, label: "4th" },
  ];

  const yearWiseSlides = years.map(({ year, label }) => ({
    type: "activities",
    year: label,
    activities: getCurrentActivitiesByYear(year),
    duration: 6000,
  }));

  const slides = [
    ...images.map((image) => ({
      type: "image",
      src: image.imageUrl,
      duration: 3000, // 3s per image
    })),
    ...yearWiseSlides, // Include year-wise activity slides
  ];

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % slides.length;

          // Refresh data when the last slide is reached
          if (nextIndex === 0) {
            fetchData();
          }

          return nextIndex;
        });
      }, slides[currentIndex]?.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides.length]);

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center">
      {slides[currentIndex]?.type === "image" ? (
        <div className="h-screen w-screen flex justify-center items-center bg-amber-100 overflow-hidden">
          <img
            src={slides[currentIndex]?.src}
            alt="Slide"
            className="max-w-full max-h-full object-contain m-10"
          />
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col items-center relative">
          <h1 className="text-9xl md:text-5xl font-extrabold text-blue-800 absolute top-8">
            {slides[currentIndex]?.year} Year Activities
          </h1>
          <div className="flex-grow flex justify-center items-center w-full">
            <div
              className={`grid gap-8 p-6 w-full max-w-[80%] ${
                slides[currentIndex]?.activities.length === 1
                  ? "grid-cols-1"
                  : slides[currentIndex]?.activities.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {slides[currentIndex]?.activities.length === 0 ? (
                <div className="text-6xl md:text-3xl  text-gray-700 font-bold text-center col-span-full">
                  No Activity for now
                </div>
              ) : (
                slides[currentIndex]?.activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="bg-gradient-to-r from-green-500 to-blue-500 p-16 rounded-3xl shadow-2xl text-white flex flex-col items-center"
                  >
                    <h2 className="text-8xl md:text-2xl font-semibold text-center">
                      {activity.name}
                    </h2>
                    <p className="text-6xl md:text-2xl my-4 font-semibold text-center">
                      {formatDisplayDate(activity.startDate)} -{" "}
                      {formatDisplayDate(activity.endDate)}
                    </p>
                    <p className="text-6xl md:text-2xl font-semibold text-center">
                      {activity.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
