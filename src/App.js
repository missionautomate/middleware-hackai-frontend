import React, { Component, useState, useMemo, useRef } from "react";
import ImageSlideShow from "./components/ImageSlideShow";
import PainterSelect from "./components/PainterSelect";
import { BrowserRouter, Route, Switch, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PainterSelect />} />
        <Route path="/generated" element={<ImageSlideShow />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
