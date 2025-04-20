import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";

const Testimonials = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    rollNo: "",
    mentor: "",
    message: "",
    remark: "",
    photo: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const branches = [
    "CSE", "CS", "IT", "CSIT", "CS-AI", "CS-AIML", "EEE", "ECE", "ME"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setImagePreview(URL.createObjectURL(file));

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await axios.post(
        import.meta.env.VITE_IMGBB_API,
        uploadData
      );
      
      if (res.data && res.data.data && res.data.data.url) {
        setFormData((prev) => ({ ...prev, photo: res.data.data.url }));
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error("Image upload failed. Try again.");
      }
    } catch (err) {
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      toast.error("Please upload a photo before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/testinomial`, formData);
      toast.success("Testimonial submitted!");
      setFormData({
        name: "",
        branch: "",
        rollNo: "",
        mentor: "",
        message: "",
        remark: "",
        photo: "",
      });
      setImagePreview(null);
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 py-12 px-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-4xl space-y-8 border border-purple-300"
      >
        <ToastContainer />

        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 tracking-wide">
          Share Your Testimonial 💬
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input-style"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="branch"
            className="input-style"
            value={formData.branch}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="rollNo"
            placeholder="University Roll No"
            className="input-style"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mentor"
            placeholder="Mentor Name"
            className="input-style"
            value={formData.mentor}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-indigo-600">
            Upload Your Photo
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-xl px-4 py-3 bg-white"
            onChange={handleImageUpload}
            required
          />
          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-blue-600">
              <ImSpinner2 className="animate-spin" /> Uploading...
            </div>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-32 h-32 rounded-full object-cover shadow-md border-2 border-indigo-300"
            />
          )}
        </div>

        <div className="space-y-4">
          <textarea
            name="message"
            rows="7"
            placeholder="Your Message"
            className="input-style resize-none w-full"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="remark"
            placeholder="Any Remark (optional)"
            className="input-style"
            value={formData.remark}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={uploading || submitting}
          className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl w-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <ImSpinner2 className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Testimonial ✨"
          )}
        </button>
      </form>
    </div>
  );
};

export default Testimonials;
