import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  MessageSquare,
  Globe,
  Brain,
  BarChart,
  Phone,
  Shield,
  Zap,
  Users,
  FileText,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

const features = [
  {
    icon: Globe,
    title: "Multilingual Communication",
    description:
      "Native support for Hindi, English, and configurable regional languages with accurate intent recognition across all supported languages.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: FileText,
    title: "Knowledge Integration",
    description:
      "Seamless ingestion of institutional FAQs, circulars, and documents with RAG (Retrieval-Augmented Generation) for accurate responses.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: MessageSquare,
    title: "Smart Widget System",
    description:
      "Lightweight embeddable widgets that integrate into any college website with just a few lines of code.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Phone,
    title: "Voice Support",
    description:
      "Students can interact through voice calls in their preferred language, accessible to users with varying digital literacy levels.",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    icon: Users,
    title: "Fallback Mechanisms",
    description:
      "Seamless escalation to human operators when queries exceed AI capabilities, with full conversation history for context.",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  {
    icon: Zap,
    title: "24/7 Availability",
    description:
      "Students get instant answers regardless of office hours or holidays. Cloud-based architecture handles thousands of concurrent conversations.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <div className="pb-2 md:pb-5"> Everything You Need to</div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Campus Communication
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Comprehensive AI-powered platform with all the tools you need to
            provide exceptional multilingual support to your students.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
