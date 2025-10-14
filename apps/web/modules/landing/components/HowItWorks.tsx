import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Upload, Brain, MessageCircle, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Knowledge Base",
    description:
      "Upload your institutional FAQs, circulars, scholarship forms, and documents. ASKLY automatically extracts and indexes information for instant retrieval.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Processing & Training",
    description:
      "Our advanced AI engine processes your documents using RAG technology, understanding context and relationships to provide accurate, relevant answers.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Student Interactions",
    description:
      "Students ask questions in their preferred language through web widget, WhatsApp, Telegram, or voice calls. ASKLY responds instantly with contextual answers.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Monitor & Improve",
    description:
      "Track conversations, analyze common queries, and continuously improve responses. Escalate complex queries to staff with full conversation context.",
    color: "from-orange-500 to-red-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <div className="pb-2 md:pb-5">Get Started in</div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            From setup to student support in minutes. No technical expertise
            required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 -z-10" />
              )}

              <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Step Number */}
                    <div
                      className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    >
                      {item.step}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
