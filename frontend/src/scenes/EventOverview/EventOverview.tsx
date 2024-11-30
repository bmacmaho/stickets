'use client'

import { FC, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import NavBar from '@/components/NavBar'

const concert = {
    id: 1,
    name: 'Rock Festival 2023',
    description: 'A weekend of non-stop rock music featuring the biggest names in the industry. Get ready for an unforgettable experience with mind-blowing performances, incredible sound, and an electrifying atmosphere. This is the must-attend event of the year for all rock enthusiasts!',
    tickets: 1000,
    available: 50,
    price: 0.1,
    date: new Date(2023, 7, 15),
    genre: 'Rock',
    venue: 'Central Park, New York City',
    lineup: ['The Rolling Stones', 'Foo Fighters', 'Muse', 'The Killers', 'Arctic Monkeys']
}

interface EventOverviewProps {
    setBuyTicketsIsOpen: any
}

const EventOverview :FC<EventOverviewProps> = ({setBuyTicketsIsOpen}) => {
    const [quantity, setQuantity] = useState(1)

    const handlePurchase = () => {
        // Here you would typically interact with the smart contract to purchase the ticket
        console.log(`Purchasing ${quantity} ticket(s) for concert ${concert.id}`)
        // After purchase, you might want to update the available tickets
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <NavBar />
                <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Card className="overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white hover:bg-gray-100 transition-all"
                            onClick={() => setBuyTicketsIsOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cm9jayUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D"
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover"
                        />
                    <CardHeader>
                        <CardTitle className="text-3xl">{concert.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg mb-6">{concert.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="font-semibold">Date:</p>
                                <p>{format(concert.date, 'MMMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Venue:</p>
                                <p>{concert.venue}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Genre:</p>
                                <p>{concert.genre}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Available Tickets:</p>
                                <p>{concert.available}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Price per Ticket:</p>
                                <p>{concert.price} ETH</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold text-xl mb-2">Lineup:</h3>
                            <ul className="list-disc list-inside">
                                {concert.lineup.map((artist, index) => (
                                    <li key={index}>{artist}</li>
                                ))}
                            </ul>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full">Buy Tickets</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Purchase Tickets for {concert.name}</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={concert.available}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="mt-1"
                                    />
                                    <p className="mt-2">Total Price: {(quantity * concert.price).toFixed(2)} ETH</p>
                                    <Button className="w-full mt-4" onClick={handlePurchase}>
                                        Confirm Purchase
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default EventOverview;
