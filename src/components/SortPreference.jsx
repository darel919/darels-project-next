'use client';

export default function SortPreference({ defaultValue }) {
  return (
    <form method="get">
      <select 
        name="sortBy" 
        defaultValue={defaultValue} 
        className="select select-bordered w-full max-w-[200px] rounded-4xl"
        onChange={(e) => {
          document.cookie = `sortPreference=${e.target.value};path=/;max-age=31536000`;
          e.target.form.submit();
        }}
        autoComplete="off"
      >
        <option value="desc">Newest to Oldest</option>
        <option value="asc">Oldest to Newest</option>
      </select>
    </form>
  );
}