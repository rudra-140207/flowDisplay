import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const wakeUpCall = async () => {
    const res = await axios.get(`${backendUrl}`);
    console.log(res.data);
  };

  wakeUpCall();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 text-gray-800 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Cherished Memories & Words of Gratitude
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
        Celebrate the journey and legacy of our passout batch by sharing
        heartfelt testimonials and experiences.
      </p>

      {/* Flex container for buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleClick("/testimonial")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300"
        >
          Send Testimonial
        </button>

        <button
          onClick={() => handleClick("/list")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300"
        >
          See All Testimonial
        </button>
      </div>
    </div>
  );
};

export default Home;
