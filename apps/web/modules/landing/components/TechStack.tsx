import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";

const techCategories = [
  {
    category: "Frontend",
    color: "from-blue-500 to-cyan-500",
    technologies: [
      { name: "Next.js 15", description: "React framework with App Router" },
      { name: "React 19", description: "Latest React features" },
      { name: "Tailwind CSS", description: "Utility-first styling" },
      { name: "shadcn/ui", description: "Beautiful UI components" },
    ],
  },
  {
    category: "Backend",
    color: "from-purple-500 to-pink-500",
    technologies: [
      { name: "Convex", description: "Real-time database & serverless" },
      { name: "Clerk", description: "Authentication & user management" },
      { name: "OpenAI", description: "Advanced language models" },
      { name: "Turborepo", description: "Monorepo build system" },
    ],
  },
  {
    category: "AI & Voice",
    color: "from-green-500 to-teal-500",
    technologies: [
      { name: "RAG", description: "Retrieval-Augmented Generation" },
      { name: "Vapi", description: "Voice conversation integration" },
      { name: "NLP", description: "Natural language processing" },
      { name: "Multi-lingual", description: "5+ language support" },
    ],
  },
  {
    category: "Infrastructure",
    color: "from-orange-500 to-red-500",
    technologies: [
      { name: "Vercel", description: "Edge deployment & hosting" },
      { name: "Serverless", description: "Scalable cloud functions" },
      { name: "WebSocket", description: "Real-time communication" },
      { name: "REST API", description: "External integrations" },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4">
            Technology Stack
          </Badge>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <div className="pb-2 md:pb-5">Built with</div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern, Scalable Technology
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Enterprise-grade architecture designed for reliability, performance,
            and seamless scalability.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {techCategories.map((category, index) => (
            <Card
              key={index}
              className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden group"
            >
              <div
                className={`h-2 bg-gradient-to-r ${category.color} group-hover:h-3 transition-all duration-300`}
              />
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">{category.category}</h3>
                <div className="space-y-4">
                  {category.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} mt-2 flex-shrink-0`}
                      />
                      <div>
                        <div className="font-semibold">{tech.name}</div>
                        <div className="text-sm text-gray-600">
                          {tech.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
