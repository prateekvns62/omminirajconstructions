export function PricingSection() {
  return (
    <section className="py-12 bg-[#1A2B48] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Construction Work Pricing & Loan Options</h2>

        <div className="max-w-3xl mx-auto">
          {/* One Time Full Payment */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">One Time Full Payment</h3>
            <p className="mb-4">
              Avail a special discount of 5% on the total project cost when you make a lump sum payment at the start of
              the project. This is the most cost-effective payment option.
            </p>
          </div>

          {/* Loan Payment Option */}
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Loan Payment Option</h3>
            <p className="mb-4">Can&apos;t pay upfront? Don&apos;t worry!</p>
            <p className="mb-4">
              We work directly with banks for up to 5 years with a 0% interest rate. For this loan, you will need to pay
              10% as an advance and the remaining 90% as loan.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

