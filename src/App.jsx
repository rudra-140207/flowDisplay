import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Home';
import Testinomials from './components/Testimonials';
import TestinomialList from './components/TestimonialList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testimonial" element={<Testinomials />} />
        <Route path="/list" element={<TestinomialList />} />
      </Routes>
    </Router>
  );
};

export default App;
