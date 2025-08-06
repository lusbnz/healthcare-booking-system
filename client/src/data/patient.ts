import {
    IconHeartHandshake,
    IconCalendarEvent,
    IconFileText,
    IconSearch,
  } from "@tabler/icons-react"
  
  export const patientSidebar = {
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
        url: "/patient/my-schedule",
        icon: IconCalendarEvent,
      },
      {
        title: "Hồ Sơ Y Tế",
        url: "/patient/medical-records",
        icon: IconFileText,
      },
    ],
  }