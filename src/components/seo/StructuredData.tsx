interface StructuredDataProps {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

// Predefined structured data templates
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Beforest 10cent Club",
  "description": "A strategic conversation about regenerative living and the mathematics of wilderness integration",
  "url": "https://10cnt.beforest.co",
  "logo": "https://10cnt.beforest.co/favicon.png",
  "sameAs": [
    "https://twitter.com/beforestclub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service"
  }
}

export const eventData = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Beforest 10cent Club Strategic Wilderness Integration",
  "description": "10% of your life spent with nature restores 100% of your nature.",
  "startDate": "2024-12-07T17:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://10cnt.beforest.co"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Beforest",
    "url": "https://beforest.co"
  }
}

export const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Beforest 10cent Club",
  "description": "A strategic conversation about regenerative living and the mathematics of wilderness integration",
  "url": "https://10cnt.beforest.co",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://10cnt.beforest.co/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}