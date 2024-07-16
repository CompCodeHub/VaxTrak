import { APPOINTMENTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const appointmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentsByDate: builder.query({
      query: ({ hospitalId, date }) =>
        `${APPOINTMENTS_URL}?hospitalId=${hospitalId}&date=${date}`,
      providesTags: ["Appointment"],
    }),
    getAvailableAppointments: builder.query({
      query: ({ hospitalId, date }) =>
        `${APPOINTMENTS_URL}/available-slots?hospitalId=${hospitalId}&date=${date}`,
      providesTags: ["Appointment"],
    }),
    makeAppointment: builder.mutation({
      query: (data) => ({
        url: APPOINTMENTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    getUserAppointmentsByDate: builder.query({
      query: ({ userId, date }) =>
        `${APPOINTMENTS_URL}/user-appointments?userId=${userId}&date=${date}`,
      providesTags: ["Appointment"],
    }),
    cancelAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINTMENTS_URL}/${appointmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment"],
    }),
    payAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINTMENTS_URL}/${appointmentId}/pay`,
        method: "PUT",
      }),
      invalidatesTags: ["Appointment"],
    }),
    getUnapprovedAppointments: builder.query({
      query: (hospitalId) =>
        `${APPOINTMENTS_URL}/unapproved?hospitalId=${hospitalId}`,
      providesTags: ["Appointment"],
    }),
    approveAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINTMENTS_URL}/${appointmentId}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["Appointment"],
    }),
    markAppointmentAsCompleted: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINTMENTS_URL}/${appointmentId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: ["Appointment", "Reports"],
    }),
  }),
});

export const {
  useGetAppointmentsByDateQuery,
  useGetAvailableAppointmentsQuery,
  useMakeAppointmentMutation,
  useGetUserAppointmentsByDateQuery,
  useCancelAppointmentMutation,
  usePayAppointmentMutation,
  useGetUnapprovedAppointmentsQuery,
  useApproveAppointmentMutation,
  useMarkAppointmentAsCompletedMutation,
} = appointmentsApiSlice;
