import { FC } from "react"
import { Card, CardContent } from "@/components/ui/card"

// This would typically come from a database or API
const userName = "John"
const upcomingConcerts = [
  { id: 1, name: "Rock Festival 2024", date: "2024-07-15", image: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Jazz Night", date: "2024-08-02", image: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Pop Extravaganza", date: "2024-08-20", image: "/placeholder.svg?height=100&width=200" },
  { id: 4, name: "Classical Symphony", date: "2024-09-10", image: "/placeholder.svg?height=100&width=200" },
  { id: 5, name: "Electronic Beats", date: "2024-10-05", image: "/placeholder.svg?height=100&width=200" },
]
const venues = [
  { id: 1, name: "Berlin Arena", capacity: 20000, image: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Philharmonie", capacity: 2400, image: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Club XS", capacity: 500, image: "/placeholder.svg?height=100&width=200" },
  { id: 4, name: "Open Air Theater", capacity: 5000, image: "/placeholder.svg?height=100&width=200" },
  { id: 5, name: "Jazz Cellar", capacity: 150, image: "/placeholder.svg?height=100&width=200" },
]
const userConcerts = [
  { id: 1, name: "Techno Nights", date: "2024-09-05", image: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Classical Gala", date: "2024-09-15", image: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Rock Legends", date: "2024-10-01", image: "/placeholder.svg?height=100&width=200" },
]

function Section({ title, data }: { title: string; data: any[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative">
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-4">
            {data && data.length > 0 ? (
              data.map((item) => (
                <Card key={item.id} className="flex-shrink-0 w-64 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-4 rounded" />
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    {item.date && <p className="text-sm text-gray-600">{item.date}</p>}
                    {item.capacity && <p className="text-sm text-gray-600">Capacity: {item.capacity}</p>}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-white">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Home: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-white mb-8">Hi {userName}!</h1>
                
                <div className="space-y-12">
                    <Section title="Upcoming Concerts in Berlin" data={upcomingConcerts} />
                    <Section title="Your Upcoming Concerts" data={userConcerts} />
                    <Section title="Venues" data={venues} />
                </div>
                </div>
            </main>
        </div>    
    )
}

export default Home