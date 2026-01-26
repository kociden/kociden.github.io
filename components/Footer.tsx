import React from 'react';
import { PROFILE } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-skin-text/10 bg-skin-base text-center">
      <p className="text-skin-muted text-sm">
        &copy; {new Date().getFullYear()} {PROFILE.brand} / {PROFILE.name}. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
