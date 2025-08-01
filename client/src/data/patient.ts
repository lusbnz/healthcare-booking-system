import {
    IconHeartHandshake,
    IconCalendarEvent,
    IconFileText,
    IconSearch,
  } from "@tabler/icons-react"
  
  export const patientSidebar = {
    user: {
      name: "Nguyễn Văn Nam",
      email: "nam@gmail.com",
      avatar: "/avatars/patient.jpg",
    },
    navMain: [
      {
        title: "Tổng Quan",
        url: "/patient/dashboard",
        icon: IconHeartHandshake,
      },
      {
        title: "Tìm Bác Sĩ",
        url: "/patient/find-doctor",
        icon: IconSearch,
      },
      {
        title: "Lịch Hẹn",
        url: "/patient/schedule",
        icon: IconCalendarEvent,
      },
      {
        title: "Hồ Sơ Y Tế",
        url: "/patient/medical-records",
        icon: IconFileText,
      },
    ],
  }