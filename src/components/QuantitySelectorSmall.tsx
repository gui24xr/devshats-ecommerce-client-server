export default function QuantitySelectorSmall({ quantity, onChange, min = 1, max = 10 }: any) {
    const handleChange = (e: any) => {
        const newQuantity = parseInt(e.target.value, 10);
        onChange(newQuantity);
    };

    const options = [];
    for (let i = min; i <= max; i++) {
        options.push(
            <option key={i} value={i}>
                {i}
            </option>
        );
    }

    return (
        <div >
            
            <select
                value={quantity}
                onChange={handleChange}
                className="border border-orange-300 rounded-md px-3 py-1 text-sm bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 hover:bg-orange-50"
            >
                {options}
            </select>
        </div>
    );
}


