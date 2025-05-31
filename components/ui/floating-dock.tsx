"use client";

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  resetWorkflow,
}: {
  items: { title: string; icon: React.ReactNode; href: string; type?: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  resetWorkflow?: () => void;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} resetWorkflow={resetWorkflow} />
      <FloatingDockMobile items={items} className={mobileClassName} resetWorkflow={resetWorkflow} />
    </>
  );
};

function DockItem({
  title,
  icon,
  href,
  type,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  type?: string;
  onClick?: () => void;
}) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.15, backgroundColor: '#1e293b' }}
      whileTap={{ scale: 0.95 }}
      style={{ backgroundColor: '#0f172a' }}
      className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center border border-gray-800 shadow-lg cursor-pointer"
      title={title}
    >
      <div className="h-5 w-5 md:h-8 md:w-8 text-blue-400 flex items-center justify-center">{icon}</div>
    </motion.div>
  );
  if (type === "reset") {
    return (
      <button onClick={onClick} className="bg-transparent p-0 border-none outline-none" title={title} type="button">
        {content}
      </button>
    );
  }
  return (
    <Link href={href} title={title} className="bg-transparent p-0 border-none outline-none">
      {content}
    </Link>
  );
}

const FloatingDockMobile = ({
  items,
  className,
  resetWorkflow,
}: {
  items: { title: string; icon: React.ReactNode; href: string; type?: string }[];
  className?: string;
  resetWorkflow?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("fixed bottom-4 right-4 z-50 block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 right-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <DockItem
                  title={item.title}
                  icon={item.icon}
                  href={item.href}
                  type={item.type}
                  onClick={item.type === "reset" ? resetWorkflow : undefined}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-950 border border-gray-800 shadow-lg"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-blue-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  resetWorkflow,
}: {
  items: { title: string; icon: React.ReactNode; href: string; type?: string }[];
  className?: string;
  resetWorkflow?: () => void;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 hidden md:flex h-16 gap-4 items-end rounded-2xl px-4 pb-3 bg-gray-950 border border-gray-800 shadow-xl",
        className
      )}
    >
      {items.map((item) =>
        item.type === "reset" ? (
          <button
            key={item.title}
            onClick={resetWorkflow}
            className="bg-transparent p-0 border-none outline-none"
            title={item.title}
            type="button"
          >
            <IconContainer
              mouseX={mouseX}
              title={item.title}
              icon={item.icon}
              href={item.href}
              isButton
            />
          </button>
        ) : (
          <IconContainer
            key={item.title}
            mouseX={mouseX}
            title={item.title}
            icon={item.icon}
            href={item.href}
          />
        )
      )}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isButton = false,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  isButton?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-full flex items-center justify-center relative bg-gray-950 border border-gray-800 shadow-lg hover:bg-gray-900 transition-colors"
      title={title}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              mass: 0.1
            }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-[#1A1B24] border border-[#2A2B34] text-white absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs font-goldman"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center text-white"
      >
        {icon}
      </motion.div>
    </motion.div>
  );
  if (isButton) {
    return content;
  }
  return (
    <Link href={href} title={title} className="bg-transparent p-0 border-none outline-none">
      {content}
    </Link>
  );
} 