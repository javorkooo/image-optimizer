const FormatSelector = ({ format, setFormat }) => {
  const options = ['jpeg', 'webp', 'avif', 'png'];

  return (
    <div>
      <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
        Output Format
      </label>
      <select
        id="format"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormatSelector;
