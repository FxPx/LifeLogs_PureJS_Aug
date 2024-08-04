// /* - - - - - - - - - - - - - - - - */
// /* src/app/page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// import ClientComponent from './clientComponent';

// export default async function Home() {
//   // Fetch data directly within this function
//   const fetchServerData = async () => {
//     try {
//       const res = await fetch('https://your-api-endpoint'); // Replace with your API endpoint
//       // const res = await fetch('/api/route'); // Replace with your API endpoint
//       if (!res.ok) throw new Error('Failed to fetch data');
//       const result = await res.json();
//       const { headers, data, formData } = result;
//       return { headers, data, formData };
//     } catch (error) {
//       console.error('Error fetching server data:', error);
//       return { headers: [], data: [], formData: {} };
//     }
//   };

//   const { headers, data, formData } = await fetchServerData();

//   return (
//     <main>
//       <ClientComponent
//         headers={headers}
//         data={data}
//         initialFormData={formData}
//       />
//     </main>
//   );
// }
// /* - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - */
/* src/app/page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import ClientComponent from './clientComponent';

export default async function Home() {
  // Fetch data directly within this function
  async function fetchServerData() {
    try {
      const res = await fetch('/api/route');
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      const { headers, data, formData } = result;
      return { headers, data, formData };
    } catch (error) {
      console.error('Error fetching server data:', error);
      return { headers: [], data: [], formData: {} };
    }
  }
  

  const { headers, data, formData } = await fetchServerData();

  return (
    <main>
      <ClientComponent
        headers={headers}
        data={data}
        initialFormData={formData}
      />
    </main>
  );
}
/* - - - - - - - - - - - - - - - - */