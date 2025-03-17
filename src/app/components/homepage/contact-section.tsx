import Image from "next/image"

export function ContactSection() {
  return (
    <section className="py-10 bg-[#1A2B48] text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Image src="/placeholder.svg?height=60&width=140" alt="Om Miniraj Logo" width={140} height={60} />
            </div>
            <h2 className="text-xl font-bold mb-4">OM MINIRAJ BUILDING AND CONSTRUCTION SERVICES PVT LTD</h2>
            <p className="mb-4">हमारी कंपनी का मुख्य उद्देश्य है कि हम अपने ग्राहकों को सर्वोत्तम निर्माण सेवाएं प्रदान करें।</p>
            <p className="mb-4">
              <strong>पता:</strong> शिवाजी नगर, पुणे, महाराष्ट्र
            </p>
            <p className="mb-4">
              <strong>फोन:</strong> +91 1234 567890
            </p>
            <p className="mb-4">
              <strong>ईमेल:</strong> info@omminiraj.com
            </p>
            <p className="mb-4">
              <strong>कार्य समय:</strong> सोम-शनि, सुबह 9:00 बजे - शाम 6:00 बजे
            </p>
            <p className="mb-4">
              <strong>हमारे पास 10,000 से अधिक संतुष्ट ग्राहक हैं।</strong>
            </p>
            <p className="mb-4">
              हम अपने ग्राहकों को उनके सपनों के घर बनाने में मदद करते हैं। हमारी टीम अनुभवी पेशेवरों से बनी है जो आपके प्रोजेक्ट को समय पर और
              बजट के भीतर पूरा करने के लिए प्रतिबद्ध हैं।
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">हमारी सेवाएँ</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>आवासीय भवन निर्माण</li>
              <li>वाणिज्यिक भवन निर्माण</li>
              <li>बुनियादी ढांचा विकास</li>
              <li>इंटीरियर डिज़ाइन</li>
              <li>रेनोवेशन और रिमॉडलिंग</li>
            </ul>

            <h2 className="text-xl font-bold mb-4">हमारे प्रोजेक्ट्स</h2>
            <p className="mb-4">हमने पुणे, मुंबई, और महाराष्ट्र के अन्य हिस्सों में कई सफल प्रोजेक्ट्स पूरे किए हैं।</p>

            <h2 className="text-xl font-bold mb-4">संपर्क करें</h2>
            <p className="mb-4">अधिक जानकारी के लिए या अपने प्रोजेक्ट पर चर्चा करने के लिए, कृपया हमें कॉल करें: +91 1234 567890</p>

            <h2 className="text-xl font-bold mb-4">कार्यालय समय</h2>
            <p className="mb-4">सोमवार - शुक्रवार: सुबह 9:00 बजे - शाम 6:00 बजे</p>
            <p className="mb-4">शनिवार: सुबह 9:00 बजे - दोपहर 2:00 बजे</p>
            <p className="mb-4">रविवार: बंद</p>
          </div>
        </div>
      </div>
    </section>
  )
}

