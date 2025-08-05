import { SymptomAnalyzer } from "@/components/symptoms/symptom-analyzer"

export default function SymptomsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Symptom Analysis</h1>
      <SymptomAnalyzer />
    </div>
  )
}