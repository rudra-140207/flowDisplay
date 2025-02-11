import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const baseUrl = "http://localhost:5000";
  const baseUrl = "https://kiet-display-backend.onrender.com";

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/images`, {
        withCredentials: true,
      });
      setImages(res.data); // Store the fetched images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/activities`, {
        withCredentials: true,
      });
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images from backend
    fetchActivities(); // Fetch activities from backend
  }, []);

  useEffect(() => {
    // Only start the timer when images are loaded
    if (images.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % slides.length;
          return nextIndex;
        });
      }, slides[currentIndex].duration);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, images.length]);

  const slides = [
    ...images.map((image) => ({
      type: "image",
      src: image.imageUrl, // Assuming image has a `imageUrl` field
      duration: 2000, // Duration for images
    })),
    { type: "activities", duration: 8000 }, // Duration for activity slide
  ];

  const getCurrentActivities = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activities.filter((activity) => {
      const startDate = new Date(activity.startDate);
      const endDate = new Date(activity.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return startDate <= today && endDate >= today;
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

  const currentActivities = getCurrentActivities();

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center">
      {slides[currentIndex]?.type === "image" ? (
        <div
          className="h-screen flex justify-center items-center bg-cover bg-center transition-opacity duration-500 w-full"
          style={{ backgroundImage: `url(${slides[currentIndex]?.src})` }}
        ></div>
      ) : (
        <div className="h-screen w-full flex flex-col items-center relative">
          <h1 className="text-5xl font-extrabold text-blue-800 absolute top-8">
            Current Activities
          </h1>
          <div className="flex-grow flex justify-center items-center w-full">
            <div
              className={`grid gap-8 p-6 w-full max-w-[80%] ${
                currentActivities.length === 1
                  ? "grid-cols-1"
                  : currentActivities.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {currentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="bg-gradient-to-r from-green-500 to-blue-500 p-16 rounded-3xl shadow-2xl text-white flex flex-col items-center"
                >
                  <h2 className="text-4xl font-semibold text-center">
                    {activity.name}
                  </h2>
                  <p className="text-2xl my-4 text-center">
                    {formatDisplayDate(activity.startDate)} -{" "}
                    {formatDisplayDate(activity.endDate)}
                  </p>
                  <p className="text-xl text-center">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
