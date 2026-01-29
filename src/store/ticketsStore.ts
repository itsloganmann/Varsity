// Tickets store for peer-to-peer exchange
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, Game } from '../types';
import { mockTickets, mockGames } from '../data/mockData';

interface TicketsState {
    availableTickets: Ticket[];
    myListings: Ticket[];
    myPurchases: Ticket[];

    // Actions
    loadTickets: () => void;
    listTicket: (gameId: string, section: string, row: string, seat: string, price: number) => void;
    purchaseTicket: (ticketId: string, userCoins: number, onCoinsUpdate: (amount: number) => void) => boolean;
    cancelListing: (ticketId: string) => void;
}

export const useTicketsStore = create<TicketsState>()(
    persist(
        (set, get) => ({
            availableTickets: [],
            myListings: [],
            myPurchases: [],

            loadTickets: () => {
                set({ availableTickets: mockTickets });
            },

            listTicket: (gameId, section, row, seat, price) => {
                const game = mockGames.find(g => g.id === gameId);
                if (!game) return;

                const newTicket: Ticket = {
                    id: `ticket-${Date.now()}`,
                    gameId,
                    sellerId: 'current-user',
                    sellerName: 'You',
                    section,
                    row,
                    seat,
                    price,
                    status: 'available',
                    createdAt: new Date().toISOString(),
                    game,
                };

                set(state => ({
                    availableTickets: [newTicket, ...state.availableTickets],
                    myListings: [newTicket, ...state.myListings],
                }));
            },

            purchaseTicket: (ticketId, userCoins, onCoinsUpdate) => {
                const ticket = get().availableTickets.find(t => t.id === ticketId);
                if (!ticket) return false;

                if (ticket.price > userCoins) {
                    return false;
                }

                set(state => ({
                    availableTickets: state.availableTickets.filter(t => t.id !== ticketId),
                    myPurchases: [{ ...ticket, status: 'sold' }, ...state.myPurchases],
                }));

                onCoinsUpdate(-ticket.price);
                return true;
            },

            cancelListing: (ticketId) => {
                set(state => ({
                    availableTickets: state.availableTickets.filter(t => t.id !== ticketId),
                    myListings: state.myListings.filter(t => t.id !== ticketId),
                }));
            },
        }),
        {
            name: 'varsity-tickets-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
