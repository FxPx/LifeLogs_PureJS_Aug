/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/bits/fxTitleBar.js | TitleBar Component | Sree | 06 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import React from 'react';
import '../fxStyles.css';
import FxTabs from './fxTabs'; // Import the fxTabs component

const FxTitleBar = () => {
  return (
    <nav className="fxNavBar">
      <div>Life Logs</div>
      <FxTabs /> {/* Add the tabs component */}
    </nav>
  );
};

export default FxTitleBar;
/* - - - - - - - - - - - - - - - - - - - - */