import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const BottomBar = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-background)] border-t border-[var(--border-color)] p-4 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center text-[var(--secondary-text)]">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AIreels. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/gurmeet-756279235/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[var(--primary)] transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="http://github.com/gurmeetpunia/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[var(--primary)] transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;