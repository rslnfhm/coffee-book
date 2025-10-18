import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

// Pages
export const usePage = (slug) =>
    useQuery({
        queryKey: ['page', slug],
        enabled: !!slug,
        queryFn: async () => (await api.get(`/pages/${slug}`)).data
    })

// Menu
export const useMenu = (opt = {}) =>
    useQuery({
        queryKey: ['menu', opt.category, opt.tag],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (opt.category) params.set('category', opt.category)
            if (opt.tag) params.set('tag', opt.tag)
            const url = `/menu${params.toString() ? `?${params.toString()}` : ''}`
            return (await api.get(url)).data
        }
    })

// Reviews
export const useReviews = () =>
    useQuery({
        queryKey: ['reviews'],
        queryFn: async () => (await api.get(`/reviews`)).data
    })

export const useCreateReview = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (payload) => (await api.post(`/reviews`, payload)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] })
    })
}

// EventsList
export const useEvents = () =>
    useQuery({
        queryKey: ['events'],
        queryFn: async () => (await api.get(`/events`)).data
    })

// Reservations
export const useCreateReservation = () =>
    useMutation({
        mutationFn: async (payload) => (await api.post(`/reservations`, payload)).data
    })
