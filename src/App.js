import React, { useState, useEffect } from "react";
import "./App.css"; // Import the custom CSS
import { FaAnglesRight } from "react-icons/fa6";
import { RiBox1Line } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa";
import { FaSuitcase } from "react-icons/fa";
import { TbRecycle } from "react-icons/tb";

const LandingPage = () => {
  const [heading, setHeading] = useState("");
  const [editable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState(heading);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/heading");
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch the heading please try again");
        }
        setHeading(data.text);
        setInputValue(data.text);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHeading();
  }, [isChanged]);

  const validate = () => {
    const newErrors = {};
    if (inputValue === "" || !inputValue?.trim()) {
      newErrors.input = "Enter Something to update.";
    } else if (inputValue.length > 100) {
      newErrors.input = "Heading should be between 1-100.";
    }
    setErrors({ ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      setIsLoading(true);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: 1, text: inputValue }),
      };

      const response = await fetch(
        "http://localhost:8080/api/heading",
        options
      );
      // const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update heading please try again");
      }
      setEditable(false);
      setIsChanged(!isChanged);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowPopup(false);
    }
  };

  const formatHeading = (text) => {
    const words = text.split(" ");
    const totalWords = words.length;

    if (totalWords < 5) return <p className="h1">{text}</p>;

    const firstPart = words.slice(0, 3).join(" ");
    const highlightPart = words.slice(3, 6).join(" ");
    const normalPart = words.slice(6, totalWords - 2).join(" ");
    const boldPart = words.slice(totalWords - 2).join(" ");

    return (
      <p className="h1">
        {firstPart} <span className="highlight">{highlightPart}</span>{" "}
        {normalPart} <span className="bold">{boldPart}</span>
      </p>
    );
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="nav-content">
          <ul className="nav-links">
            <li>About</li>
            <li
              className=""
              onClick={() => {
                setShowPopup(true);
                console.log("Popup Button Clicked, showPopup:", showPopup);
              }}
            >
              Change Heading
            </li>
            <li>Services ▼</li>
          </ul>
        </div>
      </nav>

      <section className="top-section">
        <div className="content">
          {formatHeading(heading)}
          <p className="description">
            Powerful AI solutions that go beyond mere data sorting and
            exploration. Use our array of AI-enabled solutions that understand
            your business and recommend the optimal way forward.
          </p>
          <button className="cta-button">Get started</button>
        </div>
        <div className="background-image"></div>
      </section>

      <section className="bottom-section">
        <div className="key-features">
          <h2>Our Key Features</h2>
          <div className="features-grid">
            <div className="detls-cont">
              <div className="icon-div-cont">
                <FaAnglesRight />
              </div>
              <h3>Ready to Go Algos</h3>
              <p>
                We have ready accelerators embedded with learnings from hundreds
                of past projects, generating actionable results.
              </p>
            </div>
            <div className="detls-cont">
              <div className="icon-div-cont">
                <RiBox1Line />
              </div>
              <h3>Internal Capability Building</h3>
              <p>
                We productize all our work, enhance them with the latest AI
                technology, and train your internal teams to leverage them.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <div className="timeline-point"></div>
          <div className="timeline-point"></div>
          <div className="timeline-point"></div>
          <div className="timeline-point"></div>
          <div className="timeline-point"></div>
        </div>

        {/* Additional Features */}
        <div className="additional-features">
          <div className="detls-cont">
            <div className="icon-div-cont">
              <FaDatabase />
            </div>
            <h3>Multi-source data</h3>
            <p>
              Our solutions work with old, new, or incomplete datasets, in
              different formats, and from varied sources.
            </p>
          </div>
          <div className="detls-cont">
            <div className="icon-div-cont">
              <FaSuitcase />
            </div>
            <h3>Stakeholder Alignment</h3>
            <p>
              No black boxes. Stakeholders understand the "how," "so what," and
              "now what," leading to clear decision-making trade-offs.
            </p>
          </div>
          <div className="detls-cont">
            <div className="icon-div-cont">
              <TbRecycle />
            </div>
            <h3>Continuous Engagement</h3>
            <p>
              We engage in the long-term to enhance, course-correct, and adopt
              new models to continuously refine your work.
            </p>
          </div>
        </div>
      </section>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit Heading</h2>
            <label>Heading:</label>
            <textarea
              value={inputValue}
              disabled={!editable}
              onChange={(e) => {
                setInputValue(e.target.value);
                setErrors((prev) => ({ ...prev, input: "" }));
              }}
            />
            {errors.input && <p className="error-para">{errors.input}</p>}
            <div className="popup-buttons">
              <button onClick={() => setEditable((prev) => !prev)}>
                {editable ? "Cancel" : "Edit"}
              </button>
              <button
                disabled={inputValue === heading || isLoading}
                onClick={handleSave}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="popup-close"
                onClick={() => setShowPopup(false)}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
