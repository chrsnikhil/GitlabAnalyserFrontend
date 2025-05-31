import React from "react";
import { FloatingDock } from "./floating-dock";
import { FaGithub, FaHome } from "react-icons/fa";
import { FiSettings, FiRefreshCw, FiBookOpen } from "react-icons/fi";

export function FloatingDockDemo({ resetWorkflow }: { resetWorkflow: () => void }) {
  const links = [
    {
      title: "Home",
      icon: <FaHome className="h-full w-full" />,
      href: "/",
      type: "link"
    },
    {
      title: "Docs",
      icon: <FiBookOpen className="h-full w-full" />,
      href: "/docs",
      type: "link"
    },
    {
      title: "Reset",
      icon: <FiRefreshCw className="h-full w-full" />,
      href: "#",
      type: "reset"
    },
    {
      title: "GitHub",
      icon: <FaGithub className="h-full w-full" />,
      href: "https://github.com/chrsnikhil/your-repo",
      type: "link"
    },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50">
      <FloatingDock items={links} resetWorkflow={resetWorkflow} />
    </div>
  );
} 