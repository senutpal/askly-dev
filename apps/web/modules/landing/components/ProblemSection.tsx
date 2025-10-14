import { Badge } from "@workspace/ui/components/badge";
import { AlertCircle, Clock, Users, MessageSquareX } from "lucide-react";

const problems = [
  {
    icon: MessageSquareX,
    title: "Communication Barriers",
    description:
      "Students struggle with English-only support systems, creating gaps in understanding critical information.",
    stat: "60%",
    statLabel: "Students prefer native language",
  },
  {
    icon: Clock,
    title: "Long Wait Times",
    description:
      "Administrative offices handle hundreds of repetitive queries daily, leading to long queues and delayed responses.",
    stat: "6-7 hrs",
    statLabel: "Staff time on repetitive queries",
  },
  {
    icon: Users,
    title: "Limited Availability",
    description:
      "Office hours restrict access to information. Students need answers during exams, holidays, and off-hours.",
    stat: "24/7",
    statLabel: "When students need help",
  },
  {
    icon: AlertCircle,
    title: "Information Scattered",
    description:
      "Critical information buried in PDFs and circulars. Students can't find answers quickly when they need them.",
    stat: "100s",
    statLabel: "Documents to search through",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-10 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="destructive" className="mb-4">
            The Problem
          </Badge>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <div className="pb-2 md:pb-5"> Campus Communication</div>
            <span className=" bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              is Broken
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Students across India face daily challenges accessing basic
            institutional information, leading to frustration and inefficiency.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl p-6 hover:border-red-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <problem.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{problem.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {problem.description}
              </p>
              <div className="pt-4 border-t">
                <div className="text-2xl font-bold text-red-600">
                  {problem.stat}
                </div>
                <div className="text-xs text-gray-500">{problem.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Statement */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 text-center">
          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            "We spend <span className="text-red-600">thousands of hours</span>{" "}
            answering the same questions, while students wait in{" "}
            <span className="text-red-600">long queues</span> for simple
            information."
          </p>
          <p className="text-gray-600">
            — Common frustration across campus administrative offices
          </p>
        </div>
      </div>
    </section>
  );
}
