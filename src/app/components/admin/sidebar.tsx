"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems = [
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: <Users size={18} />,
      subMenu: [
        { name: "All Users", path: "/admin/users/all" },
        { name: "Add User", path: "/admin/users/add" },
        { name: "User Roles", path: "/admin/users/roles" },
      ],
    },
    { 
      name: "Settings", 
      path: "/admin/settings", 
      icon: <Settings size={18} />,
      subMenu: [
        { name: "General", path: "/admin/settings/general" },
        { name: "Security", path: "/admin/settings/security" },
        { name: "Notifications", path: "/admin/settings/notifications" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white text-gray-800 h-full p-4 shadow-md">
      <nav>
        <ul>
        <div className="flex items-center gap-2 pb-2">
            {<Home size={18} />}
            <span>Dashboard</span></div>
          {menuItems.map((item) => (
            <li key={item.path}>
              <div 
                className={`flex items-center justify-between p-2 mb-2 rounded-md cursor-pointer hover:bg-gray-200 transition ${
                  pathname.startsWith(item.path) ? "bg-gray-300" : ""
                }`}
                onClick={() => item.subMenu.length > 0 && toggleMenu(item.name)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.subMenu.length > 0 && (
                  openMenus[item.name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />
                )}
              </div>

              {/* Submenu */}
              {item.subMenu.length > 0 && openMenus[item.name] && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.path}>
                      <Link href={subItem.path} className="block p-2 text-sm rounded-md hover:bg-gray-200">
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