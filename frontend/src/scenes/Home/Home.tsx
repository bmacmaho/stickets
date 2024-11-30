'use client'

import { FC, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, SearchIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import NavBar from '@/components/NavBar'
import { cn } from '@/lib/utils'

const upcomingConcerts = [
  { id: 1, name: "Rock Festival 2024", date: "2024-07-15", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cm9jayUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D" },
  { id: 2, name: "Jazz Night", date: "2024-08-02", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF6eiUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D" },
  { id: 3, name: "Pop Extravaganza", date: "2024-08-20", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9wJTIwY29uY2VydHxlbnwwfHwwfHx8MA%3D%3D" },
  { id: 4, name: "Classical Symphony", date: "2024-09-10", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNsYXNzaWNhbCUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D" },
  { id: 5, name: "Electronic Beats", date: "2024-10-05", image: "https://images.unsplash.com/photo-1574154894072-18ba0d48b476?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVsZWN0cm9uaWMlMjBtdXNpY3xlbnwwfHwwfHx8MA%3D%3D" },
]
const venues = [
  { id: 1, name: "Berlin Arena", capacity: 20000, image: "https://images.unsplash.com/photo-1507666664345-c49223375e33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydCUyMGFyZW5hfGVufDB8fDB8fHww" },
  { id: 2, name: "Philharmonie", capacity: 2400, image: "https://images.unsplash.com/photo-1543746746-46047c4f4bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydCUyMGhhbGx8ZW58MHx8MHx8fDA%3D" },
  { id: 3, name: "Club XS", capacity: 500, image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHQlMjBjbHVifGVufDB8fDB8fHww" },
  { id: 4, name: "Open Air Theater", capacity: 5000, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3BlbiUyMGFpciUyMHRoZWF0ZXJ8ZW58MHx8MHx8fDA%3D" },
  { id: 5, name: "Jazz Cellar", capacity: 150, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF6eiUyMGNsdWJ8ZW58MHx8MHx8fDA%3D" },
]
const userConcerts = [
  { id: 1, name: "Techno Nights", date: "2024-09-05", image: "https://images.unsplash.com/photo-1571266028243-3a9b4c8c6dff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlY2hubyUyMHBhcnR5fGVufDB8fDB8fHww" },
  { id: 2, name: "Classical Gala", date: "2024-09-15", image: "https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xhc3NpY2FsJTIwY29uY2VydHxlbnwwfHwwfHx8MA%3D%3D" },
  { id: 3, name: "Rock Legends", date: "2024-10-01", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJvY2slMjBjb25jZXJ0fGVufDB8fDB8fHww" },
]

function Section({ title, data, setBuyTicketsIsOpen}: { title: string; data: any[], setBuyTicketsIsOpen: any}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative">
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-4">
            {data && data.length > 0 ? (
              data.map((item) => (
                <Card key={item.id} className="flex-shrink-0 w-64 bg-white/90 backdrop-blur-sm">
                    <button onClick={() => setBuyTicketsIsOpen(true)} className={"w-full text-left transition-colors hover:bg-accent"}>
                        <CardContent className="p-4">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-32 object-cover mb-4 rounded"
                                loading="lazy"
                                />
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            {item.date && <p className="text-sm text-gray-600">{item.date}</p>}
                            {item.capacity && <p className="text-sm text-gray-600">Capacity: {item.capacity}</p>}
                        </CardContent>
                    </button>
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

interface HomeProps {
    setBuyTicketsIsOpen: any
}

const Home : FC<HomeProps> = ({setBuyTicketsIsOpen}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <NavBar />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search concerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Jazz">Jazz</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Classical">Classical</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" className={`w-[190px] justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-12">
            <Section title="Upcoming Concerts in Berlin" data={upcomingConcerts} setBuyTicketsIsOpen={setBuyTicketsIsOpen}/>
            <Section title="Your Upcoming Concerts" data={userConcerts} setBuyTicketsIsOpen={setBuyTicketsIsOpen} />
            <Section title="Venues" data={venues} setBuyTicketsIsOpen={setBuyTicketsIsOpen}/>
          </div>
        </div>
      </main>
    </div>    
  )
}


export default Home;