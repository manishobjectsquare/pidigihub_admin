import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ activeItem }) {
  let loginUser = JSON.parse(localStorage.getItem("user"));
  let [loginUserType, setLoginUserType] = useState(loginUser?.user_type);

  let addBodyClass = () => {
    let w = window.innerWidth;
    if (w < 1250) {
      document?.body?.classList?.toggle("resize-menu");
    }
  };

  let onClickaddBodyClass = (e) => {
    e.preventDefault();
    let w = window.innerWidth;
    if (w < 1250) {
      document?.body?.classList?.toggle("resize-menu");
      return;
    }
    document.body.classList.add("resize-menu");
  };

  const location = useLocation();
  const [activeSubMenus, setActiveSubMenus] = useState({});

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "fa-solid fa-gauge",
      path: "/",
      hasSubmenu: false,
    },
    {
      type: "separator",
      id: "master-separator",
      title: "Master",
    },
    {
      id: "library",
      title: "Library",
      icon: "fa-solid fa-book",
      path: "/library",
      hasSubmenu: false,
    },
    {
      id: "Tenure",
      title: "Library Tenure",
      icon: "fa-solid fa-clock",
      path: "/tenures",
      hasSubmenu: false,
    },
    {
      id: "mentors",
      title: "Mentor",
      icon: "fa-solid fa-chalkboard-user",
      path: "/mentors",
      hasSubmenu: false,
    },
    {
      id: "ebook",
      title: "E-Book",
      icon: "fa-solid fa-tablet-alt",
      path: "/ebook",
      hasSubmenu: false,
    },
    {
      type: "separator",
      id: "user-separator",
      title: "Users",
    },
    {
      id: "users",
      title: "Manage Users",
      icon: "fa-solid fa-users",
      path: "#",
      hasSubmenu: true,
      submenuItems: [
        // {
        //   id: "backend",
        //   title: "Backend Users",
        //   icon: "fa-solid fa-user-shield",
        //   path: "/students",
        // },
        // {
        //   id: "frontend",
        //   title: "FrontEnd Users",
        //   icon: "fa-solid fa-user",
        //   path: "/reviews",
        // },
        // {
        //   id: "permission",
        //   title: "Permissions",
        //   icon: "fa-solid fa-lock",
        //   path: "/reviews",
        // },
        // {
        //   id: "roles",
        //   title: "Roles",
        //   icon: "fa-solid fa-user-tag",
        //   path: "/reviews",
        // },
      ],
    },
    {
      type: "separator",
      id: "mock-separator",
      title: "Mocks",
    },
    {
      id: "organization",
      title: "Organizations",
      icon: "fa-solid fa-building", // Organization icon
      path: "/organizations",
      hasSubmenu: false,
    },
    {
      id: "section",
      title: "Sections",
      icon: "fa-solid fa-layer-group", // Layered sections
      path: "/sections",
      hasSubmenu: false,
    },
    {
      id: "subject",
      title: "Subjects",
      icon: "fa-solid fa-book-open-reader", // Subject reading
      path: "/subjects",
      hasSubmenu: false,
    },
    {
      id: "topic",
      title: "Topics",
      icon: "fa-solid fa-list", // List icon
      path: "/topics",
      hasSubmenu: false,
    },
    {
      id: "subTopic",
      title: "Sub Topics",
      icon: "fa-solid fa-list-ul", // Sub-list icon
      path: "/subtopics",
      hasSubmenu: false,
    },
    {
      id: "exam",
      title: "Exams",
      icon: "fa-solid fa-file-circle-question", // Exam paper/question
      path: "/exams",
      hasSubmenu: false,
    },
    {
      id: "exam",
      title: "Packages",
      icon: "fa-solid fa-file-circle-question", // Exam paper/question
      path: "/packages",
      hasSubmenu: false,
    },
    {
      id: "question",
      title: "Questions",
      icon: "fa-solid fa-question-circle", // Question icon
      path: "/questions",
      hasSubmenu: false,
    },
    {
      id: "language",
      title: "Languages",
      icon: "fa-solid fa-question-circle", // Question icon
      path: "/languages",
      hasSubmenu: false,
    },
    {
      type: "separator",
      id: "mock-separators",
      title: "Finance",
    },
    {
      id: "orders",
      title: "Manage Orders",
      icon: "fa-solid fa-cart-shopping",
      path: "/orders",
      hasSubmenu: true,
      submenuItems: [
        {
          id: "libraryBookings",
          title: "Library Bookings",
          icon: "fa-solid fa-scroll",
          path: "/orders/library-bookings",
          hasSubmenu: false,
        },
        {
          id: "packagePurchase",
          title: "Packages Order",
          icon: "fa-solid fa-box",
          path: "/orders/package-purchase",
          hasSubmenu: false,
        },
        {
          id: "ebookPurchase",
          title: "Ebook Purchase",
          icon: "fa-solid fa fa-book-open ",
          path: "/orders/ebook-purchase",
          hasSubmenu: false,
        },
      ],
    },
    {
      id: "coupon",
      title: "Manage Coupons",
      icon: "fa-solid fa-cart-shopping",
      path: "/coupons",
      hasSubmenu: true,
      submenuItems: [
        {
          id: "couponList",
          title: "Coupons",
          icon: "fa-solid fa-ticket",
          path: "/coupons",
          hasSubmenu: false,
        },
        {
          id: "couponAdd",
          title: "Add Coupon",
          icon: "fa-solid fa-ticket",
          path: "/coupons/add",
          hasSubmenu: false,
        },
      ],
    },
    {
      id: "referral",
      title: "Manage Referrals",
      icon: "fa-solid fa-cart-shopping",
      path: "/referrals",
      hasSubmenu: false,
    },

    {
      type: "separator",
      id: "mock-separators",
      title: "Setting",
    },
    {
      id: "banner",
      title: "Banner",
      icon: "fa-solid fa-layer-group", // Question icon
      path: "/banner",
      hasSubmenu: false,
    },
    {
      id: "settings",
      title: "Settings",
      icon: "fa-solid fa-cog", // Question icon
      path: "/settings",
      hasSubmenu: false,
    },
    {
      id: "testimonial",
      title: "Testimonials",
      icon: "fa-solid fa-cog", // Question icon
      path: "/testimonials",
      hasSubmenu: false,
    },
  ];

  useEffect(() => {
    const subMenuStates = {};
    menuItems.forEach((item) => {
      if (item.hasSubmenu && item.submenuItems) {
        const isActive = item.submenuItems.some(
          (subItem) => location.pathname === subItem.path
        );
        if (isActive) {
          subMenuStates[item.id] = true;
        }
      }
    });

    setActiveSubMenus(subMenuStates);
  }, [location.pathname]);

  const handleToggleSubmenu = (menuKey) => {
    setActiveSubMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isMenuActive = (item) => {
    if (!item.hasSubmenu) {
      return location.pathname === item.path;
    }

    return item.submenuItems.some(
      (subItem) => location.pathname === subItem.path
    );
  };

  return (
    <>
      <div className="dash-menu">
        <div className="dashbord-logo">
          <Link to="" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/Pidigihub_Logo.png" width={50} height={50} alt="Logo" />
            <h2 className="text-white fw-bold">Pidigihub</h2>
          </Link>
          <button className="toggle cross-icon" onClick={onClickaddBodyClass}>
            <i className="fa fa-chevron-left" />
          </button>
        </div>
        <div className="dash-menu-bar">
          <nav className="nav-menu navbar navbar-expand-lg" id="navbar">
            <ul>
              {menuItems.map((item) => {
                if (item.type === "separator") {
                  return (
                    <li
                      key={item.id}
                      className="menu-header"
                      style={{
                        fontSize: "13px",
                        padding: "10px 0px",
                      }}
                    >
                      {item.title}
                    </li>
                  );
                }

                return (
                  <li
                    key={item.id}
                    className={`nav-item ${
                      item.hasSubmenu ? "has-submenu" : ""
                    } ${
                      item.hasSubmenu && activeSubMenus[item.id] ? "show" : ""
                    }`}
                    onClick={item.hasSubmenu ? undefined : addBodyClass}
                  >
                    {item.hasSubmenu ? (
                      <>
                        <div
                          className={`nav-link ${
                            isMenuActive(item) ? "active" : ""
                          }`}
                          onClick={() => handleToggleSubmenu(item.id)}
                        >
                          <span className={`fa ${item.icon} me-2 icon`} />{" "}
                          {item.title}
                          <span className="d-inline-block ms-auto">
                            <i
                              className={`fa fa-angle-${
                                activeSubMenus[item.id] ? "up" : "down"
                              } nav-link-arrow`}
                            />
                          </span>
                        </div>

                        {activeSubMenus[item.id] && (
                          <ul className="sub_menu">
                            {item.submenuItems.map((subItem) => (
                              <li
                                key={subItem.id}
                                className={`nav-item ${
                                  location.pathname === subItem.path
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <NavLink
                                  to={subItem.path}
                                  className="submenu-link"
                                  onClick={addBodyClass}
                                >
                                  <span
                                    className={`fa ${subItem.icon} me-2 icon`}
                                  />{" "}
                                  {subItem.title}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                      >
                        <span className={`fa ${item.icon} me-2 icon`} />
                        {item.title}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* CSS for submenus */}
      <style jsx="true">{`
        .dash-menu .nav-menu .nav-item.has-submenu .nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .dash-menu .nav-menu .nav-item.has-submenu.show .nav-link {
          background-color: #fff;
          color: #2d3748;
          box-shadow: 0px 3.5px 5.5px 0px #00000005;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .dash-menu .nav-menu .nav-item.has-submenu.show .nav-link span.icon {
          background-color: #111727;
          color: #fff;
        }

        .sub_menu {
          background-color: #fff;
          color: #2d3748;
          padding: 0;
          margin: 0;
          margin-bottom: 10px;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          overflow: hidden;
          box-shadow: 0px 3.5px 5.5px 0px #00000005;
        }

        .sub_menu .nav-item {
          margin-bottom: 0;
          padding: 10px 15px;
          overflow: hidden;
        }

        .sub_menu .nav-item.active {
          background-color: #FF693D;
          border: 1px solid #fff;
          border-radius: inherit;
          box-shadow: 1px 2px 6px #ccc;
          margin-bottom: 0;
        }

        .sub_menu .nav-item .submenu-link {
          display: flex;
          align-items: center;
          color: #2d3748;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .sub_menu .nav-item.active .submenu-link {
          color: #fff;
        }

        .sub_menu .nav-item .submenu-link span.icon {
          display: inline-block;
          height: 30px;
          width: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #111727;
          color: #fff;
          border-radius: 10px;
          margin-right: 8px;
        }

        .sub_menu .nav-item.active .submenu-link span.icon {
          background-color: #fff;
          color: #111727;
        }
        .sub_menu .nav-item:hover {
          background: #FFBD0C;
        }

        .menu-header{
        color: #fff;
        border-bottom: 1px dashed #E2EBEC;
        font-family:"poppins"
        padding-bottom:5px;
        margin-bottom:5px;
        }
      `}</style>
    </>
  );
}
