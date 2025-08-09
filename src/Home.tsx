import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");

  const handlePreviewRedirect = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }
    navigate(`/preview/${encodeURIComponent(formName.trim())}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Form Builder</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/create")}>Create Form</button>
      </div>
        <div>
        <input
          type="text"
          placeholder="Enter form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handlePreviewRedirect}>Preview Form</button>
      </div>
      <p></p>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/myforms")}>My Forms</button>
      </div>

      
    </div>
  );
};

export default Home;
