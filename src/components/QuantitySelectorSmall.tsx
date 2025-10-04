// QuantitySelectorSmall.tsx
export default function QuantitySelectorSmall({ 
  quantity, 
  onChange, 
  minQuantity = 1,   // ← Cambiar de min a minQuantity
  maxQuantity = 10   // ← Cambiar de max a maxQuantity
}: any) {
  const handleChange = (e: any) => {
    const newQuantity = parseInt(e.target.value, 10)
    onChange(newQuantity)
  }

  const options = []
  for (let i = minQuantity; i <= maxQuantity; i++) {  // ← Usar minQuantity/maxQuantity
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    )
  }

  return (
    <div>
      <select
        value={quantity}
        onChange={handleChange}
        className="text-sm border border-orange-300 rounded-md px-3 py-1 bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 hover:bg-orange-50"
      >
        {options}
      </select>
    </div>
  )
}