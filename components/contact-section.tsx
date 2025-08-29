import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ContactSectionProps {
  language: "en" | "kh"
}

export function ContactSection({ language }: ContactSectionProps) {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-600 mb-4">
            {language === "en" ? "Visit Us" : "មកលេងយើង"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {language === "en"
              ? "Experience the perfect blend of comfort and quality at our coffee shop"
              : "ជួបជាមួយការលាយបញ្ចូលដ៏ល្អឥតខ្ចោះនៃភាពស្រួលស្រាល និងគុណភាពនៅហាងកាហ្វេរបស់យើង"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{language === "en" ? "Location" : "ទីតាំង"}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                123 Coffee Street
                <br />
                Phnom Penh, Cambodia
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{language === "en" ? "Phone" : "លេខទូរស័ព្ទ"}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                +855 12 345 678
                <br />
                +855 98 765 432
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{language === "en" ? "Hours" : "ម៉ោងបើក"}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === "en" ? "Mon - Sun" : "ច័ន្ទ - អាទិត្យ"}
                <br />
                6:00 AM - 10:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-600 flex items-center justify-center mx-auto mb-4">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{language === "en" ? "Follow Us" : "តាមដានយើង"}</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
