import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const benefits = [
  "Reduce routine query load by 70%",
  "Provide 24/7 instant answers in 5+ languages",
  "Free staff to handle complex issues",
  "Improve student satisfaction and accessibility",
  "Scale effortlessly with growing student base",
  "Maintain complete conversation history",
];

export default function SolutionSection() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="mb-4 md:mb-8 bg-green-600">The Solution</Badge>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <div className="pb-2 md:pb-5">Meet ASKLY</div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Multilingual AI Assistant
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Transform campus communication with an intelligent chatbot that
            understands and responds in your students' native languages.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">What ASKLY Does For You</h3>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}

            <div className="pt-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="font-bold text-lg">Quick Setup</h4>
                </div>
                <p className="text-gray-600">
                  Get started in minutes, not months. Upload your documents,
                  customize your widget, and start helping students
                  immediately—no coding required.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview Placeholder */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                </div>
                <span className="text-white text-sm font-medium ml-4">
                  ASKLY Dashboard
                </span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white">
                <Image
                  alt="ASKLY Dashboard Preview"
                  height={582}
                  width={1080}
                  src="/dashboard.png"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">70%</div>
              <div className="text-xs text-gray-600">Less Queries</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
