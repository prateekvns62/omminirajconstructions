export function PricingSection() {
  return (
    <section className="py-12 bg-[#1A2B48] text-white">
      <div className="container mx-auto px-4 max-w-7xl md:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Construction Work Pricing & Loan Options
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
          {/* One Time Full Payment */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400">One Time Full Payment</h3>
            <p className="mt-2">
              We are offering construction work for an area of{" "}
              <span className="font-bold text-orange-400">900 sqft</span> with a total cost of{" "}
              <span className="font-bold text-orange-400">₹760,000</span>. This is a one-time full payment option.
            </p>
          </div>

          {/* Loan Payment Option */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400">Loan Payment Option</h3>
            <p className="mt-2">Cost per square foot: <span className="font-bold text-orange-400">₹1900</span></p>
            <p>Loan duration: <span className="font-bold text-orange-400">9 years with 0% interest</span></p>
            <p>Payment structure: <span className="font-bold text-orange-400">25% advance, remaining 75% on loan</span></p>
            <p>Requirement: <span className="font-bold text-orange-400">6 PDC cheques</span></p>
          </div>

          {/* Two-Part Payment Option */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400">Two-Part Payment Option</h3>
            <p className="mt-2">Total cost: <span className="font-bold text-orange-400">₹850,000</span></p>
            <p>Advance: <span className="font-bold text-orange-400">₹425,000</span></p>
            <p>
              Post-dated cheque (PDC): <span className="font-bold text-orange-400">₹425,000 </span> 
              (<span className="italic">DOR and BIM lagne ke bad</span>).
            </p>
          </div>

          {/* Three-Part Payment Option */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400">Three-Part Payment Option</h3>
            <p className="mt-2">
              Total cost: <span className="font-bold text-orange-400">₹800,000 + 18% GST = ₹944,000</span>
            </p>
            <p>Advance: <span className="font-bold text-orange-400">₹314,667</span></p>
            <p>PDC: <span className="font-bold text-orange-400">₹314,667</span></p>
            <p>Final Payment: <span className="font-bold text-orange-400">₹314,667 </span> 
              (<span className="italic">Linter lagne ke pahale</span>).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
