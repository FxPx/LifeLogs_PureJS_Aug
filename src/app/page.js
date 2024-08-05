/* - - - - - - - - - - - - - - - - */
/* src/app/page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import FxShowAllData from './clientComponent';

export default async function HomePage() {

  async function fetchServerData() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/api`);
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
/* - - - - - - - - - - - - - - - - */