/* - - - - - - - - - - - - - - - - */
/* src/app/bits/fxTabs.js | Tab Component | Sree | 12 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Updated hook

const FxTabs = () => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="tabsWrap">
      <Link href="/" className={`divTab ${pathname === '/' ? 'active' : ''}`}>Trends</Link>
      <Link href="/cal" className={`divTab ${pathname === '/cal' ? 'active' : ''}`}>Dates</Link>
      <Link href="/lst" className={`divTab ${pathname === '/lst' ? 'active' : ''}`}>Logs</Link>
    </div>
  );
};

export default FxTabs;
/* - - - - - - - - - - - - - - - - */