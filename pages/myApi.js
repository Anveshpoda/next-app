import SelectField from '@/components/UI/Form/select';
import InputField from '@/components/UI/inputField';
import { useState } from 'react';

export default function myApi() {
  // Set up the form state. Note: We include 'host' to match the API and use 'ename'
  const [formData, setFormData] = useState({
    mobile: '',
    docId: '',
    user_type: 'owner',
    compDetails: '0',
    rsvnInfo: '0',
    multiDocData: '0',
    eid: '',
    ename: '',
    host: '',
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApiResponse(null);

    // Build the query string. Mapping "ename" to the API's "ename"
    const params = new URLSearchParams({
      mobile: formData.mobile,
      docId: formData.docId,
      user_type: formData.user_type,
      compDetails: formData.compDetails,
      rsvnInfo: formData.rsvnInfo,
      multiDocData: formData.multiDocData,
      ename: formData.ename,
      host: formData.host,
    });

    const queryParams = new URLSearchParams(formData).toString();

    try {
      const res = await fetch(`/api/el/myApi?${queryParams}`);
      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Increase the max width to allow side-by-side content */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">API Caller</h1>

        {/* Flex container: stacks on mobile, row layout on md+ */}
        <div className="flex flex-col md:flex-row gap-8 max-w-500">
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="grid grid-cols-1 gap-4">
              <InputField
                label="Mobile"
                type="tel"
                name="mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
              <InputField
                label="Doc ID"
                type="text"
                name="docId"
                id="docId"
                value={formData.docId}
                onChange={handleChange}
              />
              <InputField
                label="User Type"
                type="text"
                name="user_type"
                id="user_type"
                value={formData.user_type}
                onChange={handleChange}
              />

              {/* Select Fields in One Row */}
              <div className="grid grid-cols-3 gap-4">
                <SelectField
                  label="Comp Details"
                  type="text"
                  name="compDetails"
                  id="compDetails"
                  value={formData.compDetails}
                  onChange={handleChange}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                </SelectField>

                <SelectField
                  label="Rsvn Info"
                  type="text"
                  name="rsvnInfo"
                  id="rsvnInfo"
                  value={formData.rsvnInfo}
                  onChange={handleChange}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                </SelectField>

                <SelectField
                  label="Multi Doc Data"
                  type="text"
                  name="multiDocData"
                  id="multiDocData"
                  value={formData.multiDocData}
                  onChange={handleChange}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                </SelectField>
              </div>

              <InputField
                label="EID"
                type="number"
                name="eid"
                id="eid"
                value={formData.eid}
                onChange={handleChange}
              />
              <InputField
                label="Emp Name"
                type="text"
                name="ename"
                id="ename"
                value={formData.ename}
                onChange={handleChange}
              />
              <InputField
                label="Host"
                type="text"
                name="host"
                id="host"
                value={formData.host}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Loading...' : 'Call API'}
            </button>
          </form>
        </div>

        {/* API Response Section */}
        {apiResponse && (
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Display errors, if any */}
        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      </div>
    </div>
  );
}
