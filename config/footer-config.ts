// config/footer-config.ts

export const FOOTER_CONFIG = {
  COMPANY: {
    NAME: "Fresthie",
    EMAIL: "hello@Fresthiescoffee.com",
    LOGO: "☕"
  },
  
  LOCATIONS: [
    {
      country: "Cambodia",
      countryEmoji: "🇰🇭",
      address: {
        line1: "123 Coffee Street,",
        line2: "Phnom Penh, Cambodia"
      }
    }
  ],
  
  CONTACT: {
    phone: "+855 12 345 678",
    phoneEmoji: "📞"
  },
  
  LINKS: {
    ABOUT: {
      title: { en: "About", kh: "អំពី" },
      items: [
        { en: "Our Story", kh: "រឿងរ៉ាវរបស់យើង" },
        { en: "Our Coffee", kh: "កាហ្វេរបស់យើង" },
        { en: "Sustainability", kh: "ចីរភាព" },
        { en: "Careers", kh: "ការងារ" }
      ]
    },
    MENU: {
      title: { en: "Menu", kh: "ម៉ឺនុយ" },
      items: [
        { en: "Coffee", kh: "កាហ្វេ" },
        { en: "Tea", kh: "តែ" },
        { en: "Pastries", kh: "នំ" },
        { en: "Breakfast", kh: "អាហារពេលព្រឹក" }
      ]
    },
    SERVICES: {
      title: { en: "Services", kh: "សេវាកម្ម" },
      items: [
        { en: "Catering", kh: "ការផ្គត់ផ្គង់" },
        { en: "Events", kh: "ព្រឹត្តិការណ៍" },
        { en: "Private Parties", kh: "ពិធីជប់លៀងឯកជន" },
        { en: "Corporate Orders", kh: "ការបញ្ជាទិញក្រុមហ៊ុន" }
      ]
    }
  },
  
  HOURS: {
    title: { en: "Hours", kh: "ម៉ោងបើក" },
    periods: [
      { 
        days: { en: "Mon - Fri", kh: "ច័ន្ទ - សុក្រ" }, 
        hours: "6:00 AM - 9:00 PM" 
      },
      { 
        days: { en: "Saturday", kh: "សៅរ៍" }, 
        hours: "7:00 AM - 10:00 PM" 
      },
      { 
        days: { en: "Sunday", kh: "អាទិត្យ" }, 
        hours: "7:00 AM - 8:00 PM" 
      }
    ]
  },
  
  NEWSLETTER: {
    title: { en: "Newsletter", kh: "ព័ត៌មានថ្មី" },
    description: { 
      en: "Subscribe for updates and exclusive offers!", 
      kh: "ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ!" 
    },
    placeholder: { 
      en: "Your email", 
      kh: "អ៊ីមែលរបស់អ្នក" 
    },
    button: { 
      en: "Subscribe", 
      kh: "ចុះឈ្មោះ" 
    }
  },
  
  MAP: {
    center: [11.61616823412506, 104.90097788247442] as [number, number],
    locationName: "My Coffee Shop"
  },
  
  LEGAL: {
    copyright: {
      en: "© 2025 Fresthie's Coffee, All rights reserved",
      kh: "© ២០២៥ Fresthie's Coffee។ រក្សាសិទ្ធិគ្រប់យ៉ាង។"
    },
    links: [
      { en: "Privacy Policy", kh: "គោលការណ៍ភាពឯកជន" },
      { en: "Terms of Service", kh: "លក្ខខណ្ឌសេវាកម្ម" },
      { en: "Contact", kh: "ទាក់ទង" }
    ]
  },
  
  SOCIAL_MEDIA: {
    // Using React Icons safely by configuration only
    platforms: [
      { 
        name: "Facebook", 
        icon: "IoLogoFacebook", 
        url: "#" 
      },
      { 
        name: "Instagram", 
        icon: "IoLogoInstagram", 
        url: "#" 
      },
      { 
        name: "Twitter", 
        icon: "IoLogoTwitter", 
        url: "#" 
      }
    ]
  }
} as const;

// Type for the configuration
export type FooterConfig = typeof FOOTER_CONFIG;

// Helper function to get translated text
export const getTranslatedText = (text: { en: string; kh: string }, language: "en" | "kh"): string => {
  return text[language];
};