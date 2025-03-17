import Image from "next/image"

export function CertificatesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-center">CIN - U45299DL2023PTC413854</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Certificate 1 */}
          <div className="border p-2">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Certificate"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-center text-sm mt-2">MSME Registration</p>
          </div>

          {/* Certificate 2 */}
          <div className="border p-2">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Certificate"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-center text-sm mt-2">GST Certificate</p>
          </div>

          {/* Certificate 3 */}
          <div className="border p-2">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Certificate"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-center text-sm mt-2">PAN Card</p>
          </div>

          {/* Certificate 4 */}
          <div className="border p-2">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Certificate"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-center text-sm mt-2">UDYAM-DL-03-0037975</p>
          </div>
        </div>
      </div>
    </section>
  )
}

