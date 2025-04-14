export default function CureerOverview() {
    return (
    <div className="mt-12 text-left">
    <h3 className="text-2xl font-bold">Build Your Future with Us</h3>
    <p className="mt-2">At <strong>Om Miniraj Building and Construction Services Private Limited</strong>, we take pride in shaping skylines, building strong infrastructures, and creating long-lasting projects...</p>
    <div className="flex flex-col md:flex-row justify-between gap-8 pt-8">
      {/* Why Join Us Section */}
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold">Why Join Us?</h2>
        <ul className="list-none pl-5">
          <li>🏗️ Work on large-scale commercial, residential, and infrastructure projects</li>
          <li>💰 Competitive salaries with project-based incentives</li>
          <li>📚 Professional development programs & hands-on training</li>
          <li>🦺 State-of-the-art safety standards and compliance</li>
          <li>👷 Collaborative and skilled workforce with industry experts</li>
          <li>📈 Growth opportunities in project management, engineering, and site operations</li>
        </ul>
      </div>

      {/* Hiring Process Section */}
      <div className="md:w-1/2">
        <h2 className="text-xl font-bold">Our Hiring Process</h2>
        <ol className="list-decimal pl-5">
          <li>Submit your resume and project portfolio through our Careers Page.</li>
          <li>Our team shortlists candidates based on experience and qualifications.</li>
          <li>Initial screening interview.</li>
          <li>On-site skills assessment or field evaluation (if applicable).</li>
          <li>Final interview with the project manager or leadership team.</li>
          <li>Offer letter & onboarding, followed by safety and compliance training.</li>
        </ol>
      </div>
    </div>
    <h3 className="text-xl font-bold mt-4">Contact Us</h3>
    <p>📧 Email: <a href="mailto:omminiraj@gmail.com" className="text-black-600 hover:text-yellow-400 hover:underline">omminiraj@gmail.com</a>, <a href="mailto:minirajconstruction@gmail.com" className="text-black-600 hover:text-yellow-400 hover:underline">minirajconstruction@gmail.com</a></p>
    <p>📞 Phone: <a href="tel:+919899826796" className="text-black-600 hover:text-yellow-400 hover:underline">+91-9899826796</a> | <a href="tel:1140395728" className="text-black-600 hover:text-yellow-400 hover:underline">11 4039 5728</a></p>
  </div>
    );
}