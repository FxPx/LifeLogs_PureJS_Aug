/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/page.js | Main Page | Sree | 06 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";

import React, { useState, useEffect } from 'react';

const generateDummyContent = () => {
    let content = [];
    for (let i = 0; i < 100; i++) {
        content.push(<p key={i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>);
    } // Generate dummy content with 100 paragraphs
    return content;
};

const Page = () => {
    const [content, setContent] = useState([]);

    useEffect(() => {
        setContent(generateDummyContent()); // Set content on component mount
    }, []);

    return (
        <>
            {content}
        </>);
};

export default Page;
/* - - - - - - - - - - - - - - - - - - - - */