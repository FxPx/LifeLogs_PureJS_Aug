// /* - - - - - - - - - - - - - - - - */
// /* src/app/page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// import FxShowAllData from './FxShowAllData';

// export default async function Home() {
//   // Fetch data directly within this function
//   async function fetchServerData() {
//     try {
//       const res = await fetch('/api');
//       if (!res.ok) throw new Error('Failed to fetch data');
//       const result = await res.json();
//       const { headers, data, formData } = result;
//       return { headers, data, formData };
//     } catch (error) {
//       console.error('Error fetching server data:', error);
//       return { headers: [], data: [], formData: {} };
//     }
//   }


//   const { headers, data, formData } = await fetchServerData();

//   return (
//     <main>
//       <FxShowAllData
//         headers={headers}
//         data={data}
//         initialFormData={formData}
//       />
//     </main>
//   );
// }
// /* - - - - - - - - - - - - - - - - */




import FxShowAllData from './clientComponent';

export default async function HomePage() {
  // Fetch data directly within this function
  async function fetchServerData() {
    try {
      const res = await fetch('http://localhost:3000/api');
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      const { data } = result;
      if (Array.isArray(data) && data.length > 0) {
        const [headers, ...rows] = data;
        const formData = Object.fromEntries(headers.map((_, i) => [`col${i}`, '']));
        return { headers, data: rows, formData };
      }
      return { headers: [], data: [], formData: {} };
    } catch (error) {
      console.error('Error fetching server data:', error);
      return { headers: [], data: [], formData: {} };
    }
  }

  const { headers, data, formData } = await fetchServerData();

  return (
    <main>
      <FxShowAllData
        initialHeaders={headers}
        initialData={data}
        initialFormData={formData}
      />
    </main>
  );
}