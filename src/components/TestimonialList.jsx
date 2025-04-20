import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [password, setPassword] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/testinomial`);
        setTestimonials(response.data);
      } catch (error) {
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    if (passwordEntered) {
      fetchTestimonials();
    }
  }, [passwordEntered]);

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTestimonial(null);
    setIsModalOpen(false);
  };

  const handlePasswordSubmit = () => {
    if (password === "Rudra07" || password === "kieteee") {
      setPasswordEntered(true);
    } else {
      toast.error("Incorrect Password");
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 py-12 px-4">
      <ToastContainer />

      {/* Password Modal */}
      {!passwordEntered && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg p-8 w-80">
            <h2 className="text-2xl font-semibold text-indigo-700 text-center mb-6">
              Enter Password
            </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyPress} // Detect Enter key press
              placeholder="Enter Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Content (Testimonials) */}
      {passwordEntered && (
        <>
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">
            Testimonials from Our Happy Clients
          </h1>

          {/* Testimonials Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="flex justify-center items-center w-full">
                <ImSpinner2 className="animate-spin text-indigo-700" />
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openModal(testimonial)}
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={testimonial.photo}
                      alt="testimonial"
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-700">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.branch}</p>
                  <p className="mt-4 text-gray-700">
                    {testimonial.message.substring(0, 100)}...
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Modal (Popup) */}
          {isModalOpen && selectedTestimonial && (
            <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 bg-opacity-50 flex justify-center items-center z-30 overflow-y-auto py-8 px-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg relative z-40 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-3xl font-bold text-indigo-600 hover:text-indigo-800 z-50"
                >
                  &times;
                </button>

                {/* Testimonial Content */}
                <div className="flex justify-center mb-6 mt-4">
                  <img
                    src={selectedTestimonial.photo}
                    alt="testimonial"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400"
                  />
                </div>

                <h3 className="text-2xl font-semibold text-indigo-700 text-center">
                  {selectedTestimonial.name}
                </h3>
                <p className="text-md text-gray-500 text-center">
                  {selectedTestimonial.branch}
                </p>

                <div className="mt-6 text-gray-700 text-justify px-1">
                  <p className="text-base">{selectedTestimonial.message}</p>

                  {selectedTestimonial.remark && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">
                        <strong>Remark:</strong> {selectedTestimonial.remark}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">
                      <strong>Roll No:</strong> {selectedTestimonial.rollNo}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Mentor:</strong> {selectedTestimonial.mentor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestimonialsList;
