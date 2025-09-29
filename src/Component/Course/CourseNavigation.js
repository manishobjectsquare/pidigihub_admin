import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toastify from "../../config/toastify";

const CourseNavigation = ({ onStepChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract step from URL query parameters
  const getStepFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const step = searchParams.get("step");
    return step ? parseInt(step) : 1; // Default to step 1
  };
  let { id: courseId } = useParams();

  const [activeStep, setActiveStep] = useState(getStepFromUrl());
  const [modelNumber, setmodelNumber] = useState(1);

  // Update active step when URL changes
  useEffect(() => {
    if (isNaN(location.pathname.split("=").pop())) {
      setmodelNumber(1);
    } else {
      setmodelNumber(parseInt(location.pathname.split("=").pop()));
    }

    setActiveStep(getStepFromUrl());
  }, [location.search]);
  console.log(modelNumber);

  // Navigation steps
  let steps;
  if (courseId) {
    steps = [
      { id: 1, name: "Basic Infos", to: `/courses/add/${courseId}` },
      { id: 2, name: "More Infos", to: `/courses/add/${courseId}/step=2` },
      {
        id: 3,
        name: "Course Contents",
        to: `/courses/add/${courseId}/step=3`,
      },
      { id: 4, name: "Finish", to: `/courses/add/${courseId}/step=4` },
    ];
  } else {
    steps = [
      { id: 1, name: "Basic Infos", to: `/courses/add` },
      { id: 2, name: "More Infos", to: `/courses/add/${courseId}/step=2` },
      {
        id: 3,
        name: "Course Contents",
        to: `/courses/add/${courseId}/step=3`,
      },
      { id: 4, name: "Finish", to: `/courses/add/${courseId}/step=4` },
    ];
  }

  // Handle navigation click
  const handleNavClick = (step) => {
    if (location.pathname.includes("/create")) {
      if (onStepChange) {
        onStepChange(step);
        console.log(step);
      }
    } else {
      // Otherwise, just navigate to the step
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("step", step);
      // console.log(searchParams);
      navigate({ search: searchParams.toString() });
    }
    setActiveStep(step);
  };

  return (
    <div className="dashboard__review-table">
      <div className="dashboard__nav-wrap">
        <ul
          className="nav"
          id="myTab"
          role="tablist"
          aria-label={"Course creation steps"}
        >
          {!courseId
            ? steps.map((step, i) => (
                <li key={step.id} className="nav-item" role="presentation">
                  <Link
                    to={i <= modelNumber && i == 3 && step.to}
                    className={`nav-link navigation-btn ${
                      modelNumber === step.id ? "active" : ""
                    }`}
                    id={`item${step.id}-tab`}
                    data-step={step.id}
                    // onClick={() => handleNavClick(step.id)}
                    onClick={() =>
                      i != 3 &&
                      i >= modelNumber &&
                      toastify.errorColor("Please fill  form first")
                    }
                    aria-selected={modelNumber === step.id}
                    aria-controls={`item${step.id}-content`}
                    aria-label={
                      ("Navigate to step: {{stepName}}",
                      {
                        stepName: step.name,
                      })
                    }
                  >
                    {step.name}
                  </Link>
                </li>
              ))
            : steps.map((step, i) => (
                <li key={step.id} className="nav-item" role="presentation">
                  <Link
                    to={step.to}
                    className={`nav-link navigation-btn ${
                      modelNumber === step.id ? "active" : ""
                    }`}
                    id={`item${step.id}-tab`}
                    data-step={step.id}
                    // onClick={() =>
                    //   i != 3 &&
                    //   i >= modelNumber &&
                    //   toastify.errorColor("Please fill  form first")
                    // }
                    aria-selected={modelNumber === step.id}
                    aria-controls={`item${step.id}-content`}
                    aria-label={
                      ("Navigate to step: {{stepName}}",
                      {
                        stepName: step.name,
                      })
                    }
                  >
                    {step.name}
                  </Link>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseNavigation;
