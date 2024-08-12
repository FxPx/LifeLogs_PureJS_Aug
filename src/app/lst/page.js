/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/lst/page.js | List Page | Sree | 06 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";

import React, { useState, useEffect } from 'react';

const generateListContent = () => {
    let content = [];
    for (let i = 0; i < 50; i++) {
        content.push(<p key={i}>List Item {i + 1}</p>);
    } // Generate dummy list items
    return content;
};

const ListPage = () => {
    const [content, setContent] = useState([]);

    useEffect(() => {
        setContent(generateListContent()); // Set content on component mount
    }, []);

    return (
        <>
            <h1>List</h1>
            {content}
        </>
    );
};

export default ListPage;
/* - - - - - - - - - - - - - - - - - - - - */