// src/hooks/useApi.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

/* ===== Pages ===== */
export const usePage = (slug) =>
    useQuery({
        queryKey: ['page', slug],
        enabled: !!slug,
        queryFn: async () => (await api.get(`/pages/${slug}`)).data,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    })

/* ===== Menu ===== */
export const useMenu = (opt = {}) =>
    useQuery({
        queryKey: ['menu', opt.category || 'Все', opt.tag || 'Все'],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (opt.category) params.set('category', opt.category)
            if (opt.tag) params.set('tag', opt.tag)

            const url = `/menu${params.toString() ? `?${params.toString()}` : ''}`
            const res = await api.get(url)
            const payload = res?.data

            if (Array.isArray(payload)) return payload
            if (payload && Array.isArray(payload.items)) return payload.items
            if (payload && Array.isArray(payload.data)) return payload.data
            if (typeof payload === 'string') {
                try {
                    const parsed = JSON.parse(payload)
                    if (Array.isArray(parsed)) return parsed
                    if (parsed && Array.isArray(parsed.items)) return parsed.items
                } catch {}
            }
            return []
        },
        initialData: [],
        retry: 1,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

/* ===== Reviews ===== */
export const useReviews = () =>
    useQuery({
        queryKey: ['reviews'],
        queryFn: async () => (await api.get(`/reviews`)).data,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

export const useCreateReview = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (payload) => (await api.post(`/reviews`, payload)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
    })
}

/* ===== Events ===== */
export const useEvents = () =>
    useQuery({
        queryKey: ['events'],
        queryFn: async () => (await api.get(`/events`)).data,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

/* ===== Reservations ===== */
export const useCreateReservation = () =>
    useMutation({
        mutationFn: async (payload) => (await api.post(`/reservations`, payload)).data,
    })
