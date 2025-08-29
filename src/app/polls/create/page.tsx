import Link from "next/link"
import { CreatePollForm } from "@/components/polls/CreatePollForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/polls">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create a New Poll</h1>
          <p className="text-gray-600 mt-2">
            Create engaging polls to gather opinions from your community
          </p>
        </div>
        
        <CreatePollForm />
      </div>
    </div>
  )
}
