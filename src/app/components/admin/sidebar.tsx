"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home, 
    Users, 
    Settings, 
    ChevronDown, 
    ChevronUp, 
    Clipboard, 
    Calendar, 
    Briefcase, 
    MessageCircle, 
    Phone, 
    FileText, 
    Award, 
    MapPin, 
    File, 
    Image, 
    Layers 
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname() || "";
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subMenu?.some((sub) => pathname.startsWith(sub.path))) {
        setOpenMenus({ [item.name]: true });
      }
    });
  }, [pathname]);


  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => {
      const isAlreadyOpen = prev[menuName];
      return { [menuName]: !isAlreadyOpen }; // Close all other menus
    });
  };
  
const menuItems = [
    { name: "Contact Us", path: "/admin/contact", icon: <Phone size={18} color="blue" /> },
    { name: "Booking Form", path: "/admin/booking-form", icon: <FileText size={18} color="green" /> },
    {
        name: "Franchise Booking",
        path: "/admin/franchise",
        icon: <Calendar size={18} color="purple" />,
        subMenu: [
            { name: "All Franchise", path: "/admin/franchise/all" },
            { name: "Add Franchise", path: "/admin/franchise/add" },
        ],
    },
    { 
        name: "Branches", 
        path: "/admin/branches", 
        icon: <MapPin size={18} color="red" />,
        subMenu: [
            { name: "All Branches", path: "/admin/branches/all" },
            { name: "Add Branch", path: "/admin/branches/add" },
        ],
    },
    { 
        name: "Our Services", 
        path: "/admin/services", 
        icon: <Briefcase size={18} color="orange" />,
        subMenu: [
            { name: "All Services", path: "/admin/services/all" },
            { name: "Add Service", path: "/admin/services/add" },
        ],
    },
    { 
        name: "Our Clients", 
        path: "/admin/clients", 
        icon: <Users size={18} color="cyan" />,
        subMenu: [
            { name: "All Clients", path: "/admin/clients/all" },
            { name: "Add Client", path: "/admin/clients/add" },
        ],
    },
    { 
        name: "Gallery", 
        path: "/admin/gallery", 
        icon: <Image size={18} color="pink" />,
        subMenu: [
            { name: "All Images", path: "/admin/gallery/all" },
            { name: "Add Image", path: "/admin/gallery/add" },
        ],
    },
    { 
        name: "Ongoing Projects", 
        path: "/admin/ongoing-projects", 
        icon: <Clipboard size={18} color="brown" />,
        subMenu: [
            { name: "All Projects", path: "/admin/ongoing-projects/all" },
            { name: "Add Project", path: "/admin/ongoing-projects/add" },
        ],
    },
    { 
        name: "Pages Content", 
        path: "/admin/pages", 
        icon: <File size={18} color="teal" />,
        subMenu: [
            { name: "All Pages", path: "/admin/pages/all" },
            { name: "Add Page", path: "/admin/pages/add" },
        ],
    },
    {
        name: "Testimonials", 
        path: "/admin/testimonials", 
        icon: <MessageCircle size={18} color="violet" />,
        subMenu: [
            { name: "All Testimonials", path: "/admin/testimonials/all" },
            { name: "Add Testimonial", path: "/admin/testimonials/add" },
        ],
    },
    { 
        name: "Active Certificates", 
        path: "/admin/certificates", 
        icon: <Award size={18} color="gold" />,
        subMenu: [
            { name: "All Certificates", path: "/admin/certificates/all" },
            { name: "Add Certificate", path: "/admin/certificates/add" },
        ],
    },
    {
        name: "Admin Users", 
        path: "/admin/users", 
        icon: <Users size={18} color="navy" />,
        subMenu: [
            { name: "All Users", path: "/admin/profile/all" },
            { name: "Add User", path: "/admin/profile/add" },
        ],
    },
    { 
        name: "Settings", 
        path: "/admin/settings", 
        icon: <Settings size={18} color="black" />,
        subMenu: [
            { name: "General", path: "/admin/settings/general" },
            { name: "SMTP", path: "/admin/settings/smtp" },
            { name: "Notifications", path: "/admin/settings/notifications" },
        ],
    },
];


return (
  <aside className="w-64 bg-white text-gray-800 h-full p-4 shadow-md">
    <nav>
      <ul>
        <li>
          <Link 
            href="/admin"
            className="flex items-center gap-2 p-3 mb-3 font-semibold border-b border-black hover:text-black-500"
          >
            <span>Dashboard</span>
          </Link>
        </li>

        {menuItems.map((item) => (
          <li key={item.path} className="mb-4">
            {item.subMenu ? (
              <div 
                className={`flex items-center justify-between p-2 mb-2 rounded-md cursor-pointer hover:bg-gray-200 transition ${
                  openMenus[item.name] ? "bg-gray-300" : ""
                }`}
                onClick={() => toggleMenu(item.name)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {openMenus[item.name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            ) : (
              <Link 
                href={item.path} 
                className={`flex items-center gap-2 p-2 w-full rounded-md hover:bg-gray-200 transition ${
                  pathname.startsWith(item.path) ? "bg-gray-400 text-white" : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )}

            {item.subMenu && openMenus[item.name] && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.subMenu.map((subItem) => (
                  <li key={subItem.path} className="mb-2">
                    <Link 
                      href={subItem.path} 
                      className={`block p-2 text-md rounded-md hover:bg-gray-200 transition ${
                        pathname.startsWith(subItem.path) ? "bg-gray-400 text-white" : ""
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);
};

export default Sidebar;